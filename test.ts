AfficheurLcd16x2.LCD_init(62)
AfficheurLcd16x2.LCD_displayOnOff(true)
AfficheurLcd16x2.LCD_clearDisplay()
AfficheurLcd16x2.LCD_cursorOnOff(false)
AfficheurLcd16x2.LCD_cursorBlinkOnOff(true)
for (let index = 0; index <= 10; index++) {
    AfficheurLcd16x2.LCD_showString("Hello world ! ", 10 - index, 1)
    basic.pause(500)
}
AfficheurLcd16x2.LCD_setCursorPosition(0, 0)
AfficheurLcd16x2.LCD_ShowNumber(123456789, 0, 0)
AfficheurLcd16x2.LCD_cursorBlinkOnOff(false)
