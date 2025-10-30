#include <Arduino.h>
#include <WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <lvgl.h>
#include <TFT_eSPI.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "MAX30105.h"
#include "heartRate.h"

#define SCREEN_WIDTH  240
#define SCREEN_HEIGHT 240
#define QMI8658_ADDR 0x6B

const char* ssid     = "HostelLites_2.4G";
const char* password = "Apsitboys@123";

#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

TFT_eSPI tft = TFT_eSPI(SCREEN_WIDTH, SCREEN_HEIGHT);
static lv_disp_draw_buf_t draw_buf;
static lv_color_t buf[SCREEN_WIDTH * 20];

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800, 60000);

lv_obj_t *clockLabel;
lv_obj_t *dateLabel;
lv_obj_t *stepLabel;
lv_obj_t *heartLabel;
lv_obj_t *spo2Label;

enum DisplayMode { SHOW_TIME, SHOW_STEPS, SHOW_HEART, SHOW_SPO2 };
DisplayMode displayMode = SHOW_TIME;
unsigned long lastSwitchTime = 0;
const unsigned long switchInterval = 4000; // 4 seconds

BLEServer* pServer = nullptr;
BLECharacteristic* pCharacteristic = nullptr;

// ---- MAX30102 ----
MAX30105 particleSensor;
float beatsPerMinute = 0;
int beatAvg = 0;
unsigned long lastBeat = 0;

// ------------------ SIMULATION MODE (for demo when sensors not responding) ------------------
bool SIMULATION_MODE = true; // <-- set to false when real sensors work

unsigned long lastSimUpdate = 0;
const unsigned long simInterval = 800; // update every 0.8 sec

int simSteps = 0;
int simHeart = 72;
int simSpo2 = 98;
bool heartUp = true; // oscillation for heart rate
bool spo2Up = true;

// Function to simulate fake sensor values
void simulateReadings() {
  if (millis() - lastSimUpdate >= simInterval) {
    lastSimUpdate = millis();

    simSteps += 1; // step counter increases gradually

    // oscillate heart rate between 70–95 bpm
    if (heartUp) simHeart++;
    else simHeart--;
    if (simHeart >= 95 || simHeart <= 70) heartUp = !heartUp;

    // oscillate SpO2 between 96–99%
    if (spo2Up) simSpo2++;
    else simSpo2--;
    if (simSpo2 >= 99 || simSpo2 <= 96) spo2Up = !spo2Up;
  }
}

// ---- I2C Functions ----
void i2cWriteByte(uint8_t reg, uint8_t data) {
  Wire.beginTransmission(QMI8658_ADDR);
  Wire.write(reg);
  Wire.write(data);
  Wire.endTransmission();
}

uint8_t i2cReadByte(uint8_t reg) {
  Wire.beginTransmission(QMI8658_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)QMI8658_ADDR, (uint8_t)1);
  if (Wire.available()) return Wire.read();
  return 0xFF;
}

uint8_t readWhoAmI() { return i2cReadByte(0x0D); }

void qmi8658Init() {
  i2cWriteByte(0x14, 0xB6);
  delay(100);
  i2cWriteByte(0x20, 0x07);
  i2cWriteByte(0x21, 0x05);
  i2cWriteByte(0x22, 0x00);
  i2cWriteByte(0x08, 0x01);
  i2cWriteByte(0x34, 0x02);
  i2cWriteByte(0x53, 0x01);
}

void resetStepCounter() { i2cWriteByte(0x08, 0x01); }

uint16_t readStepCount() {
  uint8_t low = i2cReadByte(0x0E);
  uint8_t high = i2cReadByte(0x0F);
  return (high << 8) | low;
}

// ---- LVGL Flush ----
void my_disp_flush(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p) {
  uint32_t w = area->x2 - area->x1 + 1;
  uint32_t h = area->y2 - area->y1 + 1;
  tft.startWrite();
  tft.setAddrWindow(area->x1, area->y1, w, h);
  tft.pushColors((uint16_t*)&color_p->full, w * h, true);
  tft.endWrite();
  lv_disp_flush_ready(disp);
}

// ---- Background ----
void draw_background_pattern() {
  tft.fillScreen(tft.color565(0, 51, 102));
  for (int y = 0; y < SCREEN_HEIGHT; y += 10) {
    uint8_t shade = 20 + (y % 40);
    tft.drawFastHLine(0, y, SCREEN_WIDTH, tft.color565(0, shade, 150));
  }
  for (int x = 0; x < SCREEN_WIDTH; x += 10) {
    uint8_t shade = 20 + (x % 40);
    tft.drawFastVLine(x, 0, SCREEN_HEIGHT, tft.color565(0, shade, 150));
  }
}

// ---- BLE ----
void setupBLE() {
  BLEDevice::init("Smartwatch");
  pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  BLEDevice::getAdvertising()->start();
  Serial.println("BLE Started Advertising");
}

void sendBLEData(const char* data) {
  if (pCharacteristic != nullptr) {
    pCharacteristic->setValue(data);
    pCharacteristic->notify();
  }
}

// ---- MAX30102 Setup ----
void initMAX30102() {
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("MAX30102 not found!");
    return;
  }
  Serial.println("MAX30102 initialized.");
  particleSensor.setup(); // default setup
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

// ---- Heart Rate Calculation ----
int readHeartRate() {
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue)) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);
    if (beatsPerMinute > 20 && beatsPerMinute < 250) {
      beatAvg = (beatAvg * 0.9) + (beatsPerMinute * 0.1);
    }
  }

  return (int)beatAvg;
}

// ---- Setup ----
void setup() {
  Serial.begin(115200);
  Wire.begin(6, 7);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(" connected");

  timeClient.begin();
  timeClient.update();

  tft.begin();
  tft.setRotation(0);
  draw_background_pattern();

  lv_init();
  lv_disp_draw_buf_init(&draw_buf, buf, NULL, SCREEN_WIDTH * 20);
  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  disp_drv.hor_res = SCREEN_WIDTH;
  disp_drv.ver_res = SCREEN_HEIGHT;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  lv_obj_t *scr = lv_scr_act();
  lv_obj_set_style_bg_color(scr, lv_color_make(0, 0, 0), 0);

  clockLabel = lv_label_create(scr);
  lv_obj_set_style_text_font(clockLabel, &lv_font_montserrat_16, 0);
  lv_obj_set_style_text_color(clockLabel, lv_color_white(), 0);
  lv_obj_align(clockLabel, LV_ALIGN_CENTER, 0, -30);

  dateLabel = lv_label_create(scr);
  lv_obj_set_style_text_font(dateLabel, &lv_font_montserrat_14, 0);
  lv_obj_align(dateLabel, LV_ALIGN_CENTER, 0, 0);

  stepLabel = lv_label_create(scr);
  lv_obj_set_style_text_font(stepLabel, &lv_font_montserrat_16, 0);
  lv_obj_align(stepLabel, LV_ALIGN_CENTER, 0, 0);
  lv_obj_add_flag(stepLabel, LV_OBJ_FLAG_HIDDEN);

  heartLabel = lv_label_create(scr);
  lv_obj_set_style_text_font(heartLabel, &lv_font_montserrat_16, 0);
  lv_obj_align(heartLabel, LV_ALIGN_CENTER, 0, 0);
  lv_obj_add_flag(heartLabel, LV_OBJ_FLAG_HIDDEN);

  spo2Label = lv_label_create(scr);
  lv_obj_set_style_text_font(spo2Label, &lv_font_montserrat_16, 0);
  lv_obj_align(spo2Label, LV_ALIGN_CENTER, 0, 0);
  lv_obj_add_flag(spo2Label, LV_OBJ_FLAG_HIDDEN);

  Serial.print("WHO_AM_I: 0x");
  Serial.println(readWhoAmI(), HEX);
  qmi8658Init();
  initMAX30102();
  setupBLE();

  displayMode = SHOW_TIME;
}

// ---- Loop ----
void loop() {
  lv_timer_handler();
  unsigned long currentMillis = millis();

  // Rotate every interval (4 sec)
  if (currentMillis - lastSwitchTime >= switchInterval) {
    lastSwitchTime = currentMillis;
    draw_background_pattern();

    if (displayMode == SHOW_TIME) {
      displayMode = SHOW_STEPS;
      resetStepCounter();
      lv_obj_add_flag(clockLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_add_flag(dateLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_clear_flag(stepLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_add_flag(heartLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_add_flag(spo2Label, LV_OBJ_FLAG_HIDDEN);
    }
    else if (displayMode == SHOW_STEPS) {
      displayMode = SHOW_HEART;
      lv_obj_add_flag(stepLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_clear_flag(heartLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_add_flag(spo2Label, LV_OBJ_FLAG_HIDDEN);
    }
    else if (displayMode == SHOW_HEART) {
      displayMode = SHOW_SPO2;
      lv_obj_add_flag(heartLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_clear_flag(spo2Label, LV_OBJ_FLAG_HIDDEN);
    }
    else {
      displayMode = SHOW_TIME;
      lv_obj_clear_flag(clockLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_clear_flag(dateLabel, LV_OBJ_FLAG_HIDDEN);
      lv_obj_add_flag(spo2Label, LV_OBJ_FLAG_HIDDEN);
    }
  }

  // ---- SIMULATION LOGIC ----
  if (SIMULATION_MODE) simulateReadings();

  // --- Display Data ---
  if (displayMode == SHOW_TIME) {
    timeClient.update();
    unsigned long epochTime = timeClient.getEpochTime();
    struct tm *ptm = gmtime((time_t *)&epochTime);
    char timeBuf[9], dateBuf[15];
    sprintf(timeBuf, "%02d:%02d:%02d", ptm->tm_hour, ptm->tm_min, ptm->tm_sec);
    sprintf(dateBuf, "%02d-%02d-%04d", ptm->tm_mday, ptm->tm_mon + 1, ptm->tm_year + 1900);
    lv_label_set_text(clockLabel, timeBuf);
    lv_label_set_text(dateLabel, dateBuf);
    char bleData[64];
    snprintf(bleData, sizeof(bleData), "{\"time\":\"%s\",\"date\":\"%s\"}", timeBuf, dateBuf);
    sendBLEData(bleData);

  } else if (displayMode == SHOW_STEPS) {
    uint16_t steps;
    if (SIMULATION_MODE) steps = simSteps;
    else steps = readStepCount();

    char str[20];
    sprintf(str, "Steps: %d", steps);
    lv_label_set_text(stepLabel, str);
    char bleStep[40];
    snprintf(bleStep, sizeof(bleStep), "{\"steps\":%d}", steps);
    sendBLEData(bleStep);

  } else if (displayMode == SHOW_HEART) {
    int bpm;
    if (SIMULATION_MODE) bpm = simHeart;
    else bpm = readHeartRate();

    char hrStr[25];
    sprintf(hrStr, "Heart: %d bpm", bpm);
    lv_label_set_text(heartLabel, hrStr);
    char bleHR[40];
    snprintf(bleHR, sizeof(bleHR), "{\"heart\":%d}", bpm);
    sendBLEData(bleHR);

  } else if (displayMode == SHOW_SPO2) {
    int spo2;
    if (SIMULATION_MODE) spo2 = simSpo2;
    else spo2 = 98; // placeholder until real SPO2 logic added

    char spStr[25];
    sprintf(spStr, "SpO₂: %d%%", spo2);
    lv_label_set_text(spo2Label, spStr);
    char bleSp[40];
    snprintf(bleSp, sizeof(bleSp), "{\"spo2\":%d}", spo2);
    sendBLEData(bleSp);
  }

  delay(100);
}
