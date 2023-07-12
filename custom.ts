/**
* makecode I2C LCD1602 package for microbit.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

/**
 * Custom blocks
 */
//% weight=20 color=#AA0000 icon="\uf108"
namespace I2C_LCD1602 {
    let i2cAddr: number // 0x3F: PCF8574A, 0x27: PCF8574
    let BK: number      // backlight control
    let RS: number      // command/data

    // set LCD reg
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    // send data to I2C bus
    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    // send command
    function cmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    // send data
    function dat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

  

    /**
     * initial LCD, set I2C address. Address is 62 (0x3e)
     * @param Addr is i2c address for LCD, eg: 62. 
     */
    //% blockId="I2C_LCD1620_SET_ADDRESS" block="LCD initialize with Address $addr"
    //% weight=100 blockGap=8
    //% addr.defl=0x3e
    export function lcdInit(Addr: number) {
        let buf2 = Buffer.create(2)

        i2cAddr = Addr
     
        basic.pause(20) // Attente > 15ms
        // 8bits mode, 2Lines mode, 5x8 dots
        //pins.i2cWriteNumber(i2cAddr, 0x80, NumberFormat.Int8LE)
        //pins.i2cWriteNumber(i2cAddr, 0x20 | 0x10 | 0x08 | 0x00, NumberFormat.Int8LE)
        buf2 = Buffer.fromArray([0x80, 0x20 | 0x10 | 0x08 | 0x00])
        pins.i2cWriteBuffer(i2cAddr, buf2, false)
        basic.pause(1) // Attente > 39us

        // Display ON, Cursor ON, Blink OFF
        //pins.i2cWriteNumber(i2cAddr, 0x80, NumberFormat.Int8LE)
        //pins.i2cWriteNumber(i2cAddr, 0x08 | 0x04 | 0x02 | 0x00, NumberFormat.Int8LE)
        buf2 = Buffer.fromArray([0x80, 0x08 | 0x04 | 0x02 | 0x00])
        pins.i2cWriteBuffer(i2cAddr, buf2, false)
        basic.pause(1) // Attente > 39us

        // Clear
        //pins.i2cWriteNumber(i2cAddr, 0x80, NumberFormat.Int8LE)
        //pins.i2cWriteNumber(i2cAddr, 0x01, NumberFormat.Int8LE)
        buf2 = Buffer.fromArray([0x80, 0x01])
        pins.i2cWriteBuffer(i2cAddr, buf2, false)
        basic.pause(2) // Attente > 1.53ms

        // Entry left
        //pins.i2cWriteNumber(i2cAddr, 0x80, NumberFormat.Int8LE)
        //pins.i2cWriteNumber(i2cAddr, 0x04 | 0x02 | 0x00, NumberFormat.Int8LE)
        buf2 = Buffer.fromArray([0x80, 0x04 | 0x02 | 0x00])
        pins.i2cWriteBuffer(i2cAddr, buf2, false)
    }

/*
    sleep(20)  # Attente > 15ms
    self.fct = 0x10 | 0x08 | 0x00  # 8bits mode, 2Lines mode, 5x8 dots
    i2c.write(0x3e, bytearray([0x80, 0x20 | self.fct]))
    sleep(1)  # Attente > 39us
    self.ctrl = 0x04 | 0x02 | 0x00  # Display ON, Cursor ON, Blink OFF
    i2c.write(0x3e, bytearray([0x80, 0x08 | self.ctrl]))
    sleep(1)  # Attente > 39us
    self.clear()
    sleep(2)  # Attente > 1.53ms
    self.mod = 0x02 | 0x00  # Entry left
    i2c.write(0x3e, bytearray([0x80, 0x04 | self.mod]))
        # self.display(True)
*/

/*
    def write_char(self, c): i2c.write(0x3e, bytearray([0x40, c]))

    def setCursor(self, x, y):
    x = (x | 0x80) if y == 0 else (x | 0xc0)
    i2c.write(0x3e, bytearray([0x80, x]))
*/

    //% blockId="I2C_LCD1620_SET_CURSOR" block="set cursor at |x %x |y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function setCursor (x: number, y: number): void {
        let buf2 = Buffer.create(2)

        if (y==0)
            x = x | 0x80
        else
            x = x | 0xc0
        
        //ins.i2cWriteNumber(i2cAddr, 0x80, NumberFormat.Int8LE)
        //pins.i2cWriteNumber(i2cAddr, x, NumberFormat.Int8LE)
        buf2 = Buffer.fromArray([0x80, x])
        pins.i2cWriteBuffer(i2cAddr, buf2, false)

    }

   
        
   
    /**
     * show a number in LCD at given position
     * @param n is number will be show, eg: 10, 100, 200
     * @param x is LCD column position, eg: 0
     * @param y is LCD row position, eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_NUMBER" block="show number %n|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        //ShowString(s, x, y)
    }

    /**
     * show a string in LCD at given position
     * @param s is string will be show, eg: "Hello"
     * @param x is LCD column position, [0 - 15], eg: 0
     * @param y is LCD row position, [0 - 1], eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_STRING" block="show string %s"
    //% weight=90 blockGap=8
    export function showString(s: string): void {
        let buf2 = Buffer.create(2)

        for (let i = 0; i < s.length; i++) {
            // dat(s.charCodeAt(i))
            // i2c.write(0x3e, bytearray([0x40, c])
            //pins.i2cWriteNumber(i2cAddr, 0x40, NumberFormat.Int8LE)
            //pins.i2cWriteNumber(i2cAddr, s.charCodeAt(i), NumberFormat.Int8LE)
            buf2 = Buffer.fromArray([0x40, s.charCodeAt(i)])
            pins.i2cWriteBuffer(i2cAddr, buf2, false)

        }
    }

    /**
     * turn on LCD
     */
    //% blockId="I2C_LCD1620_ON" block="turn on LCD"
    //% weight=81 blockGap=8
    export function on(): void {
        cmd(0x0C)
    }

    /**
     * turn off LCD
     */
    //% blockId="I2C_LCD1620_OFF" block="turn off LCD"
    //% weight=80 blockGap=8
    export function off(): void {
        cmd(0x08)
    }

    /**
     * clear all display content
     */
    //% blockId="I2C_LCD1620_CLEAR" block="clear LCD"
    //% weight=85 blockGap=8
    export function clear(): void {
        cmd(0x01)
    }

    /**
     * turn on LCD backlight
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_ON" block="turn on backlight"
    //% weight=71 blockGap=8
    export function BacklightOn(): void {
        BK = 8
        cmd(0)
    }

    /**
     * turn off LCD backlight
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_OFF" block="turn off backlight"
    //% weight=70 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function BacklightOff(): void {
        BK = 0
        cmd(0)
    }

    /**
     * shift left
     */
    //% blockId="I2C_LCD1620_SHL" block="Shift Left"
    //% weight=61 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function shl(): void {
        cmd(0x18)
    }

    /**
     * shift right
     */
    //% blockId="I2C_LCD1620_SHR" block="Shift Right"
    //% weight=60 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function shr(): void {
        cmd(0x1C)
    }
}