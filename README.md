# 🍽️ Smart Mess - Food Waste Reduction & Meal Optimization System

Smart Mess is a modern, full-stack SaaS platform designed to optimize meal preparation in university and corporate messes. By allowing students and staff to pre-book their meals and integrating predictive analytics, the system significantly reduces food waste, cuts down on operational costs, and ensures a seamless dining experience.

## ✨ Key Features

- **🎓 Multi-Tenant Architecture:** Securely isolate data across different colleges/institutions.
- **🔐 Role-Based Access Control:** Dedicated dashboards for Students (View & Book) and Kitchen Staff (Manage & Analyze).
- **📅 Real-Time Meal Booking:** Book, re-book, or cancel meals with time-based restrictions (cancellations locked after meal start times).
- **📊 Interactive Analytics:** Kitchen staff get clear insights into daily expected turnouts via visual charts.
- **📝 Daily Mess Menu Management:** Kitchen admins can publish specific menus for Breakfast, Lunch, and Dinner.
- **🌗 Modern UI/UX:** Built with Tailwind CSS v4 featuring responsive design, seamless Light/Dark mode toggling, and micro-animations.

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4** (Modern utility-first styling)
- **Framer Motion** (Smooth animations)
- **Recharts** (Data visualization)
- **Lucide React** (Beautiful iconography)
- **Axios** (API communication)

### Backend
- **Django 5.0** & **Django REST Framework (DRF)**
- **SQLite** (Development Database)
- **SimpleJWT** (Secure JWT-based Authentication)
- **Python 3.10+**

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate virtual environment
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 🔒 Security Best Practices
- The repository uses a strict `.gitignore` to prevent sensitive data (`.env`, `db.sqlite3`, `__pycache__`) from leaking.
- All backend routes are protected via JWT.
- Multi-tenant logic ensures users can only access data relevant to their registered institution.

## 🤝 Contributing
Contributions are welcome! Please create an issue or submit a pull request with your changes.

## 📄 License
This project is licensed under the MIT License.
