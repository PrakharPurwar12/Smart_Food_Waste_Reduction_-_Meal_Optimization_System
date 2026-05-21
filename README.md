<div align="center">

# 🥗 Smart Food Waste Reduction & Meal Optimization System

**A production-grade, AI-powered platform for institutional mess management —**  
**combining intelligent attendance prediction, real-time kitchen insights, and a seamless meal booking experience.**

<br/>

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Django%206-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Scikit-learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Proxy-Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Overview

The **Smart Food Waste Reduction & Meal Optimization System** is a full-stack, data-driven platform designed for institutional food service environments (college/university mess halls). It bridges the gap between unpredictable attendance and efficient meal preparation by leveraging machine learning, real-time booking data, and role-based dashboards.

> Built as a production-oriented proof-of-concept for smart, scalable institutional catering management.

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🤖 **AI Attendance Prediction** | `RandomForestRegressor` forecasts daily student headcount for precise meal planning |
| 📅 **Meal Booking System** | Students can book, cancel, and track meals with full history |
| 📊 **Kitchen Analytics Dashboard** | Real-time prep recommendations and attendance forecasts for kitchen staff |
| 🍽️ **Rotating Menu Management** | Dynamic daily menus with popularity tracking and admin control |
| 🔄 **Automated Model Retraining** | APScheduler triggers periodic retraining to keep predictions accurate |
| 🐳 **Multi-Container Deployment** | Frontend, backend, database, and proxy orchestrated via Docker Compose |
| 🔐 **JWT Authentication** | Stateless, secure token-based auth with role-based access (Student / Staff / Admin) |

---

## 🧩 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                    ┌────────▼────────┐
                    │   Nginx Proxy   │  :80
                    └────────┬────────┘
           ┌─────────────────┴──────────────────┐
           │                                    │
  ┌────────▼────────┐                  ┌────────▼────────┐
  │ React + Vite    │                  │ Django REST API  │
  │   Frontend      │                  │    Backend       │  :8000
  │    :5173        │                  └────────┬─────────┘
  └─────────────────┘                           │
                                   ┌────────────┼────────────┐
                                   │            │            │
                            ┌──────▼──────┐ ┌──▼──────┐ ┌──▼────────────┐
                            │  ML Engine  │ │ APSched │ │  PostgreSQL   │
                            │ (sklearn)   │ │  Jobs   │ │  Database     │
                            └─────────────┘ └─────────┘ └───────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 19, Vite, Tailwind CSS, Recharts, Axios |
| **Backend** | Django 6, Django REST Framework, CORS Headers, Simple JWT |
| **Machine Learning** | Scikit-learn (`RandomForestRegressor`), Pandas, Joblib |
| **Database** | PostgreSQL (production), SQLite (development) |
| **Task Scheduling** | APScheduler (automated model retraining) |
| **Deployment** | Docker Compose, Nginx reverse proxy |

---

## 📁 Project Structure

```
smart-food-system/
│
├── backend/                        # Django REST API & ML services
│   ├── config/                     # Project settings, URL routing, WSGI/ASGI
│   ├── meals/                      # Booking, menu management, mess operations
│   ├── predictions/                # ML model, training pipeline, analytics API
│   ├── users/                      # Authentication, roles, user management
│   └── requirements.txt            # Python dependencies
│
├── frontend/                       # React + Vite application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Route-level page views
│   │   └── services/               # Axios API clients
│   ├── package.json
│   └── vite.config.js
│
├── nginx/                          # Nginx reverse proxy config
├── Docker-compose.yaml             # Multi-service orchestration
└── README.md
```

---

## ⚙️ Getting Started

### 🐳 Recommended — Docker Compose (One Command)

```bash
git clone <repository-url>
cd smart-food-system
docker compose up --build
```

All services will start automatically:

| Service | Port |
|:---|:---|
| Frontend (Vite) | `5173` |
| Backend (Django) | `8000` |
| Nginx Proxy | `80` |
| PostgreSQL | `5432` |

---

### 🧑‍💻 Local Development Setup

#### 1. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

# Install dependencies and run migrations
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

> ⚙️ Environment variables are loaded from `backend/.env`. Create this file before running the server.

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🖥️ User Interfaces

| Interface | Audience | Core Functionality |
|:---|:---|:---|
| **Student Portal** | Students | Book/cancel meals, view menus, access booking history |
| **Kitchen Dashboard** | Kitchen Staff | Daily prep guidance, attendance forecasts, live metrics |
| **Admin Panel** | Administrators | Menu control, trend analytics, ML model performance |

---

## 🤖 Machine Learning Pipeline

The prediction engine uses a `RandomForestRegressor` trained on historical booking data.

```
Historical Bookings → Feature Engineering → Model Training → Attendance Forecast
                                                   ↑
                              APScheduler (Automated Periodic Retraining)
```

**Key signals used for prediction:**
- Day of week & meal type
- Historical booking patterns
- Rolling attendance averages
- Holiday / academic calendar markers

---

## 🔮 Roadmap

- [ ] 📱 Cross-platform mobile application (React Native)
- [ ] 📷 QR code-based meal validation and attendance marking
- [ ] 📦 Real-time inventory and ingredient-level forecasting
- [ ] ☁️ Cloud-native deployment with managed PostgreSQL and autoscaling
- [ ] 📧 Automated notifications for low-booking days or menu changes

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.  
Please open an issue first to discuss what you would like to change.

---

<div align="center">

**Designed for scalable, intelligent meal management.**  
*Reducing food waste — one prediction at a time.*

</div>