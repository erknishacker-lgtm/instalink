# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Visitor (primary):** a Brazilian woman who tapped the link in the owner's Instagram/TikTok bio, on her phone, in the middle of scrolling. She came because she follows the owner as an esthetician and beauty influencer. Her jobs, in the owner's stated priority: see the owner's brand partnerships, book a treatment on WhatsApp, and reach the owner's affiliate product catalog.
- **Owner (admin):** the esthetician/influencer herself, managing the page from her phone. She is a brand ambassador for the Korean-beauty store Kyeomi (kyeomi.com.br). She changes her photo, announcements, links, services, and affiliate products herself, whenever she wants. Not technical.
- **Developer:** Emiliano, who sets up hosting and env; rarely uses the admin.

## Product Purpose

A self-hosted link-in-bio page for one esthetician who is also a beauty influencer, plus the phone-first admin panel she runs it from. Success is: visitors book treatments via WhatsApp, reach her partner brands and affiliate catalog, and the owner keeps the page current without help.

## Positioning

Unlike a generic Linktree, this page is built around one person's real business: a scheduling button that opens WhatsApp with the chosen service pre-written, a partner/ambassador showcase (Kyeomi), and an affiliate product catalog whose entries pull their own product image from the affiliate link.

## Operating Context

- Traffic arrives almost entirely from Instagram/TikTok bio taps on mobile.
- Booking is manual over WhatsApp: the page opens `wa.me/<phone>?text=<service template>`; there is no calendar integration.
- Affiliate products link out to external stores; the catalog exists to make those links look like a curated shop.
- Content is edited in the admin on a phone; images are uploaded through the admin (Vercel Blob) and stored as URLs; data lives in Upstash Redis (`site:data`).

## Capabilities and Constraints

- Existing data model (`lib/types.ts`): SiteConfig (name, username, profilePictureUrl, announcementBadge, announcementText, whatsappPhone), SocialLink, UsefulLink, Service (with WhatsApp template), AffiliateProduct (name, imageUrl, affiliateLink, description, isActive, order).
- Existing routes: `/` (public page), `/admin-login`, `/admin` (dashboard, links, services, products, settings), JSON APIs under `/api/*`, `/api/upload` (auth'd, 4 MB, jpg/png/webp/gif).
- Stack: Next.js 14 App Router, Tailwind, framer-motion, lucide-react + react-icons, react-hot-toast. No `public/` directory exists yet.
- Owner-stated additions for this round: a **partnerships** showcase on the home (Kyeomi ambassador), the **scheduling button near the top**, a **button to a dedicated affiliate catalog page**, and **auto-fetching the product image from the affiliate link** when she adds a product. These are new product facts, not visual polish.
- Undecided: whether "partnerships" is a new data type or reuses UsefulLink; final section order beyond "scheduling near the top". The owner said she does not know what must stay untouched; treat the WhatsApp booking mechanic and all existing content types as preserved.

## Brand Commitments

- Palette must read as delicate, pink, and distinctly feminine ("paleta delicada com rosa, bem feminina"). This is binding; the exact hues are open.
- The owner is a Kyeomi ambassador; the home should show that partnership. Kyeomi's own positioning: curated Korean skincare and beauty devices, "beleza que transforma a sua rotina", premium-but-accessible.
- The owner's photo must be replaceable by her from the admin (already supported via settings → Foto de Perfil).

## Evidence on Hand

- Real content: none yet beyond seed placeholders (`lib/seed.ts`: "Seu Nome", example services "Massagem Relaxante", "Limpeza de Pele", "Manicure e Pedicure", example products). The developer will supply the owner's photos and studio images later; leave clearly labeled slots.
- No testimonials, prices, or client numbers exist; do not invent any.
- `github_assets/screenmobile*.png` are screenshots of the upstream project, not of this owner.

## Product Principles

1. Book first: the path from landing to a pre-written WhatsApp message is never more than two taps.
2. Everything the visitor sees, the owner can change from her phone; no design element may depend on a developer to update.
3. Partnerships and affiliate products are shown as a curated edit, not a dump of links.
4. Feminine and delicate is the register, but never at the expense of tap targets, contrast, or load time on a mid-range phone.
5. Nothing fabricated: placeholders are labeled as placeholders until real material arrives.

## Accessibility & Inclusion

Mobile-first, one-hand use. Tap targets ≥ 44 px on the public page and in the admin. Reduced-motion must be respected because the owner asked for a lot of motion.
