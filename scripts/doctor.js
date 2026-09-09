#!/usr/bin/env node
/*  Deployment diagnostic for the Plesk / iisnode host.
 *
 *  Written because Plesk's "Run Node.js commands" box prefixes everything with
 *  `npm`, so `node -e "..."` is not runnable there. This file is instead run
 *  with the Node.js panel's "Run script" button, or `npm run doctor`.
 *
 *  It answers the three questions that decide why iisnode returns
 *  500.1002 / HRESULT 0x2 (which is Windows ERROR_FILE_NOT_FOUND):
 *
 *    1. which node.exe is running   -> the value web.config must name
 *    2. do the real dependencies load
 *    3. is .env present, in the folder Node actually starts from
 *
 *  Prints no secret values - only whether a key is set.
 */

const fs = require("fs");
const path = require("path");

const line = (k, v) => console.log("  " + String(k).padEnd(26) + " " + v);

console.log("\n=== NODE =====================================================");
line("process.execPath", process.execPath);
line("process.version", process.version);
line("process.arch", process.arch);
line("cwd", process.cwd());
line("__dirname", __dirname);

console.log("\n=== DEPENDENCIES =============================================");
for (const mod of ["express", "express-session", "better-sqlite3", "nodemailer", "dotenv", "multer", "express-rate-limit", "bcryptjs"]) {
  try {
    require.resolve(mod);
    line(mod, "OK");
  } catch (err) {
    line(mod, "MISSING  <-- run NPM install");
  }
}

console.log("\n=== .env =====================================================");
const appRoot = path.join(__dirname, "..");
const envPath = path.join(appRoot, ".env");
line("expected at", envPath);
line("exists", fs.existsSync(envPath) ? "YES" : "NO  <-- create it here");

if (fs.existsSync(envPath)) {
  try {
    require("dotenv").config({ path: envPath });
  } catch (err) {
    line("dotenv", "failed: " + err.message);
  }
  const want = [
    "SESSION_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD",
    "RECAPTCHA_SITE_KEY", "RECAPTCHA_SECRET_KEY",
    "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CONTACT_TO_EMAIL"
  ];
  for (const k of want) {
    const v = process.env[k];
    /* Placeholders pasted verbatim from a template are a real failure mode, so
     * flag them rather than reporting the key as merely "set". Test for a value
     * that *opens* with "<", not one that merely contains it: SMTP_FROM is
     * legitimately `Name <addr@host>` and must not be reported as unset. */
    const bad = v && (v.trim().charAt(0) === "<" || v.indexOf("your-") === 0);
    line(k, !v ? "NOT SET" : bad ? "PLACEHOLDER  <-- replace with a real value" : "set");
  }
}

console.log("\n=== APP FILES ================================================");
for (const rel of ["server.js", "package.json", "node_modules", "web.config", "server/private", "server/private/viewers.json"]) {
  line(rel, fs.existsSync(path.join(appRoot, rel)) ? "present" : "absent");
}

console.log("\n=== CAN THE APP BE LOADED? ===================================");
try {
  // Requiring server.js would bind a port, so only its dependency graph is
  // exercised here - that is where a broken native build actually surfaces.
  require(path.join(appRoot, "server", "db.js"));
  console.log("  server/db.js loaded (better-sqlite3 native build is OK)");
} catch (err) {
  console.log("  server/db.js FAILED: " + err.message);
}

/*  Last, because it is the only asynchronous check.
 *
 *  Sending the OTP is the one operation that leaves the server, so it fails
 *  for reasons nothing else does - many hosts block outbound port 587 at the
 *  firewall, and from inside the app that is indistinguishable from a wrong
 *  password. verify() authenticates without sending anything, which separates
 *  the two. No secret is printed either way.
 */
console.log("\n=== SMTP =====================================================");

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  line("status", "NOT CONFIGURED - SMTP_HOST/USER/PASS missing from .env");
  line("effect", "the viewer answers 'Could not send the code right now'");
  console.log("\nDone.\n");
} else {
  line("host", process.env.SMTP_HOST + ":" + (process.env.SMTP_PORT || 587));
  line("user", process.env.SMTP_USER);

  let nodemailer = null;
  try {
    nodemailer = require("nodemailer");
  } catch (err) {
    line("nodemailer", "MISSING - run NPM install");
    console.log("\nDone.\n");
  }

  if (nodemailer) {
    nodemailer
      .createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure:
          String(process.env.SMTP_SECURE).toLowerCase() === "true" ||
          Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 15000
      })
      .verify()
      .then(() => {
        line("connection", "OK - credentials accepted, mail can be sent");
      })
      .catch((err) => {
        line("connection", "FAILED - " + err.message);
        if (/ETIMEDOUT|ECONNREFUSED|ENOTFOUND|timeout|EHOSTUNREACH/i.test(err.message)) {
          line("likely cause", "outbound SMTP blocked by the host firewall, NOT a bad password");
          line("what to do", "ask the host to open outbound TCP 587, or use their own relay");
        } else if (/auth|credential|username|password|BadCredentials|535/i.test(err.message)) {
          line("likely cause", "the Gmail app password is wrong or has been revoked");
        }
      })
      .finally(() => console.log("\nDone.\n"));
  }
}
