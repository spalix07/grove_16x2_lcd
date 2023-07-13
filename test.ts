GROVE_I2C_LCD1602.lcdInit(62)
GROVE_I2C_LCD1602.displayOnOff(true)
GROVE_I2C_LCD1602.clearDisplay()
GROVE_I2C_LCD1602.cursorOnOff(false)
GROVE_I2C_LCD1602.cursorBlinkOnOff(true)
for (let index = 0; index <= 10; index++) {
    GROVE_I2C_LCD1602.showString("Hello world ! ", 10 - index, 1)
    basic.pause(500)
}
GROVE_I2C_LCD1602.setCursorPosition(0, 0)
GROVE_I2C_LCD1602.ShowNumber(123456789, 0, 0)
GROVE_I2C_LCD1602.cursorBlinkOnOff(false)
