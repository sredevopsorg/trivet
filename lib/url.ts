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
