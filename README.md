# ECOTRACE 360
### AI-Powered Smart Waste Management & Plastic Recycling Traceability Platform
> *Every Waste Has a Journey. Every Plastic Has a Future.*

---

## 🌟 Executive Summary

**EcoTrace 360** is an enterprise-grade circular economy platform that connects **Citizens**, **Waste Collectors**, **Certified Recyclers**, and **Smart City Administrators** into a unified, traceable ecosystem.

It integrates:
- **Edge AI Vision**: Instant waste material detection (PET, HDPE, Cardboard, Glass, Metal) using YOLOv8 with bounding boxes and recyclability guidance.
- **IoT Smart Bins**: ESP32 firmware with HC-SR04 ultrasonic distance sensing and HX711 load cell weight measurement publishing live telemetry over MQTT and WebSockets.
- **Digital Plastic Passport**: Unique QR codes (`ECO-PET-2026-XXXXXX`) providing transparent, tamper-proof tracking from collection to recycled pellets.
- **Smart Route Optimization**: Distance-based TSP algorithm prioritizing overflowing smart bins.
- **Gamification & Rewards**: Green points wallet, campus leaderboards, and voucher redemption.
- **B2B Marketplace**: Trading platform for verified rPET flakes and recycled polymer granules.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.9+)

### 1. Backend Setup
```bash
# Navigate to workspace
cd "/Users/praveen/waste management"

# Activate Python virtual environment
source venv/bin/activate

# Run automated tests
cd backend && PYTHONPATH=. ../venv/bin/pytest tests/test_full_lifecycle.py -v

# Start FastAPI backend server
PYTHONPATH=. ../venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend API will be running at: `http://localhost:8000`  
Interactive OpenAPI documentation: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# Open a new terminal
cd "/Users/praveen/waste management/frontend"

# Build production bundle
npm run build

# Start development preview
npm run dev
```
Frontend will be running at: `http://localhost:3000`

### 3. Docker Compose (Alternative All-in-One Deployment)
```bash
docker-compose up --build
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Key Capability |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@ecotrace.org` | `EcoCitizen2026!` | AI waste scanning, nearby bins map, rewards |
| **Collector** | `collector@ecotrace.org` | `EcoCollector2026!` | Collection route optimization, weight verification |
| **Recycler** | `recycler@ecotrace.org` | `EcoRecycler2026!` | 5-stage transformation, inventory update |
| **Admin** | `admin@ecotrace.org` | `EcoAdmin2026!` | Smart-city command center, sensor alarms |
| **Super Admin** | `superadmin@ecotrace.org` | `EcoSuperAdmin2026!` | Complete security, audit logs, city analytics |

---

## 📁 Project Architecture

```
waste management/
├── backend/
│   ├── app/
│   │   ├── api/          # 11 REST API routers (auth, bins, iot, ai, batches, etc.)
│   │   ├── core/         # Config, database, security (bcrypt), WebSockets
│   │   ├── models/       # 28 normalized SQLAlchemy tables
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # YOLO classifier, ML predictor, QR service, route optimizer
│   │   └── seed/         # Initial database seeder
│   ├── tests/            # Automated test suite (test_full_lifecycle.py)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, Layout, StatCards
│   │   ├── context/      # AuthContext & role switching
│   │   ├── pages/        # 14 complete portal pages
│   │   ├── services/     # Central API client
│   │   └── types/        # TypeScript interfaces
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── iot/
│   ├── firmware/         # ESP32 C++ firmware & pin configuration
│   ├── simulation/       # Python IoT sensor telemetry simulator
│   └── wiring_diagram.md # Hardware wiring schematic & BOM
├── docs/                 # Architecture, ER diagram, API docs, User manual
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📜 License
Developed for educational, university evaluation, and smart-city research demonstrations under the MIT License.
