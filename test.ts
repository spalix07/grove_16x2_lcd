// les tests vont ici ; cela ne sera pas compilé si ce paquet est utilisé en tant qu'extension.
I2C_LCD1602.lcdInit(62)
I2C_LCD1602.setCursor(0, 0)
I2C_LCD1602.showString("Hello")
basic.forever(function () {

})