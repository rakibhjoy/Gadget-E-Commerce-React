# Joy Mart

Joy Mart is a responsive gadget storefront for Bangladesh. It uses the existing React 18, Vite 4, React Router 6, and Lucide setup. Product IDs, original catalog photography, the JM mark, and Bangladeshi taka pricing are retained.

## Run locally

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

This project has no existing npm test script. For local account creation and demo checkout, use localhost or HTTPS with browser storage enabled. A production static host needs an SPA fallback to `index.html` for direct and refreshed routes.

## GitHub Pages

[Open the Joy Mart storefront](https://rakibhjoy.github.io/Gadget-E-Commerce-React/)

The [GitHub Pages workflow](.github/workflows/pages.yml) runs linting and a production build on pushes to `main`. It can also be run from the repository's **Actions** tab. In **Settings → Pages**, set the publishing source to **GitHub Actions**.

The workflow reads the Pages base path and builds the router, scripts, styles, and local images under that path. It also publishes the application shell as `404.html`. Direct links to React routes can receive GitHub Pages' HTTP 404 status while the storefront renders the correct page in the browser.

To preview a project-path build locally, run:

```sh
npm run build -- --base /Gadget-E-Commerce-React/
npm run preview -- --base /Gadget-E-Commerce-React/
```

## Storefront routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial audio banner, category shortcuts, switchable collections, shopping guides and recently viewed products |
| `/products` | Catalog with shareable search, category, filters and sort order |
| `/products/:id` | Product gallery, variants, availability, specifications and demo reviews |
| `/wishlist`, `/compare` | Saved products and comparison for up to four items |
| `/cart`, `/checkout` | Cart, coupon, delivery options and final review |
| `/login`, `/register`, `/forgot-password` | Local demo account access and password reset availability |
| `/profile?tab=profile`, `?tab=addresses`, `?tab=orders` | Local account, addresses and order history |
| `/orders/:orderId`, `/orders/:orderId/confirmation` | Local demo order detail and confirmation |
| `/track`, `/track-order` | Local lookup by order reference or Bangladesh mobile number |
| `/support/:section` | Contact, FAQ, Shipping & Returns, Warranty, Privacy and Terms |

## Try the demo

- Search for **Aura ANC** or open **Audio & Sound** and filter by **Noise cancellation**.
- Add a product to the cart and try coupon **JOY10**. Saved cart items, the coupon, wishlist and comparison persist on this browser. Product visits appear in the homepage’s Recently viewed section, where you can clear the history.
- Complete checkout as a guest or use **Use demo credentials** on the sign-in page. The built-in demo account is `demo@joymart.com` and its password is `password123`. Use sample personal details in any forms.
- A demo Cash on Delivery order produces a local order reference. The confirmation and tracking screens reflect the local record. There are no charges, live payment authorizations, dispatches, or courier statuses.

## Homepage assets

The full-width homepage banner uses `public/joy-mart-listening.jpg` and `public/joy-mart-listening-mobile.jpg`. The built-in ImageGen tool created the photograph, and the mobile version uses a tighter crop.

> Wide cinematic editorial photograph for the full-width homepage of a minimal consumer gadgets store. 3:2 horizontal composition designed to crop to a 2:1 banner. In a dark midnight-blue studio, one unbranded premium pair of graphite over-ear headphones sits on an angular dark stone plinth, large on the RIGHT half of frame. Put the headphones around 74% across the frame, fully visible with generous clear margin above and below. The LEFT 45 percent is clean uninterrupted dark navy negative space for white HTML headline text. A single atmospheric cobalt-blue light from behind on the right creates a soft horizon glow and a clean edge around the product. Precise mesh and soft leather texture and elegant industrial design. Real studio photograph with subtle depth and clean shadows, no text, no logos, no watermark, no people. Muted ink navy and slate palette with a restrained electric-blue highlight.

The homepage uses a Helvetica Neue, Helvetica and Arial system font stack. The built-in ImageGen tool created the editorial audio banner. Its optimized sizes are stored as `public/joy-mart-audio-hero.jpg` and `public/joy-mart-audio-hero-small.jpg`.

> Create a photorealistic editorial product photograph for the right-hand picture panel of a minimalist Bangladesh gadget shop homepage. Landscape aspect ratio around 3:2. A single unbranded pair of midnight navy wireless over-ear headphones, modern understated industrial design with oval cushioned earcups, placed at a sculptural 3/4 angle on a simple low matte cobalt-blue cylindrical plinth. Beside it, low in frame and partly behind the plinth, a small matching dark navy wireless charging case with clean rounded edges. Entire scene in a cool airy light blue studio with a soft luminous icy-blue backdrop (#dbeaff to #eff6ff) and broad soft daylight from upper left. Precise surface detail and subtle reflected light, believable materials, soft architectural shadows. Large centered product framing with all objects fully inside frame and generous margins, so the image crops well to a wide desktop tile and a mobile tile. High-end technology magazine campaign, restrained, bright, crisp, image only. No typography, logo, person, text, watermarks, graphics, fake UI, dramatic gradients, curtains, or other props.

## Integration points

| Area | Current behavior | Live store integration |
| --- | --- | --- |
| Catalog | `src/data/products.js` contains the original seeded catalog. `src/data/catalog.js` adds demo brand and specification facets, variant IDs and stock counts. Existing ratings are catalog demo data. Additional gallery views use detail crops when only one photo is available. | Load product and variant data, verifiable ratings, image URLs, inventory, collection membership and warranty terms from a catalog API. Supply variant-specific photography and actual stock. |
| Cart and checkout | `CartContext.jsx` preserves the existing `aether_cart` key and upgrades legacy lines. `utils/commerce.js` contains demo stock checks, JOY10 and delivery estimates. Checkout validates address fields and Bangladesh mobile format locally. | Validate prices, coupons, delivery zones and stock server-side. Use an idempotent order endpoint, authoritative address validation, current fulfillment quotes and an inventory reservation. |
| Payments | Cash on Delivery is selectable for demo checkout. bKash, Nagad and card payments are visibly unavailable. | Configure the store's providers and eligible Cash on Delivery zones. Use gateway-hosted payment entry and verified callbacks before showing payment status. |
| Accounts | `AuthContext.jsx` retains local records and upgrades older demo passwords to salted hashes at sign-in where Web Crypto is available. Demo registration, profile editing, avatar and addresses use browser storage. | Replace browser-local accounts with server-managed sessions, access controls, email verification and password reset. |
| Orders and shipping | `OrderContext.jsx` stores demo orders locally. Legacy simulated shipment fields are omitted from the UI. | Fetch authorized orders and shipment events from the commerce and courier APIs. |
| Policies and support | Existing delivery, warranty, defective-item replacement and contact copy informed the support pages. Draft terms are labeled. | Verify support email, location, delivery fees, return eligibility and warranty coverage. Approve privacy and terms before launching. |
