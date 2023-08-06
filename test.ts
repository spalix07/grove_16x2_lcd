GROVE_I2C_LCD1602.LCD_init(62)
GROVE_I2C_LCD1602.LCD_displayOnOff(true)
GROVE_I2C_LCD1602.LCD_clearDisplay()
GROVE_I2C_LCD1602.LCD_cursorOnOff(false)
GROVE_I2C_LCD1602.LCD_cursorBlinkOnOff(true)
for (let index = 0; index <= 10; index++) {
    GROVE_I2C_LCD1602.LCD_showString("Hello world ! ", 10 - index, 1)
    basic.pause(500)
}
GROVE_I2C_LCD1602.LCD_setCursorPosition(0, 0)
GROVE_I2C_LCD1602.LCD_ShowNumber(123456789, 0, 0)
GROVE_I2C_LCD1602.LCD_cursorBlinkOnOff(false)
