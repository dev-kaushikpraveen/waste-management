import time
import json
import random
import sys
import requests

SERVER_URL = "http://localhost:8000/api/iot/telemetry"

BINS = [
    {"code": "BIN-DEL-01", "name": "Main Cafeteria Bin A", "base_fill": 82.0},
    {"code": "BIN-DEL-02", "name": "Central Library Smart Bin", "base_fill": 38.0},
    {"code": "BIN-DEL-03", "name": "Sports Complex Recycler", "base_fill": 91.0},
    {"code": "BIN-DEL-04", "name": "Engineering Block B Bin", "base_fill": 24.0},
    {"code": "BIN-DEL-05", "name": "Hostel Alpha Entrance", "base_fill": 76.0},
]

def run_simulation(cycles=5):
    print("==================================================")
    print(" EcoTrace 360 - IoT Smart Dustbin Telemetry Simulator")
    print("==================================================")
    print(f"Targeting Backend: {SERVER_URL}\n")

    for cycle in range(1, cycles + 1):
        print(f"--- [Cycle {cycle}/{cycles}] Transmitting Telemetry Packet ---")
        for b in BINS:
            # Fluctuate fill realistically
            b["base_fill"] += random.uniform(1.5, 4.5)
            if b["base_fill"] > 100.0:
                b["base_fill"] = random.uniform(15.0, 25.0) # emptied

            fill = round(b["base_fill"], 1)
            dist_cm = round(max(5.0, 100.0 - fill), 1)
            weight = round((fill / 100.0) * 50.0, 1)

            payload = {
                "device_uid": f"ESP32-{b['code']}",
                "bin_code": b["code"],
                "distance_cm": dist_cm,
                "weight_kg": weight,
                "battery_level": round(random.uniform(92.0, 98.0), 1),
                "temperature_c": round(random.uniform(24.0, 28.5), 1),
                "is_simulated": True
            }

            try:
                res = requests.post(SERVER_URL, json=payload, timeout=3)
                if res.status_code == 200:
                    status_text = res.json().get("bin_status", "ACTIVE")
                    print(f"  [OK] {b['code']} ({b['name']}): Fill: {fill}%, Wt: {weight}kg -> Status: {status_text}")
                else:
                    print(f"  [WARN] {b['code']}: HTTP {res.status_code}")
            except Exception as e:
                print(f"  [OFFLINE] Could not reach server at {SERVER_URL}: {e}")

        time.sleep(3)

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    run_simulation(count)
