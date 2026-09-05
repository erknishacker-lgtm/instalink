# InstaLink

A self-hosted link-in-bio page. One place to point your Instagram, TikTok or X
bio at, with your social profiles and whatever links you want to highlight.

Built with Next.js, Tailwind CSS and TypeScript. Ships with an admin panel
backed by Redis and image uploads through Vercel Blob.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Configuration

Edit `app/data.js` to set your name, avatar, social profiles and links. Three
exports drive the page:

- `announcementData` — the banner at the top
- `headerData` — avatar, display name, handle
- `socialMediaData` — social profile cards
- `usefulLinksData` — the list of highlighted links

Styling is plain Tailwind utility classes inside the components, so you can
restyle anything without touching a config file.

### Environment

The admin panel and image uploads need:

```
KV_REST_API_URL=
KV_REST_API_TOKEN=
BLOB_READ_WRITE_TOKEN=
```

## Deploy

Works as-is on Vercel. Push the repo, set the environment variables above, done.

## License

MIT. See [LICENSE](LICENSE).

Based on the original [InstaLink](https://github.com/luizmellodev/instalink) by
Luiz Eduardo, which in turn was built on an idea and codebase by
[giovannamoeller](https://github.com/giovannamoeller).
