import { SignJWT, jwtVerify } from "jose";

const STATE_EXPIRY_SECONDS = 60 * 10;

export interface AuthState {
  flow: "owner" | "member";
  accountUuid?: string;
  redirect?: string | null;
  nonce: string;
}

function getStateKey() {
  const secret = process.env.TRIVET_SESSION_SECRET;
  if (!secret) {
    throw new Error("TRIVET_SESSION_SECRET is not configured.");
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthState(state: AuthState) {
  return new SignJWT(state)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${STATE_EXPIRY_SECONDS}s`)
    .sign(getStateKey());
}

export async function verifyAuthState(token: string) {
  const { payload } = await jwtVerify(token, getStateKey());
  return payload as AuthState;
}
