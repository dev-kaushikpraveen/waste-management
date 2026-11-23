import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, 
    Text, Enum as SQLEnum, JSON, Index, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRoleEnum(str, enum.Enum):
    CITIZEN = "CITIZEN"
    COLLECTOR = "COLLECTOR"
    RECYCLER = "RECYCLER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"

class BatchStatusEnum(str, enum.Enum):
    CREATED = "CREATED"
    COLLECTED = "COLLECTED"
    IN_TRANSIT = "IN_TRANSIT"
    RECEIVED = "RECEIVED"
    SORTED = "SORTED"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    RECYCLED = "RECYCLED"
    REJECTED = "REJECTED"

class CollectionStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    ASSIGNED = "ASSIGNED"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ComplaintStatusEnum(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"

# 1. users
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(SQLEnum(UserRoleEnum), default=UserRoleEnum.CITIZEN, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    college_name = Column(String(255), nullable=True)
    hostel_name = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    wallet = relationship("RewardsWallet", back_populates="user", uselist=False)
    submissions = relationship("WasteSubmission", back_populates="user")
    pickups = relationship("PickupRequest", foreign_keys="PickupRequest.user_id", back_populates="user")
    complaints = relationship("Complaint", foreign_keys="Complaint.user_id", back_populates="user")
    collector_profile = relationship("Collector", back_populates="user", uselist=False)
    recycler_profile = relationship("Recycler", back_populates="user", uselist=False)

# 2. roles
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

# 3. permissions
class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

# 4. user_roles
class UserRole(Base):
    __tablename__ = "user_roles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)

# 5. bins
class Bin(Base):
    __tablename__ = "bins"
    id = Column(Integer, primary_key=True, index=True)
    bin_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. BIN-CAMPUS-01
    name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    area = Column(String(100), default="Main Campus")
    bin_type = Column(String(50), default="Plastic & Dry Waste") # Plastic, Organic, E-Waste
    capacity_liters = Column(Float, default=120.0)
    max_weight_kg = Column(Float, default=50.0)
    current_fill_percent = Column(Float, default=0.0)
    current_weight_kg = Column(Float, default=0.0)
    status = Column(String(50), default="ACTIVE") # ACTIVE, MAINTENANCE, OFFLINE, OVERFLOW
    last_reported_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    readings = relationship("BinReading", back_populates="bin")
    device = relationship("IoTDevice", back_populates="bin", uselist=False)

# 6. bin_readings
class BinReading(Base):
    __tablename__ = "bin_readings"
    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(Integer, ForeignKey("bins.id", ondelete="CASCADE"), nullable=False, index=True)
    distance_cm = Column(Float, nullable=False)
    fill_percent = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    battery_level = Column(Float, default=100.0)
    temperature_c = Column(Float, default=25.0)
    is_simulated = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    bin = relationship("Bin", back_populates="readings")

# 7. iot_devices
class IoTDevice(Base):
    __tablename__ = "iot_devices"
    id = Column(Integer, primary_key=True, index=True)
    device_uid = Column(String(100), unique=True, index=True, nullable=False) # e.g. ESP32-BIN-01
    bin_id = Column(Integer, ForeignKey("bins.id"), unique=True, nullable=True)
    mac_address = Column(String(50), nullable=True)
    firmware_version = Column(String(50), default="v1.2.0")
    status = Column(String(50), default="ONLINE") # ONLINE, OFFLINE, FAULT
    ip_address = Column(String(50), nullable=True)
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    bin = relationship("Bin", back_populates="device")

# 8. waste_submissions
class WasteSubmission(Base):
    __tablename__ = "waste_submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False) # PET plastic, HDPE plastic, Paper, etc.
    estimated_weight_kg = Column(Float, default=0.5)
    image_url = Column(String(500), nullable=True)
    ai_confidence = Column(Float, default=0.0)
    ai_detected_category = Column(String(50), nullable=True)
    disposal_type = Column(String(50), default="BIN_DROP") # BIN_DROP, PICKUP_REQUEST
    target_bin_id = Column(Integer, ForeignKey("bins.id"), nullable=True)
    status = Column(String(50), default="SUBMITTED") # SUBMITTED, COLLECTED, VERIFIED, REWARDED
    points_awarded = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="submissions")

# 9. waste_predictions
class WastePrediction(Base):
    __tablename__ = "waste_predictions"
    id = Column(Integer, primary_key=True, index=True)
    area = Column(String(100), nullable=False)
    predicted_date = Column(DateTime, nullable=False)
    predicted_waste_kg = Column(Float, nullable=False)
    predicted_overflow_risk = Column(Float, default=0.0) # 0 to 1
    collection_priority = Column(String(50), default="NORMAL") # LOW, NORMAL, HIGH, URGENT
    model_version = Column(String(50), default="RandomForest-v1.0")
    created_at = Column(DateTime, default=datetime.utcnow)

# 10. waste_batches (Digital Plastic Passport)
class WasteBatch(Base):
    __tablename__ = "waste_batches"
    id = Column(Integer, primary_key=True, index=True)
    batch_code = Column(String(100), unique=True, index=True, nullable=False) # ECO-PET-2026-000001
    plastic_type = Column(String(50), nullable=False) # PET, HDPE, LDPE, PP, etc.
    source_location = Column(String(255), nullable=False)
    source_type = Column(String(50), default="SMART_BIN_COLLECTION") # SMART_BIN, COMMUNITY, CITIZEN_PICKUP
    initial_weight_kg = Column(Float, nullable=False)
    received_weight_kg = Column(Float, default=0.0)
    processed_weight_kg = Column(Float, default=0.0)
    rejected_weight_kg = Column(Float, default=0.0)
    status = Column(SQLEnum(BatchStatusEnum), default=BatchStatusEnum.CREATED, nullable=False, index=True)
    collector_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recycler_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    qr_code_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    events = relationship("BatchEvent", back_populates="batch", order_by="BatchEvent.timestamp")

# 11. batch_events (Immutable append-only ledger)
class BatchEvent(Base):
    __tablename__ = "batch_events"
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("waste_batches.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(SQLEnum(BatchStatusEnum), nullable=False)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_role = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    evidence_image_url = Column(String(500), nullable=True)
    recorded_weight_kg = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    batch = relationship("WasteBatch", back_populates="events")

# 12. collections
class Collection(Base):
    __tablename__ = "collections"
    id = Column(Integer, primary_key=True, index=True)
    collection_code = Column(String(50), unique=True, index=True, nullable=False)
    collector_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bin_id = Column(Integer, ForeignKey("bins.id"), nullable=True)
    pickup_request_id = Column(Integer, ForeignKey("pickup_requests.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("waste_batches.id"), nullable=True)
    status = Column(SQLEnum(CollectionStatusEnum), default=CollectionStatusEnum.PENDING, nullable=False)
    collected_weight_kg = Column(Float, default=0.0)
    evidence_photo_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# 13. pickup_requests
class PickupRequest(Base):
    __tablename__ = "pickup_requests"
    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. PICK-2026-001
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    waste_category = Column(String(50), nullable=False)
    estimated_weight_kg = Column(Float, default=1.0)
    pickup_address = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    contact_phone = Column(String(50), nullable=False)
    preferred_time_slot = Column(String(100), default="Morning (9 AM - 12 PM)")
    status = Column(SQLEnum(CollectionStatusEnum), default=CollectionStatusEnum.PENDING, nullable=False)
    assigned_collector_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id], back_populates="pickups")

# 14. collectors
class Collector(Base):
    __tablename__ = "collectors"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    employee_code = Column(String(50), unique=True, nullable=False)
    assigned_zone = Column(String(100), default="North Sector")
    current_latitude = Column(Float, default=28.6139)
    current_longitude = Column(Float, default=77.2090)
    is_available = Column(Boolean, default=True)
    total_collections = Column(Integer, default=0)

    user = relationship("User", back_populates="collector_profile")

# 15. vehicles
class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String(50), unique=True, nullable=False)
    vehicle_type = Column(String(50), default="Electric Mini Truck")
    capacity_kg = Column(Float, default=500.0)
    current_load_kg = Column(Float, default=0.0)
    assigned_collector_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="ACTIVE")

# 16. recyclers
class Recycler(Base):
    __tablename__ = "recyclers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    registration_license = Column(String(100), unique=True, nullable=False)
    facility_address = Column(String(255), nullable=False)
    latitude = Column(Float, default=28.6200)
    longitude = Column(Float, default=77.2150)
    daily_capacity_kg = Column(Float, default=2000.0)
    is_verified_by_admin = Column(Boolean, default=False)
    processed_plastic_total_kg = Column(Float, default=0.0)

    user = relationship("User", back_populates="recycler_profile")

# 17. recycling_records
class RecyclingRecord(Base):
    __tablename__ = "recycling_records"
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("waste_batches.id"), nullable=False)
    recycler_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stage_name = Column(String(100), nullable=False) # Quality Inspection, Sorting, Cleaning, Shredding, Pellets
    input_weight_kg = Column(Float, nullable=False)
    output_weight_kg = Column(Float, nullable=False)
    rejected_loss_kg = Column(Float, default=0.0)
    process_notes = Column(Text, nullable=True)
    evidence_photo = Column(String(500), nullable=True)
    stage_completed_at = Column(DateTime, default=datetime.utcnow)

# 18. material_inventory
class MaterialInventory(Base):
    __tablename__ = "material_inventory"
    id = Column(Integer, primary_key=True, index=True)
    recycler_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    material_name = Column(String(100), nullable=False) # Clean PET Flakes, Recycled HDPE Pellets
    material_grade = Column(String(50), default="Grade A - Food Contact")
    quantity_kg = Column(Float, default=0.0)
    unit_price = Column(Float, default=45.0) # Price per kg in INR/USD
    last_updated = Column(DateTime, default=datetime.utcnow)

# 19. marketplace_listings
class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    material_type = Column(String(50), nullable=False) # PET Flakes, HDPE, LDPE, PP, Glass, Paper
    quantity_available_kg = Column(Float, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    quality_grade = Column(String(50), default="Grade A")
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    is_moderated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# 20. marketplace_orders
class MarketplaceOrder(Base):
    __tablename__ = "marketplace_orders"
    id = Column(Integer, primary_key=True, index=True)
    order_code = Column(String(50), unique=True, nullable=False)
    listing_id = Column(Integer, ForeignKey("marketplace_listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="REQUESTED") # REQUESTED, APPROVED, IN_FULFILLMENT, COMPLETED, CANCELLED
    shipping_address = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# 21. rewards_wallet
class RewardsWallet(Base):
    __tablename__ = "rewards_wallet"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance_points = Column(Integer, default=0)
    lifetime_points = Column(Integer, default=0)
    tier = Column(String(50), default="Bronze EcoWarrior") # Bronze, Silver, Gold, Platinum
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="wallet")
    transactions = relationship("RewardTransaction", back_populates="wallet")

# 22. reward_transactions
class RewardTransaction(Base):
    __tablename__ = "reward_transactions"
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("rewards_wallet.id"), nullable=False, index=True)
    amount_points = Column(Integer, nullable=False)
    transaction_type = Column(String(50), nullable=False) # CREDIT, DEBIT
    reason = Column(String(255), nullable=False) # "Recycled 2.5kg PET plastic", "Redeemed Campus Cafeteria Coupon"
    reference_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    wallet = relationship("RewardsWallet", back_populates="transactions")

# 23. complaints
class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    complaint_code = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False) # Illegal dumping, Overflowing bins, Missed collection, Burning waste
    description = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String(255), nullable=True)
    status = Column(SQLEnum(ComplaintStatusEnum), default=ComplaintStatusEnum.SUBMITTED, nullable=False)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolution_image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", foreign_keys=[user_id], back_populates="complaints")

# 24. notifications
class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="INFO") # ALERT, SUCCESS, WARNING, INFO
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# 25. environmental_records
class EnvironmentalRecord(Base):
    __tablename__ = "environmental_records"
    id = Column(Integer, primary_key=True, index=True)
    period = Column(String(50), nullable=False) # "2026-M11", "2026-Q4", "2026"
    total_waste_collected_kg = Column(Float, default=0.0)
    total_plastic_recycled_kg = Column(Float, default=0.0)
    co2_saved_kg = Column(Float, default=0.0)
    trees_equivalent = Column(Float, default=0.0)
    landfill_diverted_m3 = Column(Float, default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)

# 26. prediction_results
class PredictionResult(Base):
    __tablename__ = "prediction_results"
    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String(50), nullable=False) # BIN_OVERFLOW, AREA_VOLUME, HOTSPOT
    target_id = Column(String(50), nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.85)
    model_name = Column(String(100), default="IsolationForest-OverflowDetector")
    features_used = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

# 27. audit_logs
class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

# 28. system_settings
class SystemSetting(Base):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(100), unique=True, nullable=False)
    setting_value = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
