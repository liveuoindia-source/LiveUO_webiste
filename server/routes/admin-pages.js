const express = require("express");
const { requireAuthPage } = require("../auth");
const { adminLayout, loginPage } = require("../lib/layout");

const router = express.Router();

router.get("/", requireAuthPage, (req, res) => res.redirect("/admin/downloads"));

router.get("/login", (req, res) => {
  if (req.session && req.session.userId) return res.redirect("/admin/downloads");
  res.send(loginPage());
});

router.get("/dashboard", requireAuthPage, (req, res) => {
  const body = `
    <div class="admin-topbar"><h1>Dashboard</h1></div>
    <div class="stat-row" id="stats"><div class="stat-tile"><span>Loading…</span></div></div>
    <div class="admin-card"><p>Welcome back, ${req.session.email}. Use <a href="/admin/downloads">Downloads</a> to manage brochures and fliers, or <a href="/admin/leads">Leads</a> to see who's requested a gated download.</p></div>
    <script>
      Promise.all([fetch("/api/admin/assets").then(r=>r.json()), fetch("/api/admin/leads").then(r=>r.json())]).then(function(res){
        var assets = res[0], leads = res[1];
        var published = assets.filter(function(a){return a.status==="published"}).length;
        var draft = assets.filter(function(a){return a.status==="draft"}).length;
        var totalDownloads = assets.reduce(function(s,a){return s+a.download_count;}, 0);
        document.getElementById("stats").innerHTML =
          '<div class="stat-tile"><strong>'+assets.length+'</strong><span>TOTAL ASSETS</span></div>' +
          '<div class="stat-tile"><strong>'+published+'</strong><span>PUBLISHED</span></div>' +
          '<div class="stat-tile"><strong>'+draft+'</strong><span>DRAFTS</span></div>' +
          '<div class="stat-tile"><strong>'+totalDownloads+'</strong><span>TOTAL DOWNLOADS</span></div>' +
          '<div class="stat-tile"><strong>'+leads.length+'</strong><span>LEADS CAPTURED</span></div>';
      });
    </script>`;
  res.send(adminLayout({ title: "Dashboard", active: "dashboard", body, session: req.session }));
});

router.get("/downloads", requireAuthPage, (req, res) => {
  const body = `
    <div class="admin-topbar"><h1>Downloads</h1><a class="btn btn-primary" href="/admin/downloads/new">Upload new asset</a></div>
    <div class="admin-filters">
      <select id="f-category"><option value="">All categories</option></select>
      <select id="f-status"><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></select>
    </div>
    <div class="admin-card"><table class="admin-table" id="table"><thead><tr><th>Title</th><th>Category</th><th>Version</th><th>Status</th><th>Downloads</th><th></th></tr></thead><tbody><tr><td colspan="6">Loading…</td></tr></tbody></table></div>
    <script>
      var catSelect = document.getElementById("f-category");
      fetch("/api/admin/categories").then(r=>r.json()).then(function(cats){
        cats.forEach(function(c){ var o=document.createElement("option"); o.value=c.slug; o.textContent=c.name; catSelect.appendChild(o); });
      });
      function statusBadge(s){ return '<span class="admin-badge '+s+'">'+s+'</span>'; }
      function load(){
        var params = new URLSearchParams();
        if (catSelect.value) params.set("category", catSelect.value);
        if (document.getElementById("f-status").value) params.set("status", document.getElementById("f-status").value);
        fetch("/api/admin/assets?"+params.toString()).then(r=>r.json()).then(function(rows){
          var tbody = document.querySelector("#table tbody");
          if (!rows.length) { tbody.innerHTML = '<tr><td colspan="6">No assets yet.</td></tr>'; return; }
          tbody.innerHTML = rows.map(function(a){
            return '<tr><td>'+a.title+'</td><td>'+a.category_name+'</td><td>'+(a.version_label||'—')+'</td><td>'+statusBadge(a.status)+'</td><td>'+a.download_count+'</td>'+
              '<td class="admin-actions"><a href="/admin/downloads/'+a.id+'">Edit</a></td></tr>';
          }).join("");
        });
      }
      document.getElementById("f-category").addEventListener("change", load);
      document.getElementById("f-status").addEventListener("change", load);
      load();
    </script>`;
  res.send(adminLayout({ title: "Downloads", active: "downloads", body, session: req.session }));
});

router.get("/downloads/new", requireAuthPage, (req, res) => {
  const body = `
    <div class="admin-topbar"><h1>Upload new asset</h1></div>
    <div class="admin-card" style="max-width:560px">
      <form id="new-form">
        <div class="form-group"><label>Title</label><input name="title" required/></div>
        <div class="form-group"><label>Category</label><select name="category_slug" id="category_slug" required></select></div>
        <div class="form-group"><label>Product tag (optional, e.g. pharcare)</label><input name="product_tag"/></div>
        <div class="form-group"><label>Description</label><textarea name="description" rows="3"></textarea></div>
        <div class="form-group"><label><input type="checkbox" name="requires_lead" style="width:auto;display:inline-block"/> Require name/email before download</label></div>
        <button class="btn btn-primary" type="submit">Create draft</button>
        <p class="err" id="err" style="display:none;color:#c0392b;font-size:13px;margin-top:10px"></p>
      </form>
    </div>
    <script>
      fetch("/api/admin/categories").then(r=>r.json()).then(function(cats){
        var sel = document.getElementById("category_slug");
        cats.forEach(function(c){ var o=document.createElement("option"); o.value=c.slug; o.textContent=c.name; sel.appendChild(o); });
      });
      document.getElementById("new-form").addEventListener("submit", function(e){
        e.preventDefault();
        var f = new FormData(e.target);
        fetch("/api/admin/assets", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: f.get("title"), category_slug: f.get("category_slug"),
            product_tag: f.get("product_tag"), description: f.get("description"),
            requires_lead: f.get("requires_lead") === "on"
          })
        }).then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
          .then(function(data){ window.location.href = "/admin/downloads/"+data.id; })
          .catch(function(){ var el=document.getElementById("err"); el.textContent="Could not create asset."; el.style.display="block"; });
      });
    </script>`;
  res.send(adminLayout({ title: "Upload new asset", active: "downloads", body, session: req.session }));
});

router.get("/downloads/:id", requireAuthPage, (req, res) => {
  const id = req.params.id;
  const body = `
    <div class="admin-topbar"><h1 id="title">Asset</h1></div>
    <div class="admin-card">
      <form id="meta-form">
        <div class="form-group"><label>Title</label><input name="title" id="m-title"/></div>
        <div class="form-group"><label>Description</label><textarea name="description" id="m-description" rows="3"></textarea></div>
        <div class="form-group"><label>Category</label><select name="category_slug" id="m-category"></select></div>
        <div class="form-group"><label><input type="checkbox" name="requires_lead" id="m-lead" style="width:auto;display:inline-block"/> Require name/email before download</label></div>
        <button class="btn btn-primary" type="submit">Save changes</button>
        <button class="btn btn-ghost" type="button" id="publish-toggle" style="margin-left:10px"></button>
      </form>
    </div>
    <div class="admin-card">
      <h3>Upload a new version</h3>
      <form id="version-form">
        <div class="form-group"><label>Version label</label><input name="version_label" placeholder="v1.0" required/></div>
        <div class="form-group"><label>File</label><input type="file" name="file" required/></div>
        <button class="btn btn-primary" type="submit">Upload</button>
      </form>
    </div>
    <div class="admin-card">
      <h3>Version history</h3>
      <table class="admin-table" id="versions"><thead><tr><th>Version</th><th>File</th><th>Uploaded</th><th></th></tr></thead><tbody></tbody></table>
    </div>
    <div class="admin-card">
      <h3>Downloads</h3>
      <div class="stat-row" id="stats"></div>
    </div>
    <script>
      var assetId = ${JSON.stringify(id)};
      var currentAsset = null;
      function loadCategories(selected){
        fetch("/api/admin/categories").then(r=>r.json()).then(function(cats){
          var sel = document.getElementById("m-category");
          sel.innerHTML = cats.map(function(c){ return '<option value="'+c.slug+'"'+(c.slug===selected?' selected':'')+'>'+c.name+'</option>'; }).join("");
        });
      }
      function loadAsset(){
        fetch("/api/admin/assets/"+assetId).then(r=>r.json()).then(function(a){
          currentAsset = a;
          document.getElementById("title").textContent = a.title;
          document.getElementById("m-title").value = a.title;
          document.getElementById("m-description").value = a.description || "";
          document.getElementById("m-lead").checked = !!a.requires_lead;
          loadCategories(a.category_slug);
          var btn = document.getElementById("publish-toggle");
          if (a.status === "published") { btn.textContent = "Unpublish"; }
          else { btn.textContent = a.current_version_id ? "Publish" : "Publish (upload a file first)"; btn.disabled = !a.current_version_id; }
          document.getElementById("versions").querySelector("tbody") || (function(){})();
          var tbody = document.querySelector("#versions tbody");
          tbody.innerHTML = a.versions.map(function(v){
            return '<tr><td>'+v.version_label+'</td><td>'+v.file_name+'</td><td>'+v.uploaded_at+'</td>'+
              '<td class="admin-actions">'+(v.id===a.current_version_id ? '<em>current</em>' : '<button data-restore="'+v.id+'">Make current</button>')+'</td></tr>';
          }).join("") || '<tr><td colspan="4">No versions yet.</td></tr>';
          Array.prototype.slice.call(tbody.querySelectorAll("[data-restore]")).forEach(function(b){
            b.addEventListener("click", function(){
              fetch("/api/admin/assets/"+assetId+"/versions/"+b.getAttribute("data-restore")+"/restore", { method: "POST" }).then(loadAsset);
            });
          });
        });
        fetch("/api/admin/assets/"+assetId+"/stats").then(r=>r.json()).then(function(s){
          document.getElementById("stats").innerHTML = '<div class="stat-tile"><strong>'+s.total+'</strong><span>TOTAL DOWNLOADS</span></div>';
        });
      }
      document.getElementById("meta-form").addEventListener("submit", function(e){
        e.preventDefault();
        var f = new FormData(e.target);
        fetch("/api/admin/assets/"+assetId, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: f.get("title"), description: f.get("description"), category_slug: f.get("category_slug"), requires_lead: f.get("requires_lead") === "on" })
        }).then(loadAsset);
      });
      document.getElementById("publish-toggle").addEventListener("click", function(){
        var newStatus = currentAsset.status === "published" ? "draft" : "published";
        fetch("/api/admin/assets/"+assetId, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus })
        }).then(function(r){ if(!r.ok){ alert("Upload a file version before publishing."); } return loadAsset(); });
      });
      document.getElementById("version-form").addEventListener("submit", function(e){
        e.preventDefault();
        fetch("/api/admin/assets/"+assetId+"/versions", { method: "POST", body: new FormData(e.target) })
          .then(function(){ e.target.reset(); loadAsset(); });
      });
      loadAsset();
    </script>`;
  res.send(adminLayout({ title: "Edit asset", active: "downloads", body, session: req.session }));
});

router.get("/leads", requireAuthPage, (req, res) => {
  const body = `
    <div class="admin-topbar"><h1>Leads</h1><a class="btn btn-ghost" href="/api/admin/leads?format=csv">Export CSV</a></div>
    <div class="admin-card"><table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Asset</th><th>Date</th></tr></thead><tbody id="rows"><tr><td colspan="5">Loading…</td></tr></tbody></table></div>
    <script>
      fetch("/api/admin/leads").then(r=>r.json()).then(function(rows){
        var tbody = document.getElementById("rows");
        if (!rows.length) { tbody.innerHTML = '<tr><td colspan="5">No leads captured yet.</td></tr>'; return; }
        tbody.innerHTML = rows.map(function(l){
          return '<tr><td>'+l.name+'</td><td>'+l.email+'</td><td>'+(l.phone||'—')+'</td><td>'+l.asset_title+'</td><td>'+l.created_at+'</td></tr>';
        }).join("");
      });
    </script>`;
  res.send(adminLayout({ title: "Leads", active: "leads", body, session: req.session }));
});

router.get("/users", requireAuthPage, (req, res) => {
  if (req.session.role !== "admin") return res.status(403).send("Admin access required");
  const body = `
    <div class="admin-topbar"><h1>Users</h1></div>
    <div class="admin-card" style="max-width:480px">
      <form id="new-user-form">
        <div class="form-group"><label>Email</label><input name="email" type="email" required/></div>
        <div class="form-group"><label>Temporary password</label><input name="password" type="text" required/></div>
        <div class="form-group"><label>Role</label><select name="role"><option value="marketing">Marketing</option><option value="admin">Admin</option></select></div>
        <button class="btn btn-primary" type="submit">Add user</button>
      </form>
    </div>
    <div class="admin-card"><table class="admin-table"><thead><tr><th>Email</th><th>Role</th><th>Active</th><th></th></tr></thead><tbody id="rows"><tr><td colspan="4">Loading…</td></tr></tbody></table></div>
    <script>
      function load(){
        fetch("/api/admin/users").then(r=>r.json()).then(function(rows){
          document.getElementById("rows").innerHTML = rows.map(function(u){
            return '<tr><td>'+u.email+'</td><td>'+u.role+'</td><td>'+(u.active?'Yes':'No')+'</td>'+
              '<td class="admin-actions"><button data-id="'+u.id+'" data-active="'+(u.active?0:1)+'">'+(u.active?'Deactivate':'Activate')+'</button></td></tr>';
          }).join("");
          Array.prototype.slice.call(document.querySelectorAll("[data-id]")).forEach(function(b){
            b.addEventListener("click", function(){
              fetch("/api/admin/users/"+b.getAttribute("data-id"), {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: b.getAttribute("data-active") === "1" })
              }).then(load);
            });
          });
        });
      }
      document.getElementById("new-user-form").addEventListener("submit", function(e){
        e.preventDefault();
        var f = new FormData(e.target);
        fetch("/api/admin/users", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: f.get("email"), password: f.get("password"), role: f.get("role") })
        }).then(function(){ e.target.reset(); load(); });
      });
      load();
    </script>`;
  res.send(adminLayout({ title: "Users", active: "users", body, session: req.session }));
});

module.exports = router;
