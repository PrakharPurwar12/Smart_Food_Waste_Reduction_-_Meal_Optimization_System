# 🥗 Smart Food Waste Reduction & Meal Optimization System

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Django%206-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Machine Learning](https://img.shields.io/badge/AI/ML-Scikit--Learn-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

An **AI-Powered SaaS Platform** designed to revolutionize institutional mess management. By combining **Full-Stack Development** with **Predictive Analytics**, this system optimizes food preparation, minimizes wastage, and streamlines kitchen operations for colleges and universities.

---

## 🚀 Key Highlights

- 🤖 **AI Attendance Prediction**: RandomForest-based forecasting of student attendance.
- 📉 **Waste Optimization**: Intelligent food quantity recommendations based on predictions.
- 🏢 **Multi-Tenant Architecture**: Complete data isolation and per-college ML models.
- 📅 **Smart Rotating Menu**: Automated menu management with popularity tracking.
- 📊 **Kitchen Analytics**: Real-time operational visibility and prediction monitoring.
- 🔄 **Automated Retraining**: Continuous ML model improvement via scheduled tasks.

---

## 📖 Table of Contents

- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [Machine Learning Engine](#-machine-learning-engine)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation Guide](#-installation-guide)
- [Operational Dashboards](#-operational-dashboards)
- [Future Roadmap](#-future-roadmap)

---

## ✨ Core Features

### 🎓 For Students
- **Secure Booking**: Effortless meal booking and cancellation.
- **Menu Visibility**: Real-time access to the rotating mess menu.
- **History Tracking**: Comprehensive booking and attendance history.
- **Profile Management**: College-specific account settings.

### 👨‍🍳 For Kitchen Staff
- **Operational Command Center**: Real-time stats on bookings and predictions.
- **Smart Recommendations**: Automated rice/dal/vegetable quantity calculations.
- **Menu Management**: Quick updates and auto-fill from rotating menu datasets.
- **Prediction Insights**: Confidence levels for every AI forecast.

### 📈 AI & Analytics
- **Dynamic Forecasting**: Accounts for weekends, exams, and festivals.
- **Trend Analysis**: Visualizes attendance patterns and waste metrics.
- **Auto-Retraining**: System learns from new data every week automatically.

---

## 🏗 System Architecture

The platform follows a modular, scalable architecture designed for institutional deployment.

```text
[ Frontend: React + Vite ] <───HTTPS/JSON───> [ Backend: Django REST Framework ]
                                                        │
                                                        ├── [ AI Prediction Engine ]
                                                        ├── [ Scheduled Tasks (APScheduler) ]
                                                        └── [ Database: SQLite / Multi-Tenant ]
```

### 🔐 Security & Multi-Tenancy
- **JWT Authentication**: Secure, stateless session management.
- **College Scoping**: Every query is filtered by college ID for strict data privacy.
- **Role-Based Access**: Granular control for Students, Staff, and Admins.

---

## 🧠 Machine Learning Engine

The "Brain" of the system uses advanced regression to solve the problem of manual estimation.

<details>
<summary><b>Click to expand ML Technical Details</b></summary>

- **Model**: `RandomForestRegressor`
- **Features**: Day of week, Meal Type, Popularity Score, Weekend/Exam/Festival indicators.
- **Target**: Actual student attendance.
- **Confidence System**: Classified as High/Medium/Low based on training variance and external factors.
- **Persistence**: Models are serialized using `Joblib` and stored per college.
- **Retraining**: Automated logic handles incremental data updates to maintain accuracy.

</details>

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS, Recharts, Axios |
| **Backend** | Django 6, Django REST Framework, JWT |
| **AI/ML** | Scikit-learn, Pandas, Joblib |
| **DevOps** | Vite, Dotenv, WhiteNoise, APScheduler |
| **Database** | SQLite (Scalable to PostgreSQL) |

---

## 📂 Project Structure

```text
Smart_Food_Waste_Reduction/
├── frontend/                 # React Source Code
│   ├── src/pages/            # Role-specific dashboards
│   └── src/services/         # API integration layer
├── backend/                  # Django Project
│   ├── users/                # Auth & User Management
│   ├── meals/                # Booking & Menu Logic
│   │   └── data/             # Rotating Menu JSON
│   ├── predictions/          # ML Engine & Analytics
│   │   ├── data/             # Attendance Datasets (CSV)
│   │   ├── trained_models/   # Persistent ML Artifacts
│   │   └── ml_model.py       # Core Prediction Logic
│   └── config/               # Project Settings
└── README.md
```

---

## 🔧 Installation Guide

### 1. Clone & Environment
```bash
git clone <repository-url>
cd Smart_Food_Waste_Reduction
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Linux/Mac)
pip install -r requirements.txt
python manage.py migrate
python predictions/train_model.py  # Initialize ML models
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🖼 Operational Dashboards

| Dashboard | Target User | Primary Goal |
| :--- | :--- | :--- |
| **Student Portal** | Students | Fast meal booking & menu checking |
| **Kitchen Hub** | Mess Staff | Real-time prep counts & AI recommendations |
| **Analytics Pro** | Admins | Long-term trend analysis & waste reduction monitoring |

---

## 🛣 Future Roadmap

- [ ] **Mobile App**: Cross-platform Flutter/React Native application.
- [ ] **QR Attendance**: Scan-based entry tracking for 100% data accuracy.
- [ ] **Inventory Sync**: Automated ingredient ordering based on ML predictions.
- [ ] **Cloud Migration**: Deployment to AWS/GCP with PostgreSQL.

---

## ⚖ License & Academic Value

This project is designed as a **Production-Grade Prototype** for academic research and institutional waste reduction initiatives. It demonstrates the seamless integration of **Modern Web Architecture** with **Predictive Artificial Intelligence**.

---
*Developed with ❤️ for a Greener & Smarter Institution.*