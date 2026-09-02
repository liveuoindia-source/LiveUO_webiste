/*  Minimal Markdown -> HTML for blog post bodies.
 *
 *  Deliberately small: the post bank is written in-house, so this only needs
 *  to cover the constructs those posts actually use. Anything it does not
 *  recognise is emitted as an escaped paragraph rather than passed through,
 *  so a typo in a post can never inject raw markup into the page.
 *
 *  Supported: ## / ### headings, - and 1. lists, > callouts, | tables |,
 *  --- rules, and inline **bold**, *italic*, `code`, [links](url).
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Inline formatting. Escaping happens first, so by the time the emphasis and
 * link patterns run there is no user-supplied markup left to smuggle through. */
function inline(text) {
  let out = escapeHtml(text);

  out = out.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    // Only same-site and plain http(s) targets - no javascript: or data: URLs.
    if (!/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href)) return label;
    const external = /^https?:\/\//i.test(href) && !href.includes("liveuo.com");
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}"${attrs}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");

  return out;
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* Returns { html, headings } - headings feed the on-page table of contents. */
function render(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const headings = [];
  let i = 0;

  const flushList = (ordered, items) => {
    const tag = ordered ? "ol" : "ul";
    html.push(`<${tag}>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</${tag}>`);
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    // Headings
    const h = trimmed.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      const id = slugifyHeading(text);
      if (level === 2) headings.push({ id, text });
      html.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) { html.push("<hr />"); i++; continue; }

    // Blockquote / callout - consecutive "> " lines become one aside
    if (trimmed.startsWith(">")) {
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<aside class="post-callout"><p>${inline(buf.join(" "))}</p></aside>`);
      continue;
    }

    // Table - header row, separator row, then body rows
    if (trimmed.startsWith("|") && (lines[i + 1] || "").trim().startsWith("|-")) {
      const cells = (row) =>
        row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const head = cells(lines[i]);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        body.push(cells(lines[i]));
        i++;
      }
      html.push(
        '<div class="table-scroll"><table class="post-table"><thead><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join("") +
          "</tr></thead><tbody>" +
          body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
          "</tbody></table></div>"
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      flushList(true, items);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      flushList(false, items);
      continue;
    }

    // Paragraph - runs until a blank line
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|[-*]\s|\d+\.\s|>|\||---+$)/.test(lines[i].trim())) {
      buf.push(lines[i].trim());
      i++;
    }
    if (buf.length) html.push(`<p>${inline(buf.join(" "))}</p>`);
  }

  return { html: html.join(""), headings };
}

/* Plain reader-visible text, used for word counts and meta fallbacks. */
function toPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^[#>\-*|]+\s*/gm, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { render, inline, escapeHtml, toPlainText, slugifyHeading };
