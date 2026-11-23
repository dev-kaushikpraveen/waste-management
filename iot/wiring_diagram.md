# ESP32 Smart Dustbin Wiring & Hardware Guide

This document details the circuit schematic and wiring connections for the **EcoTrace 360** IoT Smart Dustbin node.

---

## 1. Bill of Materials (BOM)

| Component | Quantity | Purpose | Operating Voltage |
| :--- | :---: | :--- | :--- |
| **ESP32 DevKit V1** (30 or 38 pins) | 1 | Microcontroller & Wi-Fi/MQTT Gateway | 3.3V Logic / 5V USB |
| **HC-SR04** Ultrasonic Sensor | 1 | Distance / Level Measurement in Bin Lid | 5V VCC |
| **HX711** ADC Amplifier Module | 1 | 24-bit Precision Load Cell Interface | 2.6V - 5.5V |
| **Single-Point Load Cell** (50kg) | 1 | Weight Measurement at Bin Base | Analog Strain Gauge |
| **Voltage Divider Resistors** (1kΩ, 2kΩ) | 2 | Level shifting HC-SR04 ECHO (5V $\rightarrow$ 3.3V) | Passive |
| **Diffused Red 5mm LED** | 1 | Physical Bin Overflow Indicator | 2.0V forward |
| **220Ω Resistor** | 1 | Current limiting for alert LED | Passive |
| **18650 Li-ion Battery & TP4056 Module** | 1 | Autonomous Rechargeable Power Supply | 3.7V - 4.2V |

---

## 2. GPIO Pinout Mapping

```
                 +-------------------+
                 |    ESP32 Node     |
                 +-------------------+
                         |
      +------------------+------------------+
      |                  |                  |
[HC-SR04 Sensor]   [HX711 Load Cell]   [Status LED]
  VCC -> 5V (VIN)     VCC -> 3.3V / 5V    Anode -> GPIO 2 (220Ω)
  GND -> GND          GND -> GND          Cathode -> GND
  TRIG -> GPIO 5      DOUT -> GPIO 21
  ECHO -> Resistor    SCK  -> GPIO 22
          Divider
          -> GPIO 18
```

### Pin Table

| Sensor Wire | Sensor Pin | ESP32 GPIO | Notes |
| :--- | :--- | :--- | :--- |
| HC-SR04 | VCC | `VIN (5V)` | Needs 5V power supply |
| HC-SR04 | GND | `GND` | Common Ground |
| HC-SR04 | TRIG | `GPIO 5` | Ultrasonic trigger pulse (10µs) |
| HC-SR04 | ECHO | `GPIO 18` | Voltage divider: 1kΩ in series + 2kΩ to GND |
| HX711 | VCC | `3V3` | Regulated 3.3V logic supply |
| HX711 | GND | `GND` | Common Ground |
| HX711 | DT / DOUT | `GPIO 21` | Serial data out |
| HX711 | SCK | `GPIO 22` | Clock pulse |
| Alert LED | Anode (+) | `GPIO 2` | Through 220Ω resistor |
| Alert LED | Cathode (-) | `GND` | Ground |

---

## 3. HC-SR04 Echo Level Shifter

HC-SR04 echo pin outputs a 5V digital signal. Since ESP32 GPIOs tolerate maximum 3.6V, a voltage divider is required:

```
HC-SR04 ECHO Pin (5V)
       │
      [1kΩ]
       │
       ├───> Connected to ESP32 GPIO 18 (3.33V Safe Logic High)
       │
      [2kΩ]
       │
      GND
```

---

## 4. Calibration Instructions

1. **Ultrasonic Calibration**:
   - Mount sensor facing downward from the bin lid.
   - Set `BIN_HEIGHT_CM` in `config.h` to the exact distance from sensor to empty bin bottom (standard: 100 cm).
   - $Fill\% = \frac{BIN\_HEIGHT - MeasuredDistance}{BIN\_HEIGHT - MIN\_DISTANCE} \times 100$

2. **Load Cell Calibration**:
   - Place empty inner bucket on load cell assembly and tare to 0.
   - Place a known 5 kg weight calibration mass.
   - Adjust `calibration_factor = reading / 5.0`.
