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

Everything on the page is edited from the admin panel at `/admin`, from a phone:
your photo, the background image, the announcement, WhatsApp number, treatments
(each one opens WhatsApp with a ready message), brand partnerships, affiliate
products (paste the link and the product image is fetched automatically), and
extra links. The public catalog lives at `/catalogo`.

Data is stored in Redis under one key; first run seeds placeholder content from
`lib/seed.ts`.

### Environment

The admin panel and image uploads need:

```
KV_REST_API_URL=
KV_REST_API_TOKEN=
BLOB_READ_WRITE_TOKEN=
ADMIN_USER=
ADMIN_PASS=
JWT_SECRET=
```

## Deploy

Works as-is on Vercel. Push the repo, set the environment variables above, done.

## License

MIT. See [LICENSE](LICENSE).

Based on the original [InstaLink](https://github.com/luizmellodev/instalink) by
Luiz Eduardo, which in turn was built on an idea and codebase by
[giovannamoeller](https://github.com/giovannamoeller).
