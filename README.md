# Khatab Restaurant & Café — Digital Menu SPA & Admin Dashboard

[![Deploy to GitHub Pages](https://github.com/hamod1hamod/restaurant-platform/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/hamod1hamod/restaurant-platform/actions/workflows/deploy-pages.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=flat&logo=github)](https://hamod1hamod.github.io/restaurant-platform/)

> 🌐 **Live Demo Website:** [https://hamod1hamod.github.io/restaurant-platform/](https://hamod1hamod.github.io/restaurant-platform/)

A minimalist, high-performance, single-page application (SPA) for a digital restaurant menu and an admin management dashboard, built with **React**, **Tailwind CSS**, and a lightweight **Node.js** local-first backend.

---

## 🌟 Key Features

### 1. Public Menu View (Customer Facing)
- **Single, Mobile-Friendly Page:** Ultra-fast, responsive layout tailored for mobile phones, tablets, and desktops.
- **Prominent Category Cards:** Elegant category cards featuring the exact elevated aesthetic with appetizing photos, item counts (`X صنف`), floating category emojis (🍗, 🍕, 🍔, 🥩, 🍟, 🥤, 🍰), and direct "عرض الأصناف" triggers.
- **Dynamic Items Display:** Clicking any category or tab dynamically loads and displays all items belonging to that category below it.
- **Dynamic Sizes & Prices:** Each item displays its Name, Description, and **multiple Size options with their corresponding Prices** (e.g., Small, Medium, Large, or Family) with interactive size selector pills and instant price calculation.
- **Instant Search:** Real-time search across all dishes and drinks.
- **Slide-in Cart Drawer:** Quick order review, quantity adjustment, and order confirmation in Egyptian Pounds (EGP / ج.م).

### 2. Admin Dashboard (Management Facing)
- **Secure Access Gate:** Easily accessible via the "لوحة الإدارة" button in the header (Password: `admin123`).
- **Category Management (CRUD):** Add, Edit, and Delete categories with name, emoji icon, description, and image URL.
- **Quick Category Photo Changer:** Clicking `[ 📷 تغيير الصورة ]` or `[ 📷 تعديل الصورة ]` directly opens an instant photo picker with high-definition food presets.
- **Item Management (CRUD):** Add, Edit, and Delete menu items within any category.
- **Dynamic Size & Price Form:** Add and remove multiple sizes with corresponding prices dynamically (`[+ إضافة حجم]`).

### 3. Lightweight & Local-First Architecture
- **Dual-Mode Data Layer:** Automatically connects to the local Node.js Express API (`http://localhost:5000/api`) when running, and seamlessly falls back to persistent `localStorage` when deployed standalone (e.g. on GitHub Pages).

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Start Backend API Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies (only express, cors, multer)
npm install

# Start the Node.js server
npm start
```
The backend API server will run at: `http://localhost:5000`

### 3. Start Frontend Development Server
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 🔑 Admin Access
- Click **"لوحة الإدارة"** in the top navigation bar.
- Enter the admin password: `admin123` (or click "استخدام تلقائي").
- You can now add, edit, delete categories, change photos, and manage items with multiple sizes and prices.

---

## 📦 Build for Production / Deployment
```bash
cd frontend
npm run build
```
The production bundle is generated in `frontend/dist/` and is deployed to GitHub Pages via `.github/workflows/deploy-pages.yml`.
