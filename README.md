<div align="center">
  <img src="https://img.icons8.com/color/96/000000/food-and-wine.png" alt="Smart Mess System Logo" width="80">

  # 🍽️ Smart Mess System
  
  **A Next-Generation Food Waste Reduction & Meal Optimization Platform**

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
    <a href="https://www.djangoproject.com/"><img src="https://img.shields.io/badge/Backend-Django%205-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"></a>
  </p>

  <p align="center">
    Bridging the communication gap between diners and kitchens to eliminate food waste and operational inefficiencies.
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-about-the-project">About The Project</a></li>
    <li><a href="#-key-features">Key Features</a></li>
    <li><a href="#-tech-stack">Tech Stack</a></li>
    <li><a href="#-getting-started">Getting Started</a></li>
    <li><a href="#-project-structure">Project Structure</a></li>
    <li><a href="#-roadmap">Roadmap</a></li>
  </ol>
</details>

---

## 📖 About The Project

### The Problem
University and corporate dining facilities (messes) face a massive daily challenge: **food waste**. Without accurate headcounts, kitchens rely on guesswork. This leads to overcooking (resulting in severe food waste and lost revenue) or undercooking (resulting in diner dissatisfaction).

### Our Solution
**Smart Mess** is a modern, full-stack SaaS platform designed to eradicate this inefficiency. By providing a transparent, real-time booking ecosystem, the platform ensures kitchens know exactly how many meals to prepare, optimizing food costs and dramatically reducing environmental impact.

---

## ✨ Key Features

### 🎓 Multi-Tenant Architecture
* **Strict Data Isolation:** Securely separates user bases across different colleges, universities, or corporate campuses.
* **Contextual Access:** Kitchen staff only interact with data, menus, and metrics relevant to their specific institution.

### 🧑‍🎓 Student Experience
* **Interactive Daily Menus:** View precisely what is being served for Breakfast, Lunch, and Dinner.
* **Real-Time Booking System:** Secure meals with single-click bookings.
* **Smart Cancellations:** Manage schedules dynamically with strict time-based restrictions (cancellations lock down prior to meal start times).

### 👨‍🍳 Kitchen Command Center
* **Live Analytics:** Instantly view active booking metrics for any given day to drive preparation volumes.
* **Dynamic Calendar Management:** Seamlessly navigate between past, current, and future dates using a native calendar picker to manage schedules ahead of time.
* **Menu Deployment:** Publish and update menus in real-time, instantly notifying the student portal.
* **Reporting:** Download daily operational CSV reports for offline record-keeping and auditing.

---

## 🚀 Tech Stack

### Client
* **React 18 (Vite):** Blazing fast frontend framework.
* **Tailwind CSS v4:** Utility-first styling for a sleek, modern, glassmorphic UI.
* **Recharts & Framer Motion:** Interactive data visualization and fluid micro-animations.
* **Lucide React:** Clean, consistent iconography.

### Server
* **Django 5.0:** Robust, secure Python web framework.
* **Django REST Framework:** Scalable and flexible API architecture.
* **SimpleJWT:** Stateless, secure JSON Web Token authentication.
* **SQLite / PostgreSQL:** Flexible database layer supporting both rapid development and production scaling.

---

## 🛠️ Getting Started

Follow these steps to establish a local development environment.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [Python](https://www.python.org/) (v3.10.x or higher)
* Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PrakharPurwar12/Smart_Food_Waste_Reduction_-_Meal_Optimization_System.git
   cd Smart_Food_Waste_Reduction_-_Meal_Optimization_System
   ```

2. **Initialize Backend:**
   ```bash
   cd backend
   python -m venv .venv
   
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Configure Environment:**
   Create a `.env` file in the `backend` directory:
   ```env
   DEBUG=True
   SECRET_KEY=your_secure_development_key
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

4. **Run Migrations & Start Server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   *Backend is now running on `http://localhost:8000`*

5. **Initialize Frontend:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend is now running on `http://localhost:5173`*

---

## 📁 Project Structure

```text
smart-food-system/
├── backend/                  # Django REST API
│   ├── manage.py
│   ├── core/                 # Settings & Configuration
│   ├── users/                # Auth & Multi-tenant logic
│   └── meals/                # Booking & Menu endpoints
└── frontend/                 # React UI
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # View components (Dashboards, Auth)
    │   ├── services/         # API integration layer
    │   └── layouts/          # Persistent page wrappers
    └── package.json
```

---

## 🔮 Roadmap

- [x] Secure JWT Authentication & Multi-Tenant Setup
- [x] Student Booking Portal & Live Menus
- [x] Kitchen Analytics Dashboard & Dynamic Calendar
- [ ] **AI Waste Prediction Engine:** Forecast expected attendance using historical trends and weather data.
- [ ] **Mobile App Port:** React Native implementation for iOS/Android.

---

<div align="center">
  <i>Built with ❤️ to make university dining smarter, cheaper, and fundamentally more sustainable.</i>
</div>
