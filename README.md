# Smart Food Waste Reduction & Meal Optimization System

An AI-powered Smart Mess Management and Food Waste Reduction platform designed for colleges and universities.

The system combines:
- meal booking management
- AI-based attendance prediction
- intelligent food quantity optimization
- operational kitchen dashboards
- analytics and monitoring
- automated ML retraining

to reduce food wastage, improve kitchen operations, and optimize institutional meal management.

---

# Table of Contents

- Introduction
- Problem Statement
- Project Objectives
- Real-World Motivation
- System Overview
- Core Features
- Workflow of the System
- System Architecture
- Frontend Architecture
- Backend Architecture
- Machine Learning Architecture
- Dataset Architecture
- Database Design
- API Architecture
- Authentication & Security
- Multi-Tenant College Architecture
- Prediction & Optimization Workflow
- Operational Workflow
- Technology Stack
- Project Structure
- Installation Guide
- Environment Variables
- Machine Learning Training
- Available Dashboards
- Future Improvements
- Challenges Faced
- Research & Academic Value
- Conclusion
- License

---

# Introduction

Food wastage is a major operational and economic problem in institutional mess systems such as:
- colleges
- universities
- hostels
- training institutes

Traditional mess systems generally estimate food preparation manually based on assumptions rather than actual attendance data. This often results in:
- excessive food wastage
- unnecessary operational costs
- inaccurate food preparation
- poor resource utilization
- inefficient kitchen planning

The Smart Food Waste Reduction & Meal Optimization System was developed to solve this problem using:
- student meal booking
- machine learning-based attendance prediction
- food quantity optimization
- operational analytics

The platform acts as an intelligent operational assistant for kitchen staff and administrators.

---

# Problem Statement

Most institutional mess systems face the following problems:

## 1. Food Wastage

Food is often prepared in excess because kitchens do not know the exact number of students who will attend meals.

This leads to:
- wastage of rice, vegetables, dal, oil, and dairy products
- increased operational cost
- sustainability concerns

---

## 2. Manual Estimation

Mess staff generally estimate attendance using:
- assumptions
- experience
- previous trends

These estimations become inaccurate during:
- weekends
- exams
- festivals
- holidays
- special events

---

## 3. Lack of Data-Driven Operations

Traditional mess systems usually lack:
- analytics
- prediction systems
- attendance forecasting
- operational intelligence

---

## 4. Inefficient Meal Planning

Without prediction systems:
- ingredient purchasing becomes difficult
- kitchen preparation becomes inefficient
- food inventory management suffers

---

# Project Objectives

The primary objectives of this project are:

- Reduce food wastage in institutional mess systems
- Predict expected student attendance using AI/ML
- Optimize food preparation quantities
- Improve operational efficiency of kitchen staff
- Provide real-time analytics and operational visibility
- Build a scalable multi-tenant smart mess platform
- Demonstrate integration of Full Stack Development with Machine Learning

---

# Real-World Motivation

Large institutional mess systems serve hundreds or thousands of students daily.

Even a small prediction error can result in:
- large-scale food wastage
- financial losses
- operational inefficiency

This project attempts to bridge the gap between:
- operational workflows
and
- intelligent prediction systems

using modern full-stack technologies and machine learning.

---

# System Overview

The platform provides separate operational workflows for:

| User Type | Purpose |
|---|---|
| Students | Meal booking & menu visibility |
| Kitchen Staff | Operational dashboard & food planning |
| Administrators | Analytics & monitoring |

The system uses:
- historical attendance data
- meal popularity
- festival patterns
- weekend behavior
- exam schedules

to generate intelligent attendance predictions.

---

# Core Features

# Student Features

- Secure Authentication
- College-Specific Access
- Meal Booking System
- Meal Cancellation
- Rotating Menu Visibility
- Meal Schedule
- Booking History
- Daily Meal Tracking

---

# Kitchen Staff Features

- Operational Dashboard
- Meal Booking Statistics
- Daily Menu Management
- AI-Based Attendance Prediction
- Food Quantity Recommendations
- Prediction Confidence System
- Auto-Fill Rotating Menu
- Waste Reduction Insights

---

# AI & Machine Learning Features

- Attendance Forecasting
- RandomForestRegressor Prediction Engine
- Historical Data Analysis
- Prediction Confidence Classification
- Automated Model Retraining
- Per-College ML Models
- Per-Meal Prediction Models
- Persistent Model Storage
- Prediction Fallback System

---

# Analytics Features

- Attendance Trend Analysis
- Waste Monitoring
- Prediction vs Actual Analysis
- Operational Insights
- Confidence Distribution
- Prediction Monitoring Dashboard

---

# Workflow of the System

## Overall Workflow

```text
Student Books Meal
        ↓
Booking Stored in Database
        ↓
Historical Attendance Updated
        ↓
Machine Learning Model Predicts Attendance
        ↓
Kitchen Dashboard Receives Prediction
        ↓
Food Quantity Optimization Calculated
        ↓
Kitchen Prepares Optimized Quantity
        ↓
Food Wastage Reduced
```

---

# System Architecture

The project follows a modular full-stack architecture.

## High-Level Architecture

```text
Frontend (React + Vite)
        ↓
REST APIs (Django REST Framework)
        ↓
Business Logic Layer
        ↓
Machine Learning Prediction Engine
        ↓
SQLite Database + Dataset Layer
```

---

# Frontend Architecture

The frontend is built using:
- React 19
- Vite
- Tailwind CSS
- Axios
- Recharts

---

## Frontend Responsibilities

- UI rendering
- role-based dashboards
- operational workflows
- prediction display
- analytics visualization
- API communication
- authentication handling

---

## Frontend Design Philosophy

The frontend was intentionally designed to be:
- operationally simple
- minimal
- fast
- readable
- non-technical for mess staff

The kitchen dashboard focuses on:
- meal counts
- prediction summaries
- food quantity recommendations
- quick menu actions

instead of complex technical analytics.

---

# Backend Architecture

The backend is built using:
- Django 6
- Django REST Framework
- JWT Authentication
- APScheduler
- Scikit-learn

---

## Backend Responsibilities

- API handling
- authentication
- meal booking logic
- role-based authorization
- prediction generation
- food optimization
- analytics generation
- automated retraining
- dataset management

---

# Django Apps Structure

| App | Purpose |
|---|---|
| users | Authentication & user management |
| meals | Meal booking & menu management |
| predictions | ML prediction & analytics |

---

# Machine Learning Architecture

The project integrates Machine Learning to forecast expected student attendance.

---

# Why Machine Learning Was Used

Attendance patterns vary due to:
- weekdays/weekends
- meal popularity
- festivals
- examinations
- seasonal behavior

Manual prediction becomes unreliable at scale.

Machine Learning helps:
- identify attendance patterns
- improve operational planning
- reduce food wastage
- adapt to changing trends

---

# Machine Learning Workflow

## Step 1 — Dataset Collection

Dataset includes:
- historical attendance
- meal type
- weekend patterns
- exam impact
- festival impact
- popularity scores
- waste records

Dataset file:

```text
backend/predictions/data/mess_attendance_dataset.csv
```

---

## Step 2 — Feature Engineering

Features used:
- day
- meal_type
- popularity_score
- is_weekend
- is_exam
- is_festival
- waste_kg

Target variable:
- actual_students

---

## Step 3 — Data Preprocessing

The system performs:
- label encoding
- dataset cleaning
- feature transformation
- train-test split

---

## Step 4 — Model Training

The project uses:

```text
RandomForestRegressor
```

because it:
- handles nonlinear patterns
- performs well on operational datasets
- handles fluctuating attendance behavior
- improves forecasting quality

---

## Step 5 — Model Evaluation

The model is evaluated using:
- MAE (Mean Absolute Error)
- R² Score

---

## Step 6 — Model Persistence

Trained models are saved using:
- Joblib

Stored inside:

```text
backend/predictions/trained_models/
```

This prevents retraining on every request.

---

## Step 7 — Prediction API

The backend loads trained models and generates:
- attendance prediction
- confidence level
- food optimization recommendation

---

# Prediction Confidence System

Predictions are classified as:
- High Confidence
- Medium Confidence
- Low Confidence

Confidence is based on:
- historical variance
- weekend behavior
- festival impact
- exam schedules
- training distribution

---

# Automated Retraining System

The system includes:
- APScheduler-based retraining
- scheduled model updates
- training logs
- automatic model replacement

This allows the ML system to improve continuously over time.

---

# Dataset Architecture

## Rotating Menu Dataset

The project uses:

```text
backend/meals/data/rotating_menu.json
```

Benefits:
- reusable menu architecture
- scalable operational data
- future admin customization
- analytics compatibility

---

## Attendance Dataset

The project includes:

```text
backend/predictions/data/mess_attendance_dataset.csv
```

containing:
- attendance patterns
- waste records
- popularity signals
- exam/festival indicators

---

# Database Design

## Main Models

| Model | Purpose |
|---|---|
| User | Authentication & roles |
| College | Multi-tenant separation |
| MealBooking | Student bookings |
| MessMenu | Daily menus |
| Prediction | Attendance predictions |
| ModelTrainingLog | ML training history |

---

# Multi-Tenant College Architecture

The system is college-aware.

Each college has:
- isolated bookings
- isolated menus
- isolated predictions
- isolated analytics
- isolated ML models

This architecture enables:
- scalability
- SaaS expansion
- operational separation

---

# API Architecture

The backend exposes REST APIs for:
- authentication
- booking management
- menu management
- predictions
- analytics

---

# Important API Endpoints

## Authentication

```text
/api/auth/
```

---

## Meals

```text
/api/meals/
```

---

## Predictions

```text
/api/predictions/
```

---

# Sample Prediction API

## Request

```json
{
  "meal_type": "Lunch",
  "date": "2026-05-10"
}
```

---

## Response

```json
{
  "predicted_students": 186,
  "confidence": "High",
  "food_plan": {
    "rice": "24 kg",
    "dal": "12 kg"
  }
}
```

---

# Authentication & Security

Implemented using:
- JWT Authentication
- Protected Routes
- Role-Based Permissions
- College Isolation
- Secure API Access

Roles:
- Student
- Kitchen Staff

---

# Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Django 6 |
| API | Django REST Framework |
| Authentication | JWT |
| ML Framework | Scikit-learn |
| ML Model | RandomForestRegressor |
| Dataset Processing | Pandas |
| Scheduler | APScheduler |
| Database | SQLite |
| Build Tool | Vite |

---

# Project Structure

```text
Smart_Food_Waste_Reduction_-_Meal_Optimization_System/
│
├── frontend/
│
├── backend/
│   ├── config/
│   ├── users/
│   ├── meals/
│   ├── predictions/
│   │
│   ├── predictions/data/
│   │   └── mess_attendance_dataset.csv
│   │
│   ├── predictions/trained_models/
│   │
│   ├── meals/data/
│   │   └── rotating_menu.json
│
└── README.md
```

---

# Installation Guide

# 1. Clone Repository

```bash
git clone <repository-url>
cd Smart_Food_Waste_Reduction_-_Meal_Optimization_System
```

---

# Backend Setup

## 2. Create Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
pip install -r backend/requirements.txt
```

---

## 4. Configure Environment Variables

Create:

```text
backend/.env
```

Example:

```env
SECRET_KEY=your_secret_key
DEBUG=True
```

---

## 5. Apply Migrations

```bash
cd backend
python manage.py migrate
```

---

## 6. Train ML Models

```bash
python predictions/train_model.py
```

---

## 7. Start Backend Server

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

## 8. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 9. Configure Frontend Environment

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

---

## 10. Start Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Available Dashboards

# Student Dashboard

Features:
- meal booking
- menu visibility
- booking history
- meal cancellation

---

# Kitchen Dashboard

Features:
- operational overview
- attendance prediction
- food recommendation
- menu management
- analytics access

---

# Analytics Dashboard

Features:
- attendance trends
- waste analysis
- prediction monitoring
- operational insights

---

# Challenges Faced

During development, several technical challenges were addressed:

- frontend/backend route synchronization
- multi-tenant prediction isolation
- ML model persistence
- dataset engineering
- operational dashboard simplification
- prediction fallback handling
- automated retraining workflows
- responsive operational UI design

---

# Future Improvements

Planned future enhancements include:

- PostgreSQL migration
- QR-based attendance system
- Real-time attendance ingestion
- Inventory management
- Vendor management
- Cost optimization
- Deep learning models
- Mobile application
- Cloud deployment
- Real-world production analytics

---

# Research & Academic Value

This project demonstrates:
- full-stack development
- machine learning integration
- operational optimization
- SaaS architecture concepts
- workflow-oriented UX design
- analytics engineering
- AI-assisted forecasting

Suitable for:
- final year major projects
- AI/ML demonstrations
- portfolio projects
- research prototypes
- startup MVP concepts

---

# Conclusion

The Smart Food Waste Reduction & Meal Optimization System demonstrates how Artificial Intelligence and Full Stack Development can be combined to solve real-world operational problems.

By integrating:
- meal booking
- machine learning prediction
- food optimization
- analytics
- operational workflows

the platform helps institutions:
- reduce food wastage
- improve kitchen efficiency
- optimize operational planning
- move toward data-driven mess management

---

# License

This project is intended for educational and research purposes.