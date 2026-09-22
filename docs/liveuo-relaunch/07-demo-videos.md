# pharCare demo videos

Public page at `/products/pharcare/demo/`: a player with a playlist beside it,
autoplay-next, resume, topic filters and search. Built from
`content/demos/videos.json` by `scripts/build-demos.js`.

## Who can watch: email + one-time code

The videos are **not public**. Only email addresses on the `pharcare-demo`
allow-list in `server/private/viewers.json` can watch:

```json
"pharcare-demo": {
  "title": "pharCare demo videos",
  "library": "demos/media",
  "allow": ["client@company.com"],
  "expires": "2027-12-31"
}
```

The page shows the titles, descriptions and posters to everyone, with an
email form over the player. An approved address gets a 6-digit code (valid
10 minutes, 5 tries); after entering it the browser can watch for 4 hours.
An address that is not on the list sees the same "check your inbox" screen
but no email is sent - so nobody can find out who is on the list. Edits to
the list apply immediately. Every code request and playback is recorded in
`server/private/access.log`.

How it holds: the playlists and segments are served only by the Node app at
`/server.js/api/viewer/media/pharcare-demo/<slug>/...`, and only to a
verified session. Posters are the one public file. For this to mean anything
IIS must **not** serve `demos/media/` itself - `demos` is a hidden segment in
the server's web.config (see `web.config.iisnode`). Check from anywhere:

```bash
curl -sI https://liveuo.com/demos/media/dashboard/index.m3u8 | head -1          # 404
curl -sI https://liveuo.com/server.js/api/viewer/media/pharcare-demo/dashboard/index.m3u8 | head -1   # 401
```

Removing the `pharcare-demo` entry locks the page for everyone.

## What "not downloadable" means here

Nothing a browser can play can be made impossible to copy — a screen recording
always works. What this setup does:

- Videos are served as **HLS**: hundreds of short segments listed by a
  playlist, not one `.mp4`. There is no single file to right-click and save;
  taking a copy needs a dedicated tool.
- The player has **no download control**, no right-click menu on the video,
  and no picture-in-picture.

That stops casual saving. Don't promise more than that.

## Adding or updating videos

1. Put recordings in `demos-src/` (gitignored), either as loose files or one
   folder per module, named with a leading number for order:
   `demos-src/07_Purchase/07_Purchase_Entry.mp4`. Folders starting with `_`
   (tooling) are skipped. A `script.md` beside a video supplies the title
   (its `# … — Recording Script` heading) and the description (its
   `**Purpose:**` line) for new entries.
2. `npm run demos:encode` — writes HLS plus a poster frame to
   `demos/media/<slug>/` and adds new entries to `content/demos/videos.json`.
   H.264 yuv420p sources up to 1080p are **copied** into the segments without
   re-encoding (no quality loss — this matters for the app's small UI text);
   anything else is re-encoded to 1080p H.264. Already-done videos are
   skipped; `--force` redoes them, `--reencode` forces a re-encode.
3. Edit `content/demos/videos.json`: give each video a real `description` and
   the right `section`. Order within a section follows the file order.
4. `npm run build` — regenerates the page and its sitemap entry.
5. **Upload `demos/media/<slug>/` to the server** at
   `D:\InetPub\vhosts\adsmount.com\liveuo.com\demos\media\<slug>\`.
   Media never goes through git: `demos/media/` is gitignored.
6. Commit and push `content/demos/videos.json` and
   `products/pharcare/demo/index.html`. Plesk deploys them.

Upload the media **before** pushing the page, or visitors briefly see tiles
whose videos 404.

## One-time server setup: MIME types

Only needed while IIS served the media directly. The videos now go through
Node, which sets the types itself; the block is harmless to leave in.


IIS refuses to serve file types it doesn't know. `.m3u8` and `.m4s` aren't in
its defaults, so without this every video fails with a 404.3.

Add inside `<system.webServer>` in the server's `web.config`, next to the
existing `<httpErrors>` line:

```xml
<staticContent>
  <remove fileExtension=".m3u8" />
  <mimeMap fileExtension=".m3u8" mimeType="application/vnd.apple.mpegurl" />
  <remove fileExtension=".m4s" />
  <mimeMap fileExtension=".m4s" mimeType="video/mp4" />
</staticContent>
```

Each `<remove>` comes before its `<add>` on purpose: if the server already maps
the extension, a duplicate entry makes IIS reject the entire file with a
site-wide 500. `<remove>` on an absent mapping is harmless.

`staticContent` is core IIS, not an add-on module — unlike `<rewrite>`, which
this host can't load. If adding it still produces a 500, delete the block and
the site recovers immediately.


## Hosting caveats

- **Bandwidth and storage** land on the Plesk host. 720p runs roughly
  3–6 MB per minute of video.
- **Cloudflare's CDN terms restrict serving video** through the standard CDN
  on its non-media plans. Review them, or add a Cache Rule that bypasses cache
  for `/server.js/api/viewer/media/*` (the gated files are already sent
  `private`, so Cloudflare should not cache them). Cloudflare Stream is the supported route if traffic
  grows.
