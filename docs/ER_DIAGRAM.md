# EcoTrace 360 - Database Entity Relationship (ER) Documentation

The EcoTrace 360 database is normalized into **28 relational tables** implementing relational constraints, foreign keys, and indexes.

---

## 1. Complete ER Diagram

```mermaid
erDiagram
    users ||--o{ waste_submissions : "submits"
    users ||--o{ pickup_requests : "requests"
    users ||--o{ complaints : "files"
    users ||--o{ marketplace_listings : "sells"
    users ||--o{ marketplace_orders : "buys"
    users ||--|| rewards_wallet : "owns"
    users ||--|| collectors : "profile"
    users ||--|| recyclers : "profile"

    rewards_wallet ||--o{ reward_transactions : "logs"

    bins ||--o{ bin_readings : "telemetry"
    bins ||--|| iot_devices : "mounted_on"
    bins ||--o{ collections : "emptied_in"

    waste_batches ||--o{ batch_events : "immutable_history"
    waste_batches ||--o{ recycling_records : "processed_in"

    marketplace_listings ||--o{ marketplace_orders : "contains"

    users {
        int id PK
        string email UK
        string hashed_password
        string full_name
        string role
        boolean is_verified
        datetime created_at
    }

    bins {
        int id PK
        string bin_code UK
        string name
        float latitude
        float longitude
        float current_fill_percent
        float current_weight_kg
        string status
    }

    waste_batches {
        int id PK
        string batch_code UK
        string plastic_type
        float initial_weight_kg
        float processed_weight_kg
        string status
        string qr_code_url
    }

    batch_events {
        int id PK
        int batch_id FK
        string status
        int actor_id FK
        string location
        float recorded_weight_kg
        datetime timestamp
    }

    rewards_wallet {
        int id PK
        int user_id FK
        int balance_points
        int lifetime_points
        string tier
    }
```

---

## 2. Table Index Reference

| Table Name | Description | Key Indexes / Constraints |
| :--- | :--- | :--- |
| `users` | User credentials, roles, institutional affiliation | `email` (UNIQUE), `id` (PK) |
| `bins` | Physical smart dustbin geographic nodes | `bin_code` (UNIQUE), `status` |
| `bin_readings` | Historical ultrasonic & load cell telemetry readings | `bin_id` (FK), `timestamp` |
| `iot_devices` | ESP32 hardware metadata & firmware versions | `device_uid` (UNIQUE), `bin_id` (FK) |
| `waste_batches` | Digital Plastic Passport master batch identity | `batch_code` (UNIQUE), `status` |
| `batch_events` | Append-only immutable lifecycle events | `batch_id` (FK), `timestamp` |
| `pickup_requests` | Doorstep on-demand citizen collection requests | `request_code` (UNIQUE), `user_id` (FK) |
| `rewards_wallet` | Citizen green reward balances & tiers | `user_id` (UNIQUE FK) |
| `reward_transactions`| Immutable points debit/credit ledger | `wallet_id` (FK), `created_at` |
| `marketplace_listings`| B2B recyclable feedstock listings | `seller_id` (FK), `material_type` |
| `complaints` | Citizen illegal dumping reports with GPS coordinates | `complaint_code` (UNIQUE) |
| `environmental_records`| Aggregated CO₂, landfill, and material metrics | `period` |
