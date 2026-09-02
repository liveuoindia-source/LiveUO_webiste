const session = require("express-session");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { db } = require("./db");

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 }
});

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.role === "admin") return next();
  return res.status(403).json({ error: "Admin access required" });
}

function requireAuthPage(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect("/admin/login");
}

function login(email, password) {
  const user = db
    .prepare("SELECT * FROM users WHERE email = ? AND active = 1")
    .get(email);
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  return user;
}

module.exports = { sessionMiddleware, requireAuth, requireAdmin, requireAuthPage, login };
