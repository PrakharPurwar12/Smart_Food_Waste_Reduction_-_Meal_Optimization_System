<div align="center">
  <img src="https://img.icons8.com/color/96/000000/food-and-wine.png" alt="Logo">
  <h1>🍽️ Smart Mess System</h1>
  <p><b>Food Waste Reduction & Meal Optimization Platform</b></p>
  <p>
    <img src="https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/Backend-Django%205-green?style=for-the-badge&logo=django" alt="Django">
    <img src="https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  </p>
</div>

---

## 📖 The Problem
University and corporate messes face a significant challenge: **food waste**. Without knowing exactly how many students will attend a given meal, kitchens often overcook (leading to massive waste) or undercook (leading to shortages). 

## 🎯 Our Solution
**Smart Mess** is a modern, full-stack SaaS platform designed to solve this problem. By bridging the communication gap between diners and kitchen staff, the system optimizes meal preparation, significantly reduces food waste, cuts down on operational costs, and ensures a seamless dining experience.

---

## ✨ Core Features

### 🎓 Multi-Tenant Architecture
- Securely isolate data across different colleges, universities, or corporate campuses.
- Kitchen staff only see data for their specific institution.

### 👥 Role-Based Portals

#### 🧑‍🎓 Student Portal
- **View Daily Menus:** See exactly what's cooking for Breakfast, Lunch, and Dinner.
- **Real-Time Booking:** Book meals in advance to secure your spot.
- **Smart Cancellations:** Cancel or re-book meals with strict time-based restrictions (cancellations lock when the meal starts).

#### 👨‍🍳 Kitchen Dashboard
- **Live Attendance Stats:** Instantly view how many students have booked each meal for any given day.
- **Dynamic Calendar Management:** Seamlessly navigate between past, current, and future dates using a native calendar picker to manage schedules ahead of time.
- **Menu Management:** Publish and update specific menus for every meal, ensuring real-time synchronization with the Student Portal.
- **Data Export:** Download daily booking lists for offline record-keeping.

### 🔮 Coming Soon: AI Waste Prediction
- Integration of predictive analytics to forecast expected attendance based on historical data, weather, and day-of-the-week trends.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS v4, Framer Motion, Recharts, Lucide React, Axios |
| **Backend** | Django 5.0, Django REST Framework (DRF), SimpleJWT (Authentication) |
| **Database** | SQLite (Development) / PostgreSQL (Production ready) |
| **Language** | JavaScript (ES6+), Python 3.10+ |

---

## 🚀 Quick Start Guide

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/PrakharPurwar12/Smart_Food_Waste_Reduction_-_Meal_Optimization_System.git
cd Smart_Food_Waste_Reduction_-_Meal_Optimization_System
```

### 2️⃣ Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Activate on Windows:
.venv\Scripts\activate
# Activate on Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file (.env)
echo "DEBUG=True" > .env
echo "SECRET_KEY=your_secret_key_here" >> .env
echo "ALLOWED_HOSTS=localhost,127.0.0.1" >> .env
echo "CORS_ALLOWED_ORIGINS=http://localhost:5173" >> .env

# Run database migrations
python manage.py migrate

# Start the server (Runs on http://localhost:8000)
python manage.py runserver
```

### 3️⃣ Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start the development server (Runs on http://localhost:5173)
npm run dev
```

---
<div align="center">
  <i>Built with ❤️ to make university dining smarter and more sustainable.</i>
</div>
