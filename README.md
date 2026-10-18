# RythuMitra 360 (రైతు మిత్ర 360)
### Smart Agriculture Management Platform

[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5%2B-purple?logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![JSON%20Server](https://img.shields.io/badge/JSON%20Server-REST%20Mock-green?logo=json)](https://github.com/typicode/json-server)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-teal)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-amber)](#license)
[![Codegnan](https://img.shields.io/badge/Major%20Project-Codegnan%20IT%20Solutions-crimson)](https://codegnan.com/)

> **"Smart Farming. Better Decisions. Higher Yields."**

**RythuMitra 360** is an advanced, digital smart agriculture management platform designed specifically for Indian farmers. It replaces fragmented paper notebooks and informal guesswork with a centralized operational cockpit covering crop lifecycle planning, farm task scheduling, expense tracking, harvest sales accounting, warehouse inventory safety alerts, APMC mandi rates, and agro-meteorological advisory.

Developed as a **Frontend Major Project** at **Codegnan IT Solutions** for the Python Full Stack Development curriculum.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Technology Stack](#-technology-stack)
3. [System Architecture](#-system-architecture)
4. [Folder Structure](#-folder-structure)
5. [REST API Endpoints](#-rest-api-endpoints)
6. [Quickstart & Local Installation](#-quickstart--local-installation)
7. [Environment Variables](#-environment-variables)
8. [Deployment Guide](#-deployment-guide)
9. [Viva & Technical Interview Guide](#-viva--technical-interview-guide)
10. [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌾 Key Features

### 1. Farmer Operations Cockpit (Dashboard)
- **Live Dynamic Metrics:** Calculates Total Crops, Cultivated Acreage, Cumulative Expenditures, Gross Revenue, and Net Farm Profit directly from database records.
- **Data Visualizations (Recharts):**
  - Donut Chart: Crop acreage distribution across sown land.
  - Bar Chart: Expenditures categorized across seeds, fertilizers, labor, and machinery.
  - Cashflow Health Card: Financial margin calculation and ROI multiplier.
- **Operational Feeds:** Recent active task checklist with 1-click status toggles, simulated agro-weather widget, and low-stock inventory alerts.

### 2. Crop Lifecycle Management (`/crops`)
- View registered crops in **Interactive Card Grid** or **Tabular View**.
- Register new crops with season classifications: *Kharif (Monsoon)*, *Rabi (Winter)*, and *Zaid (Summer)*.
- Client-side validation ensuring harvest dates occur strictly after planting dates.
- Automatic harvest countdown timer (*"In 15 Days"* / *"Due Today"*).

### 3. Farm Activity & Task Calendar (`/activities`)
- Schedule field tasks: Irrigation, Fertilizer Application, Pesticide Sprays, Weeding, Harvesting, and Soil Bed Prep.
- Filter tasks by progress status (`Pending`, `In Progress`, `Completed`), category, and priority (`High`, `Medium`, `Low`).
- Overdue task alerts and instant checkbox status toggling via HTTP `PATCH`.

### 4. Expenditure Tracker (`/expenses`)
- Record input expenditures across 8 agricultural cost categories.
- Tracks payment instruments (Cash, UPI / PhonePe, Bank Transfer, Kisan Credit Card).
- Auto-summing top banner computing total expenses across active search filters.

### 5. Harvest Sales & Produce Revenue (`/sales`)
- Commercial produce sales ledger with automatic real-time total computation:
  $$\text{Total Amount} = \text{Quantity Sold} \times \text{Unit Price}$$
- Buyer contact management (APMC traders, dal mills, oil expellers) with 10-digit phone validation.

### 6. Farm Inventory & Supplies (`/inventory`)
- Catalog seed bags, fertilizers, pesticides, sprayers, and irrigation equipment.
- Dynamic **Low Stock Safety Alert:** High-visibility warning triggered whenever available stock falls below safety reorder levels ($\le \text{reorderLevel}$).

### 7. APMC Mandi Market Prices (`/market`)
- Daily benchmark wholesale prices for Paddy, Guntur Red Chilli, Cotton, Turmeric, and Maize.
- Tracks modal prices, minimum/maximum trading ranges, and market price trends (rising, softening, steady).
- Clearly labeled simulated demonstration data.

### 8. Agro-Meteorological Weather Advisory (`/weather`)
- Microclimate current temperature, humidity, rainfall probability, wind velocity, and soil moisture estimates.
- Agronomic advisory regarding pesticide spray safety, wind drift hazards, and irrigation timing.
- 7-day weather forecast with rain probability.

### 9. Farmer Profile & Settings (`/profile`)
- Manage farmer biographical details, farm estate name, location, soil classification, and preferred language (Telugu, English, Hindi).
- Full edit and save support communicating with JSON Server.

### 10. System Documentation & Help (`/about`)
- Comprehensive project metadata, interactive FAQ accordion, toll-free Kisan Helpline (1800-180-1551), and technical architecture notes.

---

## 🛠 Technology Stack

| Technology | Purpose | Description |
|---|---|---|
| **React.js 18+** | Frontend UI Library | Declarative, component-based UI built entirely with Functional Components and Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`). |
| **Vite 5+** | Bundler & Dev Server | Fast ESM-based development server with instantaneous Hot Module Replacement (HMR). |
| **Bootstrap 5.3** | CSS Framework | Mobile-first 12-column responsive grid system, modals, cards, badges, and alerts. |
| **Bootstrap Icons** | Iconography | High-resolution SVG vector icons for agriculture, finances, and system navigation. |
| **React Router DOM v6** | Client-Side Routing | Declarative nested routing, pathless layout wrappers (`AppLayout`), and 404 catch-all. |
| **Axios** | HTTP Client | Promise-based REST client with custom baseURL and centralized response error interceptors. |
| **Recharts** | Data Visualizations | Composable SVG charting library for interactive donut and bar charts. |
| **JSON Server** | Mock REST Backend | Lightweight, zero-coding REST API server backed by a persistent `db.json` database. |
| **Concurrently** | Developer Tooling | Single-command execution of both backend API and Vite client servers. |

---

## 🏛 System Architecture

```text
+--------------------------------------------------------------------------+
|                        BROWSER CLIENT (React + Vite)                     |
|                                                                          |
|  +--------------------+   +---------------------+   +-----------------+  |
|  |     React Views    |-->|   React Router v6   |-->|   AppLayout     |  |
|  | (Dashboard, Crops) |   |  (Nested Routing)   |   |(Sidebar+Navbar) |  |
|  +--------------------+   +---------------------+   +-----------------+  |
|            |                                                             |
|            v                                                             |
|  +--------------------------------------------------------------------+  |
|  |                Axios REST Service Layer (src/services/)            |  |
|  |    (cropService, expenseService, salesService, inventoryService)   |  |
|  +--------------------------------------------------------------------+  |
+-----------------------------------|--------------------------------------+
                                    | HTTP Requests (GET, POST, PUT, DELETE)
                                    v
+--------------------------------------------------------------------------+
|                       BACKEND LAYER (JSON Server)                        |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |                 JSON Server REST Engine (Port 5001)                |  |
|  +--------------------------------------------------------------------+  |
|                                   | Read / Write                         |
|                                   v                                      |
|  +--------------------------------------------------------------------+  |
|  |                       db.json Database                             |  |
|  | (9 Collections: crops, activities, expenses, sales, inventory...)  |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

---

## 📂 Folder Structure

```text
RythuMitra 360/
├── public/                      # Static assets (sprout favicon SVG)
├── src/
│   ├── assets/                  # Illustrations & brand assets
│   ├── components/
│   │   ├── common/              # Reusable UI widgets
│   │   │   ├── StatCard.jsx     # Dashboard metric card
│   │   │   ├── Modal.jsx        # Accessible dialog wrapper
│   │   │   ├── AlertMessage.jsx # Toast and alert banner
│   │   │   ├── Loader.jsx       # Farm spinner
│   │   │   ├── EmptyState.jsx   # No-data indicator
│   │   │   ├── ConfirmDialog.jsx# Delete guard modal
│   │   │   └── Pagination.jsx   # Table pagination control
│   │   ├── layout/              # Structural chrome
│   │   │   ├── AppLayout.jsx    # Master shell with <Outlet />
│   │   │   ├── Sidebar.jsx      # Multi-tier navigation drawer
│   │   │   ├── Navbar.jsx       # Top navigation, alerts, & profile
│   │   │   └── Footer.jsx       # Dashboard footer
│   │   └── charts/              # Recharts analytical charts
│   │       ├── CropDistributionChart.jsx # Donut chart
│   │       ├── MonthlyExpenseChart.jsx   # Bar chart
│   │       └── RevenueExpenseComparison.jsx # Cashflow progress
│   ├── pages/                   # Application route views
│   │   ├── LandingPage.jsx      # Public product homepage
│   │   ├── Dashboard.jsx        # Central operations cockpit
│   │   ├── CropManagement.jsx   # Crops listing & CRUD
│   │   ├── ActivityManagement.jsx # Task calendar & status toggle
│   │   ├── ExpenseManagement.jsx # Farm input expenditures
│   │   ├── SalesRevenue.jsx     # Produce sales & receipts
│   │   ├── InventoryManagement.jsx # Warehouse stocks & alerts
│   │   ├── MarketPrices.jsx     # APMC Mandi rates
│   │   ├── WeatherForecast.jsx  # 7-day agro-forecast
│   │   ├── ProfileSettings.jsx  # Farmer bio & farm settings
│   │   ├── AboutHelp.jsx        # FAQ & documentation
│   │   └── NotFound.jsx         # 404 page
│   ├── services/                # Axios API services
│   │   ├── api.js               # Central Axios client
│   │   ├── cropService.js
│   │   ├── activityService.js
│   │   ├── expenseService.js
│   │   ├── salesService.js
│   │   ├── inventoryService.js
│   │   ├── marketService.js
│   │   ├── weatherService.js
│   │   └── farmerService.js
│   ├── utils/                   # Shared utility helpers
│   │   ├── constants.js         # Seasons, units, categories
│   │   ├── formatters.js        # Indian Rupees (₹) & date formats
│   │   └── validators.js        # Client validation logic
│   ├── styles/                  # Theme styling
│   │   ├── main.css             # Design tokens, typography, cards
│   │   └── sidebar.css          # Responsive sidebar drawer
│   ├── App.jsx                  # React Router configuration
│   └── main.jsx                 # Application entry point
├── db.json                      # Mock database with 9 collections
├── package.json                 # Scripts and dependencies
├── vite.config.js               # Bundler configuration
├── .gitignore                   # Git exclusion rules
├── .env.example                 # Environment variable template
└── README.md                    # Project documentation
```

---

## 🔌 REST API Endpoints

JSON Server runs on **`http://localhost:5001`** and exposes the following endpoints:

| Resource | Methods Supported | Sample Endpoint | Description |
|---|---|---|---|
| **Crops** | `GET`, `POST`, `PUT`, `DELETE` | `/crops` | Primary crop records with acreage and harvest timelines. |
| **Activities** | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | `/activities` | Field tasks with due dates, priority, and completion status. |
| **Expenses** | `GET`, `POST`, `PUT`, `DELETE` | `/expenses` | Farm operational input costs across 8 categories. |
| **Sales** | `GET`, `POST`, `PUT`, `DELETE` | `/sales` | Produce monetization with computed total revenues. |
| **Inventory** | `GET`, `POST`, `PUT`, `DELETE` | `/inventory` | Farm supply stock counts and reorder thresholds. |
| **Market Prices**| `GET` | `/marketPrices` | APMC mandi wholesale rates across regional yards. |
| **Weather** | `GET` | `/weather` | Microclimate conditions and 7-day forecast. |
| **Farmer** | `GET`, `PUT` | `/farmers` | Farmer profile bio and land specifications. |
| **Notifications**| `GET`, `PATCH` | `/notifications` | System alerts for stock, weather, and tasks. |

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (Tested on Node.js v24.21.0)
- **npm:** v9.0.0 or higher
- **Git**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/RythuMitra-360.git
   cd RythuMitra-360
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Verify `.env` contains:
   ```env
   VITE_API_BASE_URL=http://localhost:5001
   ```

4. **Start the Application (Frontend + Backend concurrently):**
   ```bash
   npm run dev
   ```
   This will simultaneously launch:
   - **Frontend (Vite):** `http://localhost:5173`
   - **Backend (JSON Server):** `http://localhost:5001`

5. **Open in Browser:**
   Visit [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🌐 Environment Variables

| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5001` | Base URL of the REST API (JSON Server locally, or hosted URL in production). |

---

## 🚢 Deployment Guide

When deploying RythuMitra 360, remember that **a static host (Vercel, Netlify, GitHub Pages) only serves HTML/JS and cannot execute Node.js JSON Server**. Therefore, deployment follows a **Decoupled Architecture**:

### Step 1: Deploy the Backend (JSON Server)
1. Push `db.json` and a lightweight `server.js` or use services like:
   - **Render.com (Web Service)**
   - **Railway.app**
   - **Glitch.com**
2. Deploy JSON Server to obtain your public API URL:
   `https://rythumitra-api.onrender.com`

### Step 2: Deploy the Frontend (Vite React)
1. Push your repository to **GitHub**.
2. Connect your GitHub repository to **Vercel** or **Netlify**.
3. Set the Environment Variable in your deployment dashboard:
   - `VITE_API_BASE_URL` = `https://rythumitra-api.onrender.com`
4. Build command: `npm run build`
5. Output directory: `dist`

---

## 🎓 Viva & Technical Interview Guide

Here are the top questions and answers examiners frequently ask during major project evaluations:

### Q1: Why did you choose Vite over `create-react-app` (CRA)?
> **Answer:** CRA relies on Webpack, which bundles the entire application before starting the development server. As the app grows, build times slow down significantly. Vite leverages native browser ES Modules (ESM) to serve source files on demand and uses `esbuild` (written in Go) for pre-bundling, resulting in sub-second server startup and instant Hot Module Replacement (HMR).

### Q2: How did you implement client-side routing and prevent page reloads?
> **Answer:** We used `react-router-dom` v6. Using `<BrowserRouter>`, `<Routes>`, and `<Route>`, the browser's HTML5 History API (`pushState`) intercepts URL changes. Instead of sending a new request to the server, React conditionally re-renders the appropriate component. We used an `<Outlet />` inside `AppLayout.jsx` so the `Sidebar` and `Navbar` remain mounted while only the inner page view changes.

### Q3: Why is an API service layer preferred over writing Axios calls inside components?
> **Answer:** Decoupling API calls into `src/services/` follows the **Separation of Concerns** principle. Presentation components stay clean and only handle UI state and rendering. If the backend URL, authentication headers, or error-handling logic change, we only modify `api.js` rather than rewriting dozens of React components.

### Q4: Are your dashboard statistics hardcoded? How are they calculated?
> **Answer:** None of the statistics are hardcoded. When the dashboard mounts, it executes a concurrent `Promise.all` fetch across all collections (`crops`, `expenses`, `sales`, etc.). We calculate metrics using functional JavaScript reducers:
> - Total Sown Area: `crops.reduce((sum, c) => sum + Number(c.areaAcres), 0)`
> - Total Expenses: `expenses.reduce((sum, e) => sum + Number(e.amount), 0)`
> - Gross Revenue: `sales.reduce((sum, s) => sum + Number(s.totalAmount), 0)`
> - Net Profit: `Total Revenue - Total Expenses`

### Q5: How do you handle network failure if the JSON Server backend is offline?
> **Answer:** In `src/services/api.js`, we implemented an Axios **Response Interceptor**. When an HTTP error occurs or no response is received (`error.request`), the interceptor intercepts the error and returns a friendly message: *"Cannot connect to backend server. Make sure JSON Server is running on port 5001."* The component catches this in a `try...catch` block, disables the loader, and renders a dismissible `AlertMessage` banner.

---

## 👨‍💻 Author & Acknowledgments

- **Developer:** Mahesh Miriyala
- **Course:** Python Full Stack Development
- **Institute:** **Codegnan IT Solutions**
- **Mentor:** Antigravity AI Senior Architect & Pair Programmer

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
