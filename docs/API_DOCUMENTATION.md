# EcoTrace 360 - REST API Documentation

Base URL: `http://localhost:8000/api`  
Interactive OpenAPI Documentation: `http://localhost:8000/docs`  
ReDoc Documentation: `http://localhost:8000/redoc`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new user profile.
- **Request Body**:
  ```json
  {
    "email": "student@ecotrace.org",
    "password": "StrongPassword123!",
    "full_name": "Aarav Sharma",
    "role": "CITIZEN",
    "college_name": "IIT Delhi",
    "hostel_name": "Karakoram Hostel"
  }
  ```
- **Response**: `200 OK` with JWT bearer token and user profile.

### `POST /api/auth/login`
Authenticates user and returns JWT token.
- **Request Body**:
  ```json
  {
    "email": "citizen@ecotrace.org",
    "password": "EcoCitizen2026!"
  }
  ```

### `GET /api/auth/me`
Returns current authenticated user profile (`Authorization: Bearer <TOKEN>`).

---

## 2. AI Classification & Prediction (`/api/ai`)

### `POST /api/ai/classify-waste`
Infers material category, bounding boxes, and recyclability guidance from image.
- **Request Body**:
  ```json
  {
    "image_base64": "data:image/jpeg;base64,..."
  }
  ```
- **Response**:
  ```json
  {
    "predicted_category": "PET plastic",
    "confidence": 0.94,
    "detected_objects": ["PET Bottle", "Plastic Cap"],
    "bounding_boxes": [
      {"x": 0.25, "y": 0.20, "width": 0.50, "height": 0.65, "label": "PET Bottle", "confidence": 0.94}
    ],
    "disposal_recommendation": "Rinse bottle, compress, and deposit in Smart Plastic Bin.",
    "recyclability_guidance": "100% Recyclable into rPET fiber.",
    "model_version": "YOLO-WasteV8-Eco360"
  }
  ```

### `GET /api/ai/forecast-waste?area=Hostel%20Zone&days=5`
Returns Machine Learning time-series waste generation forecast and overflow risk.

---

## 3. Digital Plastic Passport (`/api/batches`)

### `POST /api/batches`
Initiates a new Digital Plastic Passport with certified initial weight and generated QR code.

### `GET /api/batches/track/{batch_code}`
**Public endpoint**: Returns complete immutable audit trail of the plastic batch from collection to recycled pellets.

### `PATCH /api/batches/{batch_id}/status`
Advances batch status (`RECEIVED`, `SORTED`, `PROCESSING`, `PROCESSED`, `RECYCLED`) and appends an immutable event to the audit ledger.

---

## 4. Smart Bins & IoT Telemetry (`/api/bins`, `/api/iot`)

### `GET /api/bins`
Returns all smart bins with real-time fill level and weight.

### `POST /api/iot/telemetry`
Ingestion endpoint for ESP32 hardware or simulator.
- **Payload**:
  ```json
  {
    "device_uid": "ESP32-BIN-DEL-01",
    "bin_code": "BIN-DEL-01",
    "distance_cm": 15.0,
    "weight_kg": 38.5,
    "battery_level": 94.0,
    "is_simulated": false
  }
  ```

### `POST /api/iot/simulate-step`
Executes a simulated telemetry step across all campus bins and broadcasts live via WebSockets.

---

## 5. Collections & Routing (`/api/collections`)

### `GET /api/collections/optimized-route`
Calculates optimal collection route using the Traveling Salesperson (TSP) algorithm prioritizing bins with fill level $\ge 70\%$.
