function adminLayout({ title, active, body, session }) {
  const nav = [
    ["dashboard", "/admin/dashboard", "Dashboard"],
    ["downloads", "/admin/downloads", "Downloads"],
    ["leads", "/admin/leads", "Leads"],
    ["users", "/admin/users", "Users"]
  ];
  const navHtml = nav
    .filter(([key]) => key !== "users" || (session && session.role === "admin"))
    .map(
      ([key, href, label]) =>
        `<a href="${href}" class="${key === active ? "active" : ""}">${label}</a>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex, nofollow"/><title>${title} — LiVEUO Admin</title>
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml"/>
<link rel="stylesheet" href="/_next/static/chunks/3plzysnn66upc.css"/>
<style>
body{background:var(--paper-dim)}
.admin-shell{display:flex;min-height:100vh}
.admin-sidebar{width:220px;flex:none;background:var(--ink);color:#fff;padding:28px 18px;display:flex;flex-direction:column;gap:6px}
.admin-sidebar .brand{font-family:var(--f-display);font-weight:700;font-size:18px;margin-bottom:24px;display:flex;align-items:center;gap:8px}
.admin-sidebar a{color:#a9b2c3;padding:10px 12px;border-radius:8px;font-size:14px}
.admin-sidebar a:hover{background:#ffffff14;color:#fff}
.admin-sidebar a.active{background:var(--brand-grad);color:#fff}
.admin-sidebar .signout{margin-top:auto;color:#a9b2c3;cursor:pointer;font-size:13px;padding:10px 12px}
.admin-main{flex:1;padding:36px 40px;max-width:1100px}
.admin-main h1{font-size:26px;margin-bottom:6px}
.admin-topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.admin-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px;margin-bottom:20px}
.admin-table{width:100%;border-collapse:collapse;font-size:13.5px}
.admin-table th,.admin-table td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line)}
.admin-table th{font-family:var(--f-mono);text-transform:uppercase;font-size:11px;letter-spacing:.05em;color:var(--slate-60)}
.admin-badge{font-family:var(--f-mono);font-size:10.5px;text-transform:uppercase;padding:3px 9px;border-radius:999px;display:inline-block}
.admin-badge.draft{background:#f1e6c8;color:#8a6d1a}
.admin-badge.published{background:#d5f0e2;color:#14855a}
.admin-actions button, .admin-actions a{font-size:12.5px;margin-right:8px;color:var(--accent);cursor:pointer;background:none;border:none;padding:0}
.admin-filters{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
.admin-filters select{padding:8px 12px;border-radius:8px;border:1px solid var(--line);font-size:13px}
.stat-row{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:24px}
.stat-tile{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px 26px;min-width:160px}
.stat-tile strong{display:block;font-family:var(--f-display);font-size:28px;color:var(--ink)}
.stat-tile span{font-family:var(--f-mono);font-size:11.5px;color:var(--slate-60)}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center}
.login-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:40px;width:100%;max-width:380px}
.err{color:#c0392b;font-size:13px;margin-top:10px;display:none}
</style></head><body>
<div class="admin-shell">
  <aside class="admin-sidebar">
    <div class="brand"><img src="/assets/logo-mark.svg" style="height:22px" alt=""/> LiVEUO Admin</div>
    ${navHtml}
    <span class="signout" id="signout">Sign out</span>
  </aside>
  <main class="admin-main">${body}</main>
</div>
<script>
document.getElementById("signout") && document.getElementById("signout").addEventListener("click", function () {
  fetch("/api/admin/logout", { method: "POST" }).then(function () { window.location.href = "/admin/login"; });
});
</script>
</body></html>`;
}

function loginPage(error) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex, nofollow"/><title>Sign in — LiVEUO Admin</title>
<link rel="icon" href="/assets/logo-mark.svg" type="image/svg+xml"/>
<link rel="stylesheet" href="/_next/static/chunks/3plzysnn66upc.css"/>
<style>body{background:var(--paper-dim)}.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center}.login-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:40px;width:100%;max-width:380px}.err{color:#c0392b;font-size:13px;margin-top:10px}</style>
</head><body><div class="login-wrap"><div class="login-card">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:22px"><img src="/assets/logo-mark.svg" style="height:28px" alt=""/><strong style="font-family:var(--f-display);font-size:18px">LiVEUO Admin</strong></div>
<form id="login-form">
<div class="form-group"><label for="email">Email</label><input id="email" name="email" type="email" required/></div>
<div class="form-group"><label for="password">Password</label><input id="password" name="password" type="password" required/></div>
<button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Sign in</button>
<p class="err" id="err" style="display:${error ? "block" : "none"}">${error || ""}</p>
</form>
</div></div>
<script>
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  fetch("/api/admin/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: document.getElementById("email").value, password: document.getElementById("password").value })
  }).then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(function () { window.location.href = "/admin/downloads"; })
    .catch(function () {
      var el = document.getElementById("err");
      el.textContent = "Invalid email or password.";
      el.style.display = "block";
    });
});
</script>
</body></html>`;
}

module.exports = { adminLayout, loginPage };
