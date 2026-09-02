#!/usr/bin/env node
/*  Tells search engines a new post exists, immediately after publish.
 *
 *  Three independent channels, each optional and each failing soft - a
 *  publish must never be rolled back because an indexing endpoint was down:
 *
 *   1. Google Indexing API (URL_UPDATED). Requires a service account that
 *      has been added as an OWNER of the property in Search Console.
 *      NOTE: Google documents this API as supporting JobPosting and
 *      BroadcastEvent only. It commonly accepts other URLs and speeds up
 *      discovery, but it is NOT a guaranteed or supported path for ordinary
 *      articles - sitemap.xml remains the channel Google is contracted to
 *      honour, which is why the sitemap is always updated first.
 *   2. IndexNow - the supported instant-notification protocol for Bing,
 *      Yandex, Naver and Seznam.
 *   3. Google sitemap ping is deliberately NOT here: Google retired that
 *      endpoint in 2023 and it now returns 404.
 *
 *  Env (all optional - each missing key just skips its channel):
 *    GOOGLE_INDEXING_CREDENTIALS   service-account JSON, as a single line
 *    INDEXNOW_KEY                  the key, matching /<key>.txt at the root
 *
 *  Usage:
 *    node scripts/ping-indexers.js                 submit last-published.json
 *    node scripts/ping-indexers.js <url> [url...]  submit explicit URLs
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const blog = require("./lib/blog");

const LAST_PUBLISHED = path.join(blog.ROOT, "content", "blog", "last-published.json");

function urlsToSubmit() {
  const explicit = process.argv.slice(2).filter((a) => a.startsWith("http"));
  if (explicit.length) return explicit;

  if (!fs.existsSync(LAST_PUBLISHED)) return [];
  const data = JSON.parse(fs.readFileSync(LAST_PUBLISHED, "utf8"));
  return Array.isArray(data.urls) ? data.urls : [];
}

/* ------------------------------------------------- Google service account */

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/*  Signs a JWT and exchanges it for an access token. Done by hand rather than
 *  with googleapis so the workflow needs no extra dependency for one call. */
async function googleAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    })
  );

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(header + "." + claim);
  const signature = signer.sign(creds.private_key).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: header + "." + claim + "." + signature
    })
  });

  const json = await res.json();
  if (!res.ok) throw new Error("token exchange failed (" + res.status + "): " + JSON.stringify(json));
  return json.access_token;
}

async function submitToGoogle(urls) {
  const rawCreds = process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (!rawCreds) {
    console.log("Google Indexing API : skipped (GOOGLE_INDEXING_CREDENTIALS not set)");
    return;
  }

  let creds;
  try {
    creds = JSON.parse(rawCreds);
  } catch (err) {
    console.log("Google Indexing API : skipped (credentials are not valid JSON)");
    return;
  }

  // The sitemap is not a page, so it is never sent to the Indexing API.
  const pages = urls.filter((u) => !u.endsWith(".xml"));
  if (!pages.length) return;

  let token;
  try {
    token = await googleAccessToken(creds);
  } catch (err) {
    console.log("Google Indexing API : FAILED to authenticate - " + err.message);
    return;
  }

  for (const url of pages) {
    try {
      const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({ url: url, type: "URL_UPDATED" })
      });
      const text = await res.text();
      console.log(
        "Google Indexing API : " + (res.ok ? "OK  " : "ERR " + res.status + " ") + url +
          (res.ok ? "" : " -> " + text.slice(0, 300))
      );
    } catch (err) {
      console.log("Google Indexing API : ERR " + url + " -> " + err.message);
    }
  }
}

/* ---------------------------------------------------------------- IndexNow */

async function submitToIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.log("IndexNow            : skipped (INDEXNOW_KEY not set)");
    return;
  }

  const host = new URL(blog.ORIGIN).host;
  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: host,
        key: key,
        keyLocation: blog.ORIGIN + "/" + key + ".txt",
        urlList: urls
      })
    });
    // 200 accepted, 202 accepted-pending-key-validation; both are success.
    console.log("IndexNow            : " + res.status + " for " + urls.length + " URL(s)");
    if (res.status >= 400) console.log("                      " + (await res.text()).slice(0, 300));
  } catch (err) {
    console.log("IndexNow            : ERR " + err.message);
  }
}

/* -------------------------------------------------------------------- run */

(async () => {
  const urls = urlsToSubmit();
  if (!urls.length) {
    console.log("Nothing to submit - no URLs given and no last-published.json found.");
    return;
  }

  console.log("Submitting " + urls.length + " URL(s):");
  urls.forEach((u) => console.log("  " + u));
  console.log("");

  await submitToGoogle(urls);
  await submitToIndexNow(urls);
})().catch((err) => {
  // Never fail the workflow over indexing - the post is already live.
  console.error("ping-indexers: " + err.message);
});
