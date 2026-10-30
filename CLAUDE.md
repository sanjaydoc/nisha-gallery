# CLAUDE.md — Nisha Gallery (project memory)

Art gallery site for the founder (Dr. Sanjay Anbu). Approved 2026-10-30: admin layout **A** (mock https://claude.ai/artifact/GvecRrqdNL6PNRkEij3V9k),
visitor site (mock https://claude.ai/artifact/KKxkhSFt7UVDQ7oZUo9NXx), NFT network **Polygon**, payments through the **same Razorpay as MedDroid**,
crypto as second options: **Polygon (main), Ethereum, BNB Smart Chain, Bitcoin, Solana**.

## What it does
- Only the admin uploads. Each upload = an artwork with a **normal copy** (signed print + high-res download, many sales) and a
  **1-of-1 NFT copy** (token number = `nft_token`, metadata at `<worker>/gallery/nft/<token>.json`, ERC-721 style).
- Home page: hero slider of `on_home` works + grid. Artwork page (`#/art/<slug>`): both editions + checkout.
- Checkout: Razorpay (UPI/card/netbanking), or crypto paid **straight to the gallery's wallets**; the Worker checks every crypto
  payment on-chain (EVM JSON-RPC, blockstream.info, Solana RPC; Solana Pay reference so no hash to paste). A quote/NFT hold lasts 30 min.
- Admin (`#/admin`, Google sign-in via MedDroid's Supabase; allowed emails = `GALLERY_ADMINS` in medicalandroid `chat-worker/wrangler.toml`):
  Home page (upload, reorder, take off), Artworks (title, artist, medium, about, both prices, hide/delete), Orders (to send, mark shipped /
  NFT minted + mint tx), Payouts (one 0x wallet for Polygon/ETH/BNB, BTC address, SOL address, royalty %, NFT contract).

## Where things live
- **This repo:** React 18 + TS + Vite, hash routes, built to `docs/` (GitHub Pages: main /docs → https://sanjaydoc.github.io/nisha-gallery/).
  `src/api.ts` (Worker calls, types, CHAINS), `src/pay.ts` (Razorpay Checkout, MetaMask/EIP-681, BIP21, Solana Pay, QR), `src/Site.tsx`,
  `src/Admin.tsx`, `src/styles.css` (`ng-*` site, `.ad` admin = MedDroid admin look).
- **Backend:** medicalandroid repo → `chat-worker/worker.js` section "Nisha Gallery (/gallery/*)" (auto-deploys via Workers Builds).
  Tables/buckets: medicalandroid `supabase/gallery.sql` (gallery_artworks, gallery_orders, gallery_settings; buckets `gallery` public,
  `gallery-originals` private → buyers get 7-day signed links).
- Deploy: **right now GitHub Pages serves the preview build** (`npm run build:preview` = demo data, simulated payments; founder
  2026-10-30: "light theme + live on GitHub Pages"). Once Nisha's Supabase is connected: `npm run build` (live), commit `docs/`, push main.
- Theme: visitor site is LIGHT (warm paper #faf8f4, founder 2026-10-30); admin keeps the MedDroid admin look.

## Demo
`VITE_DEMO=1 npx vite build --outDir <tmp>` → `src/demo.ts` fakes the API in the browser (6 sample works, simulated Razorpay and
crypto, admin open without sign-in). Published as https://claude.ai/artifact/SphkBWyL1gvFLxxMf4RzCb (inlined single HTML).

## Nisha's own Supabase (founder plan 2026-10-30)
Nisha creates the Supabase project and runs medicalandroid `supabase/gallery.sql`. Then: her project URL + publishable key go into
`src/api.ts` (createClient), URL into `GALLERY_SUPABASE_URL` in medicalandroid `chat-worker/wrangler.toml`, and her **service_role key**
as Worker secret `GALLERY_SUPABASE_SERVICE_KEY` (Cloudflare dashboard; never in chat or git). Add the site URL to her Supabase Auth
redirect URLs and enable Google sign-in there.

## Not done yet / honest notes
- **On-chain minting is manual:** after an NFT sale the admin mints token #N to the buyer's wallet (needs an ERC-721 contract on Polygon,
  not deployed yet) and marks the order "NFT minted" with the tx. Next step: deploy the contract and automate minting.
- Razorpay: MedDroid's merchant account is for health software. Razorpay restricts crypto/NFT-related payments; check with Razorpay
  before taking NFT payments through it (normal copies are lower risk). A separate gallery account may be needed.
- Tests: worker 45/45 (scratchpad `galw/test.mjs`), browser e2e 21/21 (`galw/e2e.mjs`: real worker code + fake Supabase/Razorpay/chains).
