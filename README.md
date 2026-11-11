# Gourmet Haven - Restaurant Digital Menu & Management Platform

[![Deploy to GitHub Pages](https://github.com/hamod1hamod/restaurant-platform/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/hamod1hamod/restaurant-platform/actions/workflows/deploy-pages.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=flat&logo=github)](https://hamod1hamod.github.io/restaurant-platform/)
[![Codespaces](https://img.shields.io/badge/Codespaces-Open%20in%20Browser-blue?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=hamod1hamod/restaurant-platform)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Ready-2496ED?logo=docker)](docker-compose.yml)

> 🌐 **Live Demo Website:** [https://hamod1hamod.github.io/restaurant-platform/](https://hamod1hamod.github.io/restaurant-platform/)  
> 🎓 **Student Developer Guide:** See [STUDENT_PLAN_GUIDE.md](STUDENT_PLAN_GUIDE.md) for Codespaces, custom domain, and cloud hosting perks.

A modern, responsive, full-stack restaurant platform featuring an interactive **Customer Digital Menu & Ordering Website** and a comprehensive **Admin Restaurant Management Dashboard**, backed by a high-performance **Python FastAPI** backend with dual **PostgreSQL / SQLite** database engines.

---

## 🌟 Key Features

### 1. Customer Landing Page & Digital Menu
- **Bilingual Interface (English & Arabic):** Instant toggle with native `RTL` (Right-to-Left) and `LTR` layout orientation.
- **Dark Mode & Light Mode:** Seamless theme switching with persistent user preference.
- **Hero Showcase:** Dynamic hero title, subtitle, backdrop imagery, hours pill, and direct WhatsApp ordering button.
- **Dynamic Food Categories:** Categorized dishes (Burgers, Steaks, Artisan Pizza, Breakfast, Starters, Desserts, Juices, Specialty Coffee) dynamically managed by the administrator.
- **Advanced Search & Filtering:**
  - Real-time search across dish titles and descriptions (both English and Arabic).
  - Filter by Category, Vegetarian, Spicy, and Best Seller badges.
  - Sort by Price (Low to High, High to Low), Popularity, and Newest additions.
- **Product Details & Customization Modal:**
  - High-resolution imagery, full descriptions, prep times, calorie counts, and ingredients list.
  - Multi-size selector (e.g., Single Patty, Double, Regular, Sharing) with automatic live price recalculation.
  - Configurable add-on extras (e.g., Extra Cheese, Truffle Aioli, Mushrooms) with custom prices.
  - Special kitchen instructions field.
- **Interactive Cart & Checkout Flow:**
  - Slide-over Cart Drawer with item breakdown, size and extras details, and quantity adjustments.
  - Promotional discount coupon validator (e.g. `WELCOME10`, `GOURMET20`, `SAVE5`).
  - Order types: **Delivery**, **Pickup**, and **Dine-In** (with Table Number).
  - Payment methods: **Cash on Delivery**, **Cash at Counter**, and **Online Card Simulator**.
  - Generates a unique tracking Order Number (e.g., `ORD-20261111-36BAF0`) with a confirmation receipt.
- **Additional Sections:**
  - Chef's Best Sellers showcase.
  - Exclusive Promotions & Discount Vouchers.
  - Restaurant Culinary Story & Hygiene Standards.
  - High-res Food & Dining Photo Gallery.
  - Customer Testimonials & interactive "Leave a Review" modal.
  - Location, Hours, Google Maps embed, and Customer Care telephone.

---

### 2. Comprehensive Admin Dashboard
Accessible via the **Admin Portal** button in the header (Default credentials: `admin` / `admin123`).

- **Dashboard Overview & Analytics:**
  - KPI cards: Gross Revenue, Total Orders, Active Pipeline Orders, Menu Dish Count.
  - Interactive Sales Chart (Daily, Weekly, Monthly view toggles).
  - Top-selling food items ranked by volume and revenue contribution.
  - Live inbound orders table with real-time status indicators.
- **Category Management:**
  - Full CRUD: Add, edit, delete categories.
  - Bilingual titles & descriptions (EN & AR).
  - Reorder categories and toggle visibility on the live menu.
  - Image upload or image URL preview.
- **Food & Drink Menu Management (All 15 Fields):**
  1. Product Name (English)
  2. Product Name (Arabic)
  3. Description (English)
  4. Description (Arabic)
  5. Category assignment
  6. Product Type (Food, Drinks, Desserts, Snacks, Combos, Special Offers)
  7. Regular Base Price
  8. Discount Promotional Price
  9. Product Image (File upload or direct URL)
  10. Available Sizes & Differential Pricing (e.g., Small, Medium, Large)
  11. Ingredients list (EN & AR)
  12. Extra Options & Add-on Pricing (e.g., Extra Cheese, Sauces)
  13. Availability toggle (In Stock / Sold Out)
  14. Promotional Badges (Featured, Best Seller, New, Vegetarian, Spicy)
  15. Display Order priority
  - Duplicate product button for quick menu expansion.
- **Order Management & Invoicing:**
  - Search orders by order number, customer name, or phone.
  - Filter orders by status: `new`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `completed`, `cancelled`.
  - Update order status and payment status in one click.
  - Detailed modal view of ordered dishes, sizes, extras, and customer instructions.
  - Printable official tax invoice / receipt with restaurant branding.
- **Pricing & Coupon Management:**
  - Create custom discount codes (Percentage or Fixed Dollar amount).
  - Configure minimum order threshold and maximum discount caps.
  - Real-time coupon usage tracking.
- **Restaurant Information & Visual Landing Customizer:**
  - Edit restaurant name, logo, phone, WhatsApp, address, opening hours, and currency.
  - Customize the customer landing page: Hero headline (EN & AR), subtitle, hero banner image.
  - Section visibility toggles: Enable or disable any homepage section without touching source code.
  - Configure minimum delivery order value and delivery fees.
- **Customer CRM:**
  - Searchable directory of customer profiles derived from past orders.
  - Total order frequency, gross spend, and contact information.
- **Reports & Data Export:**
  - Download full sales reports in **CSV / Excel** format.
  - Printable financial summary audit.

---

## 🛠 Technology Stack

- **Frontend:**
  - React 19 + TypeScript + Vite
  - Tailwind CSS v4
  - Lucide React Icons
  - LocalStorage persistence for Cart, Language, Theme, and Auth
- **Backend:**
  - Python 3.11+ / FastAPI
  - SQLAlchemy 2.0 ORM
  - Pydantic v2 schemas and data validation
  - Passlib + Bcrypt password hashing
  - JWT Bearer Authentication & Role-based Access Control
  - Multipart file upload engine with static file serving
- **Database:**
  - Dual Compatibility: **PostgreSQL 16** (Production/Docker) and **SQLite** (instant zero-configuration local development).

---

## 🚀 Quick Start Guide (Local Development)

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed initial restaurant demo data
python -m app.seed

# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API and interactive Swagger documentation will be available at:
- **Swagger Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

---

### 2. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Open your browser at `http://localhost:5173` (or the port shown in terminal).

---

## 🐳 Docker & Docker-Compose Deployment

Deploy the complete multi-tier stack (PostgreSQL database + FastAPI backend + React production Nginx frontend) with a single command:

```bash
docker-compose up -d --build
```

### Services launched:
- **Frontend:** `http://localhost:80`
- **Backend API:** `http://localhost:8000`
- **PostgreSQL Database:** `localhost:5432`

---

## 🔐 Default Admin Account
- **Username:** `admin` (or `admin@restaurant.com`)
- **Password:** `admin123`
- Click the **Admin Portal** button in the top navbar and click **Auto Fill** for instant access.
