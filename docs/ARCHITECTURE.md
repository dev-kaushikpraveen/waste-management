# EcoTrace 360 - System Architecture Specification

## 1. System Vision & Value Proposition

**EcoTrace 360** is an enterprise-grade smart-city waste management and plastic recycling traceability platform. It integrates Edge AI computer vision, IoT telemetry, Digital Plastic Passports, and a transparent immutable audit trail to bridge the gap between waste generation and certified recycling.

---

## 2. Multi-Tier High-Level Architecture

```mermaid
flowchart TD
    subgraph Client_Applications["Client Layer (Frontend)"]
        A1["Citizen Web App (React 18 + TS + Tailwind)"]
        A2["Collector Route Navigation Interface"]
        A3["Recycler 5-Stage Transformation Portal"]
        A4["Admin & Super Admin Command Center"]
        A5["Public QR Verification Portal (/track/:code)"]
    end

    subgraph IoT_Edge["IoT & Physical Sensing Layer"]
        B1["ESP32 Microcontroller Node"]
        B2["HC-SR04 Ultrasonic Distance Sensor"]
        B3["HX711 24-bit ADC + Load Cell"]
        B4["Mosquitto MQTT Broker (TCP: 1883)"]
        B5["Python Telemetry Ingestion Bridge & Simulator"]
    end

    subgraph Backend_Gateway["Application & AI Layer (FastAPI)"]
        C1["API Gateway & JWT Authentication (bcrypt)"]
        C2["Role-Based Access Control (RBAC) Guard"]
        C3["AI Waste Detection Pipeline (YOLOv8)"]
        C4["AI Predictive Analytics (Random Forest & Isolation Forest)"]
        C5["Digital Plastic Passport QR Engine"]
        C6["Distance-based Collection Route Optimizer (TSP)"]
        C7["WebSocket Live Telemetry Broadcaster"]
    end

    subgraph Persistence["Data & Storage Layer"]
        D1[("PostgreSQL / SQLite Database (28 Tables)")]
        D2[("Append-Only Batch Event Ledger")]
        D3[("QR Code & Evidence Storage")]
    end

    Client_Applications <-->|REST & WebSockets| Backend_Gateway
    IoT_Edge -->|MQTT / HTTP Telemetry| Backend_Gateway
    Backend_Gateway <--> Persistence
```

---

## 3. Core Software Modules (12 Modules)

1. **Citizen Portal**: AI waste scanner, nearby smart bins map, green points wallet, pickup scheduling, and community competitions.
2. **AI Waste Classification**: YOLO-based classification with bounding box coordinates, confidence scoring, and disposal instructions.
3. **IoT Smart Bin Monitoring**: Live ultrasonic fill percentage, load cell weight measurements, battery level, and overflow alarms.
4. **Digital Plastic Passport**: Unique QR-coded identifiers (`ECO-PET-2026-XXXXXX`) logging immutable custody transitions.
5. **Smart Waste Collection**: Distance-optimized collection sequences and pickup status updates.
6. **Recycler Portal**: 5-stage processing flow (Inspection $\rightarrow$ Sorting $\rightarrow$ Washing $\rightarrow$ Shredding $\rightarrow$ Pelletizing).
7. **Green Rewards & Gamification**: Verified transaction ledger, leaderboards (Individual, Hostel, College), and campus vouchers.
8. **AI Waste Prediction**: Random Forest regression forecasting area waste volumes and bin overflow probabilities.
9. **Recycling Marketplace**: B2B platform connecting recyclers with packaging manufacturers.
10. **Environmental Impact Analytics**: Quantified CO₂ abated, trees saved, and landfill volume avoided.
11. **Citizen Complaint Portal**: Geotagged illegal dumping and damaged bin reports.
12. **Admin Command Center**: Centralized KPIs, sensor health monitoring, and municipal dispatch controls.
