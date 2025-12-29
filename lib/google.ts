export interface GoogleUserInfo {
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  aud?: string;
}

export function buildGoogleAuthUrl({
  clientId,
  redirectUri,
  state,
  prompt = "select_account"
}: {
  clientId: string;
  redirectUri: string;
  state: string;
  prompt?: string;
}) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("prompt", prompt);
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCodeForTokens({
  code,
  clientId,
  clientSecret,
  redirectUri
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code"
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token exchange failed: ${text}`);
  }

  return (await response.json()) as {
    access_token: string;
    id_token: string;
  };
}

export async function verifyIdToken(idToken: string) {
  const url = new URL("https://oauth2.googleapis.com/tokeninfo");
  url.searchParams.set("id_token", idToken);
  const response = await fetch(url.toString());

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token verification failed: ${text}`);
  }

  const data = (await response.json()) as GoogleUserInfo & {
    email_verified?: string;
  };

  if (!data.email) {
    throw new Error("Google token missing email");
  }

  return data;
}
