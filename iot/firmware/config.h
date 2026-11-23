#ifndef CONFIG_H
#define CONFIG_H

// Wi-Fi Credentials
#define WIFI_SSID "Campus-IoT-Network"
#define WIFI_PASS "EcoTrace2026Secure"

// MQTT Broker Details
#define MQTT_BROKER "192.168.1.100" // Replace with server host/domain
#define MQTT_PORT 1883
#define MQTT_USER "ecotrace_bin"
#define MQTT_PASS "iot_telemetry_token"

// Device Identity
#define BIN_CODE "BIN-DEL-01"
#define DEVICE_UID "ESP32-BIN-DEL-01"

// Pin Definitions
#define PIN_TRIG 5       // HC-SR04 Trigger
#define PIN_ECHO 18      // HC-SR04 Echo
#define PIN_HX711_DOUT 21 // HX711 Data
#define PIN_HX711_SCK 22  // HX711 Clock
#define PIN_LED_ALERT 2   // Onboard Alert LED

// Bin Physical Parameters
#define BIN_HEIGHT_CM 100.0 // 100 cm height = 0% fill when empty
#define MIN_DISTANCE_CM 10.0 // 10 cm from sensor = 90% full

// MQTT Topics
#define TOPIC_TELEMETRY "ecotrace/bins/" BIN_CODE "/telemetry"
#define TOPIC_STATUS "ecotrace/bins/" BIN_CODE "/status"
#define TOPIC_ALERTS "ecotrace/bins/" BIN_CODE "/alerts"

#endif
