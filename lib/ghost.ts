import GhostAdminAPI from "@tryghost/admin-api";
import { SignJWT } from "jose";

const GHOST_ADMIN_VERSION = "v5.0";
const GHOST_ADMIN_AUDIENCE = "/v5/admin/";
const TRIVET_LABEL = "Trivet";

export interface GhostMember {
  id: string;
  labels?: Array<{ name: string }>;
}

export interface GhostAdminClient {
  members: {
    browse: (options: { filter: string; limit: number }) => Promise<GhostMember[]>;
    add: (data: {
      email: string;
      name?: string;
      labels?: Array<{ name: string }>;
    }) => Promise<GhostMember>;
    edit: (data: {
      id: string;
      labels?: Array<{ name: string }>;
    }) => Promise<GhostMember>;
  };
  site: {
    read: () => Promise<unknown>;
  };
}

export function createGhostAdminClient({
  adminHost,
  adminApiKey
}: {
  adminHost: string;
  adminApiKey: string;
}): GhostAdminClient {
  return new GhostAdminAPI({
    url: adminHost.startsWith("http") ? adminHost : `https://${adminHost}`,
    key: adminApiKey,
    version: GHOST_ADMIN_VERSION
  });
}

function getAdminUrl(adminHost: string) {
  return adminHost.startsWith("http") ? adminHost : `https://${adminHost}`;
}

async function createGhostAdminToken(adminApiKey: string) {
  const [id, secret] = adminApiKey.split(":");
  if (!id || !secret) {
    throw new Error("Invalid Ghost Admin API key format");
  }

  const key = Buffer.from(secret, "hex");
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    iat: now,
    exp: now + 5 * 60,
    aud: GHOST_ADMIN_AUDIENCE
  })
    .setProtectedHeader({ alg: "HS256", kid: id })
    .sign(key);
}

export async function findMemberByEmail(api: GhostAdminClient, email: string) {
  const members = await api.members.browse({
    filter: `email:'${email}'`,
    limit: 1
  });

  return members[0] ?? null;
}

export async function createMember(
  api: GhostAdminClient,
  { email, name }: { email: string; name?: string }
) {
  return await api.members.add({
    email,
    name,
    labels: [{ name: TRIVET_LABEL }]
  });
}

export async function ensureMemberLabel(
  api: GhostAdminClient,
  member: GhostMember
) {
  const hasLabel = member.labels?.some((label) => label.name === TRIVET_LABEL);
  if (hasLabel) {
    return member;
  }

  const labels = [...(member.labels ?? []), { name: TRIVET_LABEL }];
  return await api.members.edit({
    id: member.id,
    labels
  });
}

export async function createMemberSignInUrl({
  adminHost,
  adminApiKey,
  memberId,
  redirect
}: {
  adminHost: string;
  adminApiKey: string;
  memberId: string;
  redirect?: string | null;
}) {
  const token = await createGhostAdminToken(adminApiKey);
  const url = new URL(
    `/ghost/api/admin/members/${memberId}/signin_urls/`,
    getAdminUrl(adminHost)
  );

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Ghost ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(redirect ? { redirect } : {})
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ghost sign-in URL failed: ${text}`);
  }

  const data = (await response.json()) as {
    url?: string;
    signin_url?: string;
    signin_urls?: Array<{ url: string }>;
  };

  const signInUrl =
    data.url ?? data.signin_url ?? data.signin_urls?.[0]?.url ?? null;

  if (!signInUrl) {
    throw new Error("Ghost sign-in URL missing");
  }

  return signInUrl;
}

export async function validateAdminApiKey({
  adminHost,
  adminApiKey
}: {
  adminHost: string;
  adminApiKey: string;
}) {
  const api = createGhostAdminClient({ adminHost, adminApiKey });
  await api.site.read();
}
