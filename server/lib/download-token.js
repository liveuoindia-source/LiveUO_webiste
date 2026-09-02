const crypto = require("crypto");

const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || crypto.randomBytes(32).toString("hex");
const TTL_MS = 5 * 60 * 1000; // 5-minute signed download link

function sign(assetId) {
  const exp = Date.now() + TTL_MS;
  const payload = Buffer.from(JSON.stringify({ a: assetId, e: exp })).toString("base64url");
  const mac = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return payload + "." + mac;
}

function verify(token, assetId) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, mac] = token.split(".");
  const expectedMac = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (mac !== expectedMac) return false;
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  return data.a === assetId && Date.now() < data.e;
}

module.exports = { sign, verify };
