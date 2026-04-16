function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function html(body: string, status = 200, headers?: HeadersInit) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  const parts = cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (!part) continue;
    const [k, ...rest] = part.split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function postMessagePage(origin: string, message: string) {
  const safeOrigin = JSON.stringify(origin);
  const safeMessage = JSON.stringify(message);
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        try {
          if (window.opener) {
            window.opener.postMessage(${safeMessage}, ${safeOrigin});
          }
        } finally {
          window.close();
        }
      })();
    </script>
  </body>
</html>`;
}

export async function onRequestGet(context: { request: Request; env: Record<string, string | undefined> }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin;

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return jsonError("Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET in Cloudflare Pages environment variables.", 500);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    const nextState = randomState();
    const redirectUri = `${origin}/api/auth`;
    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("scope", "repo");
    authorizeUrl.searchParams.set("state", nextState);

    return new Response(null, {
      status: 302,
      headers: {
        location: authorizeUrl.toString(),
        "cache-control": "no-store",
        "set-cookie": `cms_oauth_state=${encodeURIComponent(nextState)}; Path=/; Secure; HttpOnly; SameSite=Lax`,
      },
    });
  }

  const expectedState = getCookie(request, "cms_oauth_state");
  if (!state || !expectedState || state !== expectedState) {
    return html(postMessagePage(origin, `authorization:github:error:${JSON.stringify({ error: "Invalid OAuth state" })}`), 200, {
      "set-cookie": "cms_oauth_state=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax",
    });
  }

  const redirectUri = `${origin}/api/auth`;
  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      state,
    }),
  });

  const tokenJson = (await tokenResp.json()) as { access_token?: string; error?: string; error_description?: string };

  if (!tokenResp.ok || !tokenJson.access_token) {
    const errorMessage = tokenJson.error_description || tokenJson.error || "OAuth token exchange failed";
    return html(
      postMessagePage(origin, `authorization:github:error:${JSON.stringify({ error: errorMessage })}`),
      200,
      {
        "set-cookie": "cms_oauth_state=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax",
      },
    );
  }

  return html(
    postMessagePage(origin, `authorization:github:success:${JSON.stringify({ token: tokenJson.access_token })}`),
    200,
    {
      "set-cookie": "cms_oauth_state=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax",
    },
  );
}

