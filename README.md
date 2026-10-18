# 🛒 Joy Mart — Premium Gadget E-Commerce

> A clean, modern, and minimal gadget e-commerce website built with React + Vite and Tailwind CSS. Browse the latest smartphones, laptops, audio gear, smartwatches, gaming accessories, and more — all in a premium off-white aesthetic designed for Bangladesh.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-Educational-green?style=for-the-badge)

---

## ✨ Features

- 🏠 **Home Page** — Hero banner slider, flash deals, category grid, featured products & promo cards
- 🛍️ **Products Page** — Full catalog with search, category filter, and sort options
- 📦 **Product Details** — Image gallery, specs, ratings, add to cart & related products
- 🛒 **Shopping Cart** — Add/remove items, quantity controls, coupon codes & checkout
- 👤 **Authentication** — Register & login with LocalStorage persistence
- 🙍 **Profile Page** — Edit profile, upload avatar, manage delivery addresses & order history
- 📍 **Address Management** — Add, edit & set default delivery address
- 📱 **Guest Checkout** — Mobile-number-only guest checkout flow
- 🔍 **Search** — Navbar search dropdown with trending tag shortcuts
- 📦 **Order Tracking** — Track order status with timeline view
- 📱 **Fully Responsive** — Mobile-first design across all screen sizes

---

## 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite 4](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Icon library |
| LocalStorage | Cart, auth & order persistence |

---

## 📁 Project Structure

```
e-com-react/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Sticky navbar with search, cart & user dropdown
│   │   ├── Footer.jsx         # Site footer with links and info
│   │   └── ProductCard.jsx    # Reusable product card component
│   ├── context/
│   │   ├── AuthContext.jsx    # User authentication state
│   │   ├── CartContext.jsx    # Shopping cart state & actions
│   │   └── OrderContext.jsx   # Order history state
│   ├── data/
│   │   └── products.js        # Product catalog, categories & hero banners
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Products.jsx       # Product listing with filters
│   │   ├── ProductDetails.jsx # Single product view
│   │   ├── Cart.jsx           # Cart & checkout
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Profile.jsx        # User profile & addresses
│   │   └── OrderTrack.jsx     # Order tracking page
│   ├── utils/
│   │   └── format.js          # BDT currency formatter
│   ├── App.jsx                # Root component & route definitions
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles & Tailwind directives
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v8 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/joy-mart.git
cd joy-mart

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## 🎨 Design System (Clean Tech + Warm Orange & Glass UI)

| Token | Hex Value | Purpose |
|---|---|---|
| Primary Background | `#FFFFFF` | Core layout background |
| Secondary Background | `#F3F1ED` | Section panels, inputs, secondary blocks |
| Primary Text | `#252525` | High-contrast readable typography |
| Primary Accent | `#E98545` | Warm orange CTAs, active highlights, badges |
| Soft Accent | `#FBE9DC` | Gentle background chips, glow overlays |
| Border | `#E7E5E1` | Subtle divider lines and card borders |
| Muted Text | `#777777` | Captions, secondary labels, metadata |
| Success | `#27845A` | In-stock badges, delivered statuses |
| Sale Price | `#D9534F` | Discount tags, sale pricing, error highlights |
| Footer Background | `#252525` | Deep dark footer contrast |
| Footer Text | `#FFFFFF` | Bright readable footer typography |

### 🪟 Glass UI System
- `.glass`: Translucent surface with blur (`backdrop-filter: blur(16px)`), subtle warm orange ambient shadow.
- `.glass-strong`: High opacity glass for sticky headers & modals (`backdrop-filter: blur(24px)`).
- `.glass-accent`: Warm orange tinted glass for highlighted cards and promo banners.
- `.glass-chip`: Glass pills and badges.

---

## 🌐 Pages & Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/products` | All Products |
| `/products/:id` | Product Details |
| `/cart` | Shopping Cart |
| `/login` | Login |
| `/register` | Register |
| `/profile` | User Profile |
| `/track` | Order Tracking |

---

## 📦 NPM Scripts

```bash
npm run dev      # Start development server at http://localhost:5173
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint checks
```

---

## 🔐 Demo Authentication

Since this project uses LocalStorage (no backend), you can:
- Register any email + password on the `/register` page
- Login with those credentials on the `/login` page
- Your cart and profile data will persist in the browser

---

## 📄 License

This project is for educational and demonstration purposes.

---

> Built with ❤️ for the Bangladesh tech community — **Joy Mart** | Curated Hardware
