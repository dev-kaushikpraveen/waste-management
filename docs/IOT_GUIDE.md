# EcoTrace 360 - IoT Smart Dustbin Guide

## 1. Physical Hardware Overview

The EcoTrace 360 Smart Dustbin node integrates edge sensing and wireless telemetry:
- **Microcontroller**: ESP32 DevKit (32-bit dual-core, 240MHz, 2.4GHz Wi-Fi).
- **Level Sensing**: HC-SR04 ultrasonic distance transducer mounted downward in the lid.
- **Weight Sensing**: 50kg aluminum strain-gauge load cell connected to an HX711 24-bit differential ADC amplifier.
- **Visual Alert**: Red LED on GPIO 2 illuminated when fill level exceeds 85%.

---

## 2. MQTT Architecture & Topic Hierarchy

| Topic | Direction | QoS | Retain | Payload Example |
| :--- | :---: | :---: | :---: | :--- |
| `ecotrace/bins/{bin_code}/telemetry` | Publish | 1 | False | `{"distance_cm":18.2,"fill_percent":81.8,"weight_kg":34.2}` |
| `ecotrace/bins/{bin_code}/status` | Publish | 1 | True | `{"status":"ONLINE","firmware":"v2.1.0"}` |
| `ecotrace/bins/{bin_code}/alerts` | Publish | 2 | False | `{"alert":"OVERFLOW_DETECTED","fill_percent":94.0}` |

---

## 3. Sensor Firmware Flashing (Arduino IDE / PlatformIO)

1. Open `iot/firmware/esp32_smart_bin.ino` in Arduino IDE.
2. Install dependencies via Library Manager:
   - `PubSubClient` by Nick O'Leary
   - `ArduinoJson` by Benoit Blanchon (v6.x)
3. Edit `iot/firmware/config.h`:
   - Set `WIFI_SSID` and `WIFI_PASS`.
   - Set `MQTT_BROKER` to your server IP.
4. Select Board: **ESP32 Dev Module**.
5. Upload firmware over USB.

---

## 4. Running the Python IoT Simulator

When hardware is not available, execute the automated telemetry simulator:

```bash
# Inside workspace:
./venv/bin/python3 iot/simulation/mqtt_bin_simulator.py 5
```
This transmits 5 consecutive cycles of realistic telemetry across all campus bins, triggering real-time WebSocket map updates on the frontend.
