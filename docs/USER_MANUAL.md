# EcoTrace 360 - User Manual & Role Workflows

---

## 1. Default Demo Credentials

For quick evaluation during college project presentations, the system provides pre-seeded accounts:

| Role | Email | Password | Primary Workflow |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@ecotrace.org` | `EcoCitizen2026!` | AI waste scanning, nearby bins map, rewards, pickup booking |
| **Collector** | `collector@ecotrace.org` | `EcoCollector2026!` | Optimized collection route navigation, weighing verification |
| **Recycler** | `recycler@ecotrace.org` | `EcoRecycler2026!` | Inspecting batches, advancing 5-stage transformation |
| **Admin** | `admin@ecotrace.org` | `EcoAdmin2026!` | Central command center, bin alarms, fleet dispatch |
| **Super Admin** | `superadmin@ecotrace.org` | `EcoSuperAdmin2026!` | Full platform control, audit logs, system-wide analytics |

---

## 2. End-to-End Circular Lifecycle Walkthrough

### Step 1: Citizen Waste Classification
1. Navigate to `/ai-scanner`.
2. Click **Load Sample Plastic** or upload your own waste image.
3. Click **Classify Waste**. The YOLO vision model returns the material category (e.g. *PET plastic*), confidence score (*94%*), bounding boxes, and recyclability instructions.
4. Click **Deposit in Smart Bin & Claim 20 Points** to receive green points.

### Step 2: Smart Bin Telemetry
1. Navigate to `/smart-bins`.
2. View live ultrasonic fill levels and load cell weights across campus bins.
3. Click **Trigger IoT Telemetry Step** to simulate real-time sensor updates over WebSockets.

### Step 3: Collector Route Optimization
1. Switch role to **Collector** (or visit `/collector`).
2. The route optimizer automatically calculates the shortest driving route visiting high-fill bins ($\ge 70\%$).
3. Click **Verify & Collect** to record measured weight.

### Step 4: Digital Plastic Passport & Public Verification
1. Navigate to `/passports`.
2. Select batch `ECO-PET-2026-000001` to view its generated QR code.
3. Click **Open Public Verification URL** (`/track/ECO-PET-2026-000001`). Anyone scanning the physical QR code can verify the tamper-proof lifecycle timeline.

### Step 5: Recycler Processing
1. Switch role to **Recycler** (`/recycler`).
2. Advance the batch through the 5 certified stages: *Received* $\rightarrow$ *Optical Sorting* $\rightarrow$ *Hot Wash & Shredding* $\rightarrow$ *Pellet Extrusion* $\rightarrow$ *Circular Complete*.

### Step 6: Rewards Redemption & Marketplace
1. As a Citizen, visit `/rewards` to redeem points for cafeteria discounts and eco-kits.
2. As a Recycler or Manufacturer, visit `/marketplace` to purchase certified rPET flakes and HDPE pellets.
