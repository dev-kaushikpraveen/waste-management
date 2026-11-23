import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "EcoTrace 360"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ecotrace360-super-secret-jwt-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database: Default to local SQLite for instant out-of-the-box local operation, or Postgres if set
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ecotrace360.db")
    
    # MQTT Configuration
    MQTT_BROKER: str = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))
    MQTT_USER: str = os.getenv("MQTT_USER", "ecotrace")
    MQTT_PASSWORD: str = os.getenv("MQTT_PASSWORD", "ecotrace_secret")
    
    # Environmental Impact Multipliers (kg CO2 saved per kg recycled)
    CO2_SAVED_PER_KG_PET: float = 2.1
    CO2_SAVED_PER_KG_HDPE: float = 1.9
    CO2_SAVED_PER_KG_PAPER: float = 1.3
    CO2_SAVED_PER_KG_METAL: float = 4.2
    CO2_SAVED_PER_KG_GLASS: float = 0.5
    
    # Points reward conversion (points per kg)
    POINTS_PER_KG_PLASTIC: int = 20
    POINTS_PER_KG_METAL: int = 30
    POINTS_PER_KG_PAPER: int = 10
    POINTS_PER_KG_GLASS: int = 5

settings = Settings()
