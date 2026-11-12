# 🎓 GitHub Student Developer Pack Features Guide

This repository is optimized to leverage the benefits included in your **GitHub Student Developer Pack**.

---

## 🚀 1. Free GitHub Pages Hosting (CI/CD Automated)
- **Live URL:** [https://hamod1hamod.github.io/restaurant-platform/](https://hamod1hamod.github.io/restaurant-platform/)
- **How it works:** Whenever you push code to the `main` branch, the `.github/workflows/deploy-pages.yml` workflow automatically builds the React 19 app and publishes it to GitHub Pages.
- **Offline / Standalone Fallback:** The frontend includes an intelligent mock data layer with persistent `localStorage`. Visitors can test the digital menu, customization modals, cart, checkout receipts, and the admin dashboard (`admin` / `admin123`) live without needing a local backend!

---

## ☁️ 2. GitHub Codespaces (1-Click Cloud Development)
*Included in Student Pack: 180 free core hours per month.*
- You can launch this entire full-stack application (FastAPI backend + React frontend + PostgreSQL database) directly in your browser without installing anything on your device.
- **How to launch:**
  1. Go to your repository: [https://github.com/hamod1hamod/restaurant-platform](https://github.com/hamod1hamod/restaurant-platform)
  2. Click the green **`<> Code`** button.
  3. Select the **Codespaces** tab $\to$ click **Create codespace on main**.
  4. The `.devcontainer/devcontainer.json` configuration will automatically spin up all Docker containers and forward ports `3000` and `8005`.

---

## 🌐 3. Free Custom Domain (Namecheap / Name.com)
*Included in Student Pack: 1 free `.me` or `.tech` domain for 1 year.*
- You can replace `hamod1hamod.github.io/restaurant-platform` with a custom branded restaurant domain (e.g., `khatabcafe.me` or `restaurantmenu.live`).
- **Steps to connect to GitHub Pages:**
  1. Claim your free domain at Namecheap or Name.com using your GitHub Student Pack.
  2. In your GitHub repository: Go to **Settings** $\to$ **Pages** $\to$ **Custom domain**.
  3. Enter your domain and click **Save**.
  4. Enable **Enforce HTTPS** (free SSL certificate provided automatically by GitHub).

---

## 🗄️ 4. Free Cloud Backend Hosting ($200 DigitalOcean & $100 Microsoft Azure)
*Included in Student Pack:*
- **DigitalOcean ($200 credit for 1 year):**
  - Create a \$6/month Basic Droplet with Docker pre-installed.
  - Clone this repository and run `docker compose up -d --build`.
  - Your FastAPI backend and PostgreSQL database will be running live 24/7 on a public IP!
- **Microsoft Azure ($100 credit + free services):**
  - Deploy the FastAPI container on Azure Container Apps or Azure App Service.
- **Connecting your deployed backend to GitHub Pages:**
  - In your GitHub repo settings, go to **Settings** $\to$ **Secrets and variables** $\to$ **Actions** $\to$ **Variables**.
  - Add `VITE_API_BASE_URL` with your live backend URL (e.g., `https://api.khatabcafe.me/api/v1`).

---

## 🛡️ 5. Automated CI & Dependabot Security
- **Continuous Integration (`.github/workflows/ci.yml`):** Runs automated TypeScript typechecks and Python backend verification on every push and PR.
- **Dependabot (`.github/dependabot.yml`):** Automatically scans npm and Python dependencies for security vulnerabilities and opens automated PRs to keep your project secure.
