# Daily pharCare blog automation

One pharCare article publishes automatically every morning, the sitemap and RSS feed update
themselves, and the new URL is pushed to search engines. Nothing needs a human unless the post
bank runs low.

This document is the runbook: how it works, how to add articles, and what to do when it breaks.

## How it works

```
content/blog/posts/NNN-slug.md      the article bank, published in filename order
content/blog/state.json             which posts are live, and on what date
        ↓  scripts/publish-daily-post.js  (GitHub Actions, 01:30 UTC = 07:00 IST)
resources/blog/<slug>/index.html    the article page
resources/blog/index.html           the listing, regenerated every run
feed.xml                            RSS, regenerated every run
sitemap.xml                         blog URLs rewritten between marker comments
        ↓  scripts/build.js         BreadcrumbList + FAQPage JSON-LD from the visible markup
        ↓  git commit + push
        ↓  scripts/ping-indexers.js Google Indexing API + IndexNow
```

Two design points worth knowing:

**Every live post is regenerated on every run**, not just the new one. That keeps the "related
reading" module and the listing correct without tracking which pages a new post invalidates.

**Nav and footer are lifted from `products/pharcare/index.html` at render time** rather than
copied into the generator. A future nav change propagates to every post on the next run.

**`scripts/build.js` owns BreadcrumbList and FAQPage JSON-LD** across the whole site, generating
them from the visible breadcrumb and the visible accordion. The blog generator deliberately emits
only `Organization` + `BlogPosting` and lets `build.js` add the other two, so the schema and the
page can never disagree.

## Runway

The bank ships with **30 articles**. At one a day that is 30 days from first publish.
`scripts/check-blog.js` warns when fewer than 7 remain, and the workflow raises a GitHub warning
annotation when the bank is empty. **Top it up monthly.**

## Adding an article

Create `content/blog/posts/NNN-slug.md`. The number is the queue position; the slug after the
number becomes the URL (`/resources/blog/<slug>/`).

```markdown
---json
{
  "title": "Title as shown on the page and in search results",
  "description": "Meta description, 70-175 characters.",
  "category": "Compliance",
  "keywords": ["primary keyword", "secondary keyword"],
  "faq": [
    { "q": "A question a searcher would type?", "a": "A direct answer." }
  ]
}
---
The opening paragraph is the direct answer — the part lifted into AI Overviews and featured
snippets. Answer the query in the first two or three sentences.

## A heading

Body text. Supports **bold**, *italic*, `code`, [links](/products/pharcare/), bullet and
numbered lists, > callouts, | tables |, and --- rules.
```

Then:

```bash
npm run blog:check     # validate the bank
npm run blog:next      # see what publishes next
```

### House rules

- **Only link backwards in the queue.** A post at position 020 may link to 007 but not to 025 —
  the target would 404 for days. `check-blog.js` fails the build on a forward link.
- **Every post gets an FAQ block.** It is what produces the FAQPage schema.
- **Every post links to `/products/pharcare/`** contextually in the body, not only in the CTA.
- Title ≤ 66 characters, description 70–175. The checker enforces both.
- pharCare content only — this cluster exists to build topical authority for the flagship.

## Commands

| Command | Does |
|---|---|
| `npm run blog:check` | Validate the bank: parsing, slugs, links, metadata, runway |
| `npm run blog:next` | Dry run — what would publish today |
| `npm run blog:publish` | Publish today's post locally |
| `npm run blog:regen` | Rebuild all live pages without publishing anything new |
| `npm run blog:ping` | Re-submit the last published URLs to search engines |
| `npm run check` | Full site check, including the blog |

`blog:regen` is the one to reach for after editing an already-published article, or after
changing `assets/blog.css` or the site nav.

Backfill or correct a date with `node scripts/publish-daily-post.js --date=2026-09-05`.

## Exit codes

`publish-daily-post.js` returns `0` published, `3` bank empty, `4` already published today,
`1` error. The workflow treats 3 and 4 as "nothing to do" and surfaces them as annotations
rather than failing the run.

## Search engine setup

### Sitemap (the channel that matters)

`sitemap.xml` is rewritten on every publish, between the `<!-- blog:start -->` and
`<!-- blog:end -->` markers. Everything outside those markers is left untouched, so hand edits
elsewhere in the file survive. The `/resources/blog/` entry's `lastmod` is also refreshed.

Submit `https://www.liveuo.com/sitemap.xml` **once** in Search Console. Google re-reads it on its
own schedule from then on; there is no need to resubmit per post, and Google retired the sitemap
ping endpoint in 2023.

### Google Indexing API — optional, and read this caveat

Google documents the Indexing API as supporting **JobPosting and BroadcastEvent only**. It
commonly accepts other URLs and can speed up discovery, but it is not a supported or guaranteed
path for ordinary articles. Treat it as a bonus on top of the sitemap, never as the mechanism.

To enable it:

1. Google Cloud Console → create a project → enable **Indexing API**
2. Create a **service account**, create a JSON key, download it
3. Search Console → the `liveuo.com` property → Settings → Users and permissions →
   add the service account's `client_email` as an **Owner** (Owner, not Full — the API rejects
   anything less)
4. GitHub → repo → Settings → Secrets and variables → Actions → new secret
   `GOOGLE_INDEXING_CREDENTIALS`, pasting the entire JSON file contents

Without the secret the step logs `skipped` and the run still succeeds.

### IndexNow — Bing, Yandex, Naver, Seznam

Fully supported for ordinary pages, and worth having.

The key file `d51eff5b36bf5765fa4817da90e68498.txt` is already in the repo root and must stay
there — IndexNow fetches it to verify ownership. Add the same value as the GitHub secret
`INDEXNOW_KEY`.

### RSS

`/feed.xml` regenerates on every publish and is linked from every blog page via
`<link rel="alternate">`.

## The GitHub Actions workflow

`.github/workflows/daily-blog.yml`

- **Schedule:** `30 1 * * *` UTC = 07:00 IST. GitHub's scheduler can be late by several minutes
  under load; the job is idempotent so a late or duplicated run is harmless.
- **Manual run:** Actions → *Daily pharCare blog post* → *Run workflow*. Optional `dry_run`
  and `date` inputs.
- **On pull requests** touching `content/blog/**`, `scripts/**` or `assets/blog.css`, only the
  `validate` job runs — a broken post fails the PR rather than the 07:00 job.
- **No `npm install`.** The blog scripts use only the Node standard library, so a dependency
  change cannot break the daily run.
- **Permissions:** `contents: write`, to commit the generated pages back to `main`.

### Deployment

The workflow commits to `main`. **It does not deploy.** Whatever pulls `main` onto the IIS host
must run after it — if deployment is manual, the post is written but not live until you deploy.
Confirm this before relying on the schedule.

## Troubleshooting

**Nothing published this morning.** Check the Actions run. Exit 4 means a post already carried
today's date — normal after a manual run. Exit 3 means the bank is empty.

**Workflow fails at "Commit and push".** Usually a branch protection rule on `main` blocking the
bot. Either allow the `github-actions` actor to push, or switch the workflow to open a PR.

**A published article needs correcting.** Edit the `.md` file, then `npm run blog:regen`, commit.
The URL and publish date are preserved; `dateModified` in the schema updates.

**`npm run check` fails on structured data.** Run `node scripts/build.js` and commit the result —
the JSON-LD is generated, not hand-written.

**Google Indexing API returns 403.** The service account is not an **Owner** of the Search Console
property, or the Indexing API is not enabled on the project.

**A post 404s after publishing.** Deployment has not run. See *Deployment* above.

## Related

- [04-seo-content-clusters.md](04-seo-content-clusters.md) — the cluster strategy this implements
- [02-home-and-pharcare.md](02-home-and-pharcare.md) — the pillar page these articles support
