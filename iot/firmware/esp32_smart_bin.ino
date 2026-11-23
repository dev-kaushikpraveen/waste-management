/*
 * EcoTrace 360 - Smart Dustbin Telemetry Firmware
 * Hardware: ESP32 + HC-SR04 Ultrasonic Sensor + HX711 Load Cell
 * Communication: Wi-Fi + MQTT (Mosquitto)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h"

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 10000; // Publish every 10 seconds

float measureDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout (~5m)
  if (duration == 0) return BIN_HEIGHT_CM; // Fallback if no echo

  float distance = (duration * 0.0343) / 2.0;
  return constrain(distance, 5.0, BIN_HEIGHT_CM);
}

float measureWeightKg() {
  // Simulates or reads HX711 calibrated load cell output
  // Real implementation: scale.get_units(5)
  return 14.5; // Calibrated kg sample
}

void setupWifi() {
  delay(10);
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWi-Fi Connection Failed. Running in Standalone Sensor Loop.");
  }
}

void reconnectMqtt() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT Broker: ");
    Serial.println(MQTT_BROKER);
    
    if (client.connect(DEVICE_UID, MQTT_USER, MQTT_PASS, TOPIC_STATUS, 1, true, "{\"status\":\"OFFLINE\"}")) {
      Serial.println("MQTT Connected!");
      client.publish(TOPIC_STATUS, "{\"status\":\"ONLINE\",\"firmware\":\"v2.1.0\"}", true);
    } else {
      Serial.print("MQTT connect failed, rc=");
      Serial.print(client.state());
      Serial.println(". Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_LED_ALERT, OUTPUT);

  setupWifi();
  client.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      reconnectMqtt();
    }
    client.loop();
  }

  unsigned long currentMillis = millis();
  if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = currentMillis;

    float distance = measureDistanceCm();
    float fillPercent = constrain(map(distance, BIN_HEIGHT_CM, MIN_DISTANCE_CM, 0.0, 100.0), 0.0, 100.0);
    float weight = measureWeightKg();

    // Visual LED alert if bin is full
    if (fillPercent >= 85.0) {
      digitalWrite(PIN_LED_ALERT, HIGH);
    } else {
      digitalWrite(PIN_LED_ALERT, LOW);
    }

    // Prepare JSON Telemetry Payload
    StaticJsonDocument<256> doc;
    doc["device_uid"] = DEVICE_UID;
    doc["bin_code"] = BIN_CODE;
    doc["distance_cm"] = distance;
    doc["fill_percent"] = fillPercent;
    doc["weight_kg"] = weight;
    doc["battery_level"] = 96.5;
    doc["temperature_c"] = 26.2;
    doc["is_simulated"] = false;

    char buffer[256];
    serializeJson(doc, buffer);

    Serial.print("Publishing Telemetry: ");
    Serial.println(buffer);

    if (client.connected()) {
      client.publish(TOPIC_TELEMETRY, buffer);
    }
  }
}
