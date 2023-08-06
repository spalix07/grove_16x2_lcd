Afficheur_LCD16x2.LCD_init(62)
Afficheur_LCD16x2.LCD_displayOnOff(true)
Afficheur_LCD16x2.LCD_clearDisplay()
Afficheur_LCD16x2.LCD_cursorOnOff(false)
Afficheur_LCD16x2.LCD_cursorBlinkOnOff(true)
for (let index = 0; index <= 10; index++) {
    Afficheur_LCD16x2.LCD_showString("Hello world ! ", 10 - index, 1)
    basic.pause(500)
}
Afficheur_LCD16x2.LCD_setCursorPosition(0, 0)
Afficheur_LCD16x2.LCD_ShowNumber(123456789, 0, 0)
Afficheur_LCD16x2.LCD_cursorBlinkOnOff(false)
