/*  Industry directory on /services/digital-marketing/: text search plus a
 *  sector-group filter. The directory is plain <details> elements, so it is
 *  fully readable and expandable with this script blocked or failed - this
 *  only adds filtering on top.
 */
(function () {
  "use strict";

  var dir = document.getElementById("dm-dir");
  var input = document.getElementById("dm-search");
  var count = document.getElementById("dm-count");
  var empty = document.getElementById("dm-empty");
  if (!dir || !input) return;

  var items = Array.prototype.slice.call(dir.querySelectorAll(".dm-ind"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".dm-chip"));
  var group = "all";

  function apply() {
    var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var shown = 0;

    items.forEach(function (el) {
      var hay = el.getAttribute("data-search") || "";
      var inGroup = group === "all" || el.getAttribute("data-group") === group;
      var matches = terms.every(function (t) {
        return hay.indexOf(t) !== -1;
      });
      var visible = inGroup && matches;
      el.hidden = !visible;
      if (visible) shown++;
    });

    if (empty) empty.hidden = shown !== 0;
    if (count) {
      count.textContent =
        shown === items.length
          ? "Showing all " + items.length + " industries"
          : "Showing " + shown + " of " + items.length + " industries";
    }
  }

  input.addEventListener("input", apply);

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      group = chip.getAttribute("data-group");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      apply();
    });
  });

  /* A link straight to one industry (#industry-healthcare) opens it. */
  function openFromHash() {
    var id = window.location.hash.slice(1);
    if (id.indexOf("industry-") !== 0) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  window.addEventListener("hashchange", openFromHash);
  openFromHash();
})();
