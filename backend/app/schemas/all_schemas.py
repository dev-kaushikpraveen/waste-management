from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.entities import UserRoleEnum, BatchStatusEnum, CollectionStatusEnum, ComplaintStatusEnum

# Auth & User
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    full_name: str
    email: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: UserRoleEnum = UserRoleEnum.CITIZEN
    college_name: Optional[str] = "Metropolitan Urban Authority"
    hostel_name: Optional[str] = "Sector 4 Tech District"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str]
    role: UserRoleEnum
    is_active: bool
    is_verified: bool
    college_name: Optional[str]
    hostel_name: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# Bins & IoT
class BinCreate(BaseModel):
    bin_code: str
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    area: Optional[str] = "Commercial Sector"
    bin_type: Optional[str] = "Plastic & Dry Waste"
    capacity_liters: Optional[float] = 120.0
    max_weight_kg: Optional[float] = 50.0

class BinResponse(BaseModel):
    id: int
    bin_code: str
    name: str
    latitude: float
    longitude: float
    address: Optional[str]
    area: str
    bin_type: str
    capacity_liters: float
    max_weight_kg: float
    current_fill_percent: float
    current_weight_kg: float
    status: str
    last_reported_at: datetime
    class Config:
        from_attributes = True

class IoTTelemetryPayload(BaseModel):
    device_uid: str
    bin_code: str
    distance_cm: float
    weight_kg: float
    battery_level: Optional[float] = 100.0
    temperature_c: Optional[float] = 25.0
    is_simulated: Optional[bool] = False

# AI Classification
class AIClassifyRequest(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str
    confidence: float

class AIClassifyResponse(BaseModel):
    predicted_category: str
    confidence: float
    detected_objects: List[str]
    bounding_boxes: List[BoundingBox]
    disposal_recommendation: str
    recyclability_guidance: str
    model_version: str
    is_demo_mode: bool = False

# Waste Submission
class WasteSubmissionCreate(BaseModel):
    category: str
    estimated_weight_kg: float = 0.5
    image_url: Optional[str] = None
    ai_confidence: Optional[float] = 0.0
    ai_detected_category: Optional[str] = None
    disposal_type: str = "BIN_DROP" # BIN_DROP or PICKUP_REQUEST
    target_bin_id: Optional[int] = None

class WasteSubmissionResponse(BaseModel):
    id: int
    user_id: int
    category: str
    estimated_weight_kg: float
    ai_confidence: float
    disposal_type: str
    status: str
    points_awarded: int
    created_at: datetime
    class Config:
        from_attributes = True

# Digital Plastic Passport (Waste Batches)
class WasteBatchCreate(BaseModel):
    plastic_type: str # PET, HDPE, LDPE, PP, etc.
    source_location: str
    source_type: Optional[str] = "SMART_BIN_COLLECTION"
    initial_weight_kg: float

class BatchEventResponse(BaseModel):
    id: int
    status: BatchStatusEnum
    actor_id: Optional[int]
    actor_role: Optional[str]
    location: Optional[str]
    notes: Optional[str]
    evidence_image_url: Optional[str]
    recorded_weight_kg: Optional[float]
    timestamp: datetime
    class Config:
        from_attributes = True

class WasteBatchResponse(BaseModel):
    id: int
    batch_code: str
    plastic_type: str
    source_location: str
    source_type: str
    initial_weight_kg: float
    received_weight_kg: float
    processed_weight_kg: float
    rejected_weight_kg: float
    status: BatchStatusEnum
    collector_id: Optional[int]
    recycler_id: Optional[int]
    qr_code_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    events: List[BatchEventResponse] = []
    class Config:
        from_attributes = True

class BatchStatusUpdate(BaseModel):
    status: BatchStatusEnum
    notes: Optional[str] = None
    location: Optional[str] = None
    recorded_weight_kg: Optional[float] = None
    evidence_image_url: Optional[str] = None

# Collections & Pickups
class PickupRequestCreate(BaseModel):
    waste_category: str
    estimated_weight_kg: float
    pickup_address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_phone: str
    preferred_time_slot: Optional[str] = "Morning (9 AM - 12 PM)"

class PickupRequestResponse(BaseModel):
    id: int
    request_code: str
    user_id: int
    waste_category: str
    estimated_weight_kg: float
    pickup_address: str
    contact_phone: str
    preferred_time_slot: str
    status: CollectionStatusEnum
    assigned_collector_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

# Recycler Processing
class RecyclingStageRecordCreate(BaseModel):
    batch_id: int
    stage_name: str # Quality Inspection, Sorting, Cleaning, Shredding, Pellets
    input_weight_kg: float
    output_weight_kg: float
    rejected_loss_kg: float = 0.0
    process_notes: Optional[str] = None
    evidence_photo: Optional[str] = None

# Rewards & Wallet
class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance_points: int
    lifetime_points: int
    tier: str
    class Config:
        from_attributes = True

class RewardTransactionResponse(BaseModel):
    id: int
    amount_points: int
    transaction_type: str
    reason: str
    created_at: datetime
    class Config:
        from_attributes = True

class LeaderboardUser(BaseModel):
    rank: int
    user_name: str
    college_name: Optional[str]
    hostel_name: Optional[str]
    total_points: int
    total_waste_kg: float

# Marketplace
class MarketplaceListingCreate(BaseModel):
    title: str
    material_type: str
    quantity_available_kg: float
    price_per_kg: float
    quality_grade: str = "Grade A"
    location: str
    description: Optional[str] = None

class MarketplaceListingResponse(BaseModel):
    id: int
    seller_id: int
    title: str
    material_type: str
    quantity_available_kg: float
    price_per_kg: float
    quality_grade: str
    location: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class MarketplaceOrderCreate(BaseModel):
    listing_id: int
    quantity_kg: float
    shipping_address: str

class MarketplaceOrderResponse(BaseModel):
    id: int
    order_code: str
    listing_id: int
    buyer_id: int
    quantity_kg: float
    total_amount: float
    status: str
    shipping_address: str
    created_at: datetime
    class Config:
        from_attributes = True

# Complaints
class ComplaintCreate(BaseModel):
    category: str # Illegal dumping, Overflowing bins, Missed collection, Burning waste
    description: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: int
    complaint_code: str
    user_id: int
    category: str
    description: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    image_url: Optional[str]
    status: ComplaintStatusEnum
    resolution_notes: Optional[str]
    resolution_image_url: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]
    class Config:
        from_attributes = True

# Environmental & Analytics
class EnvironmentalImpactSummary(BaseModel):
    total_waste_collected_kg: float
    total_plastic_recycled_kg: float
    co2_saved_kg: float
    trees_equivalent: float
    landfill_diverted_m3: float
    active_smart_bins: int
    verified_recycling_rate_percent: float

class WastePredictionResponse(BaseModel):
    area: str
    predicted_date: str
    predicted_waste_kg: float
    predicted_overflow_risk: float
    collection_priority: str
    model_version: str
