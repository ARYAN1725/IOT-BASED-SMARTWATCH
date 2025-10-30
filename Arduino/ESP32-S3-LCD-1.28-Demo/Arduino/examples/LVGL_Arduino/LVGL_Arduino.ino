#include <lvgl.h>
#include <TFT_eSPI.h>
#include <WiFi.h>
#include <time.h>

/* Screen resolution */
static const uint16_t screenWidth = 240;
static const uint16_t screenHeight = 240;

// WiFi and NTP settings
const char* ssid = "HostelLites_2.4G";
const char* password = "Apsitboys@123";
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800; // IST offset (+5:30)
const int daylightOffset_sec = 0;

// LVGL graphics buffer
static lv_disp_draw_buf_t draw_buf;
static lv_color_t buf[screenWidth * screenHeight / 10];

TFT_eSPI tft = TFT_eSPI(screenWidth, screenHeight);

// LVGL label objects
lv_obj_t *labelTime;
lv_obj_t *labelAmPm;
lv_obj_t *labelDate;

void my_disp_flush(lv_disp_drv_t *disp_drv, const lv_area_t *area, lv_color_t *color_p) {
  uint32_t w = area->x2 - area->x1 + 1;
  uint32_t h = area->y2 - area->y1 + 1;
  tft.startWrite();
  tft.setAddrWindow(area->x1, area->y1, w, h);
  tft.pushColors((uint16_t*)color_p, w * h, true);
  tft.endWrite();
  lv_disp_flush_ready(disp_drv);
}

void setupTimeAndDateLabels() {
  labelTime = lv_label_create(lv_scr_act());
  lv_obj_set_style_text_font(labelTime, &lv_font_montserrat_16, 0);
  lv_obj_set_style_text_color(labelTime, lv_color_white(), 0);
  lv_obj_align(labelTime, LV_ALIGN_CENTER, -20, -20);

  labelAmPm = lv_label_create(lv_scr_act());
  lv_obj_set_style_text_font(labelAmPm, &lv_font_montserrat_14, 0);
  lv_obj_set_style_text_color(labelAmPm, lv_color_white(), 0);
  lv_obj_align(labelAmPm, LV_ALIGN_CENTER, 80, -20);

  labelDate = lv_label_create(lv_scr_act());
  lv_obj_set_style_text_font(labelDate, &lv_font_montserrat_14, 0);
  lv_obj_set_style_text_color(labelDate, lv_color_white(), 0);
  lv_obj_align(labelDate, LV_ALIGN_CENTER, 0, 50);
}

void updateTimeLabels() {
  time_t now;
  struct tm timeinfo;
  char timeStr[16];
  char amPmStr[4];
  char dateStr[32];

  time(&now);
  localtime_r(&now, &timeinfo);

  int hour = timeinfo.tm_hour;
  int min = timeinfo.tm_min;
  int sec = timeinfo.tm_sec;

  bool isPM = false;
  int displayHour = hour;
  if (hour == 0) displayHour = 12;
  else if (hour == 12) isPM = true;
  else if (hour > 12) {
    displayHour = hour - 12;
    isPM = true;
  }

  sprintf(timeStr, "%02d:%02d:%02d", displayHour, min, sec);
  sprintf(amPmStr, "%s", isPM ? "PM" : "AM");

  const char* weekDays[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
  sprintf(dateStr, "%s, %02d-%02d-%04d", weekDays[timeinfo.tm_wday], timeinfo.tm_mday, timeinfo.tm_mon + 1, timeinfo.tm_year + 1900);

  lv_label_set_text(labelTime, timeStr);
  lv_label_set_text(labelAmPm, amPmStr);
  lv_label_set_text(labelDate, dateStr);
}

void setup() {
  Serial.begin(115200);
  lv_init();
  tft.begin();
  tft.setRotation(0);

  lv_disp_draw_buf_init(&draw_buf, buf, NULL, screenWidth * screenHeight / 10);
  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  disp_drv.hor_res = screenWidth;
  disp_drv.ver_res = screenHeight;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected.");

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  setupTimeAndDateLabels();

  Serial.println("Setup done");
}

void loop() {
  lv_timer_handler();
  delay(100);
  updateTimeLabels();
}
