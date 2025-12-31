export function normalizeBlogHost(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Blog URL is required");
  }

  const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;

  const url = new URL(withProtocol);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Blog URL must be http or https");
  }

  return url.origin;
}

function parseForwardedHeader(forwarded: string) {
  const first = forwarded.split(",")[0]?.trim();
  if (!first) {
    return {};
  }

  const parts = first.split(";").map((part) => part.trim());
  const entries = parts.map((part) => {
    const [key, value] = part.split("=");
    return [key?.toLowerCase(), value?.replace(/^"|"$/g, "")];
  });

  const result: { proto?: string; host?: string } = {};
  for (const [key, value] of entries) {
    if (!value) {
      continue;
    }
    if (key === "proto") {
      result.proto = value;
    }
    if (key === "host") {
      result.host = value;
    }
  }

  return result;
}

export function getPublicBaseUrl(headers: Headers, fallbackOrigin?: string) {
  const envUrl = process.env.TRIVET_PUBLIC_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const forwardedHost = headers.get("x-forwarded-host");
  const forwardedProto = headers.get("x-forwarded-proto");
  const forwarded = headers.get("forwarded");
  const parsedForwarded = forwarded ? parseForwardedHeader(forwarded) : {};

  const host = forwardedHost ?? parsedForwarded.host ?? headers.get("host");
  let proto = forwardedProto ?? parsedForwarded.proto;

  if (!proto && fallbackOrigin) {
    try {
      proto = new URL(fallbackOrigin).protocol.replace(":", "");
    } catch {
      proto = undefined;
    }
  }

  if (host && proto) {
    return `${proto}://${host}`;
  }

  return fallbackOrigin ?? "http://localhost:3000";
}

export function ensureSafeRedirect(target: string | null, trivetBaseUrl?: string) {
  if (!target) {
    return null;
  }

  try {
    const url = new URL(target);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    if (trivetBaseUrl) {
      const trivet = new URL(trivetBaseUrl);
      if (
        url.hostname === trivet.hostname ||
        url.hostname.endsWith(`.${trivet.hostname}`)
      ) {
        return null;
      }
    }

    return url.toString();
  } catch {
    return null;
  }
}
