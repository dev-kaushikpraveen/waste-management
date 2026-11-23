import math
from typing import List, Dict, Any

class RouteOptimizer:
    """
    Distance-based TSP / Nearest Neighbor route optimization for waste collection vehicles
    """
    @staticmethod
    def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        # Haversine formula
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 3)

    @classmethod
    def optimize_route(cls, start_lat: float, start_lon: float, stops: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Solves collection route using nearest-neighbor greedy algorithm.
        Stops prioritized by fill percentage and distance.
        """
        if not stops:
            return {"ordered_stops": [], "total_distance_km": 0.0, "estimated_duration_mins": 0}

        unvisited = list(stops)
        ordered_route = []
        current_lat, current_lon = start_lat, start_lon
        total_distance = 0.0

        while unvisited:
            # Score each stop: lower distance + bonus for high fill % (>75%)
            best_idx = 0
            best_score = float("inf")
            best_dist = 0.0

            for idx, stop in enumerate(unvisited):
                dist = cls.calculate_distance_km(current_lat, current_lon, stop["latitude"], stop["longitude"])
                fill = stop.get("current_fill_percent", 50.0)
                # Urgency multiplier: high fill reduces effective distance score to prioritize it
                urgency_factor = 0.6 if fill >= 80 else (0.8 if fill >= 60 else 1.0)
                score = dist * urgency_factor
                
                if score < best_score:
                    best_score = score
                    best_idx = idx
                    best_dist = dist

            chosen_stop = unvisited.pop(best_idx)
            total_distance += best_dist
            current_lat = chosen_stop["latitude"]
            current_lon = chosen_stop["longitude"]
            ordered_route.append({
                **chosen_stop,
                "leg_distance_km": round(best_dist, 2),
                "cumulative_distance_km": round(total_distance, 2)
            })

        # Est duration: average speed 25 km/h in campus/city + 6 mins per collection stop
        est_drive_mins = (total_distance / 25.0) * 60
        est_service_mins = len(stops) * 6.0
        total_duration = round(est_drive_mins + est_service_mins)

        return {
            "ordered_stops": ordered_route,
            "total_distance_km": round(total_distance, 2),
            "estimated_duration_mins": total_duration,
            "stops_count": len(ordered_route)
        }

route_optimizer = RouteOptimizer()
