import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any
from sklearn.ensemble import RandomForestRegressor, IsolationForest

class AIWastePredictor:
    """
    ML Prediction Service using Random Forest and Isolation Forest
    Forecasts waste accumulation, bin overflow probabilities, and detects suspicious patterns.
    """
    def __init__(self):
        self.model_version = "RandomForest-v1.4-EcoPredict"
        self._train_baseline_models()

    def _train_baseline_models(self):
        # Synthetic historical training dataset:
        # Features: [day_of_week (0-6), hour (0-23), previous_fill_percent, area_density_index]
        np.random.seed(42)
        X = []
        y_volume = []
        for _ in range(1000):
            day = np.random.randint(0, 7)
            hour = np.random.randint(6, 22)
            prev_fill = np.random.uniform(10, 80)
            density = np.random.choice([1.0, 1.5, 2.0]) # low, med, high campus areas
            
            # Target waste added (kg)
            peak_multiplier = 1.8 if hour in [12, 13, 14, 19, 20] else 1.0
            weekend_multiplier = 1.3 if day in [5, 6] else 1.0
            added = (np.random.uniform(1, 5) * peak_multiplier * weekend_multiplier * density)
            
            X.append([day, hour, prev_fill, density])
            y_volume.append(added)

        X = np.array(X)
        y_volume = np.array(y_volume)

        self.regressor = RandomForestRegressor(n_estimators=50, random_state=42)
        self.regressor.fit(X, y_volume)

        # Anomaly Detector for fraudulent weight / fake point generation
        self.anomaly_detector = IsolationForest(contamination=0.03, random_state=42)
        # Normal submissions are between 0.1kg and 15kg
        weights = np.random.exponential(scale=2.5, size=(500, 1))
        self.anomaly_detector.fit(weights)

    def forecast_area_waste(self, area: str, days_ahead: int = 5) -> List[Dict[str, Any]]:
        """Forecast daily waste generation for an area over the next N days"""
        predictions = []
        now = datetime.utcnow()
        density_map = {
            "Commercial Sector": 2.0,
            "Civic Center": 2.5,
            "Tech Corridor": 1.5,
            "Transit Zone": 2.2,
            "Residential Sector": 1.8
        }
        density = density_map.get(area, 1.5)

        for i in range(days_ahead):
            target_date = now + timedelta(days=i + 1)
            day_of_week = target_date.weekday()
            # Predict for 3 main periods: morning, afternoon, evening
            day_total = 0.0
            for hr in [10, 14, 19]:
                pred = self.regressor.predict([[day_of_week, hr, 45.0, density]])[0]
                day_total += pred * 6.5 # scale for urban district

            overflow_risk = min(0.98, max(0.12, (day_total - 40) / 60))
            priority = "URGENT" if overflow_risk > 0.8 else ("HIGH" if overflow_risk > 0.6 else "NORMAL")

            predictions.append({
                "area": area,
                "predicted_date": target_date.strftime("%Y-%m-%d"),
                "predicted_waste_kg": round(float(day_total), 1),
                "predicted_overflow_risk": round(float(overflow_risk), 2),
                "collection_priority": priority,
                "model_version": self.model_version
            })

        return predictions

    def detect_suspicious_submission(self, weight_kg: float) -> bool:
        """Returns True if submission weight looks anomalous/suspicious (e.g. 150kg single citizen drop)"""
        if weight_kg > 50.0 or weight_kg <= 0:
            return True
        pred = self.anomaly_detector.predict([[weight_kg]])
        return bool(pred[0] == -1)

ai_predictor = AIWastePredictor()
