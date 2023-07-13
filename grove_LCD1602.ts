// Ajouter votre code ici
namespace smbus {
    export function writeByte(addr: number, register: number, value: number): void {
        let temp = pins.createBuffer(2);
        temp[0] = register;
        temp[1] = value;
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function writeBuffer(addr: number, register: number, value: Buffer): void {
        let temp = pins.createBuffer(value.length + 1);
        temp[0] = register;
        for (let x = 0; x < value.length; x++) {
            temp[x + 1] = value[x];
        }
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function readBuffer(addr: number, register: number, len: number): Buffer {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadBuffer(addr, len, false);
    }
    function readNumber(addr: number, register: number, fmt: NumberFormat = NumberFormat.UInt8LE): number {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadNumber(addr, fmt, false);
    }
    export function unpack(fmt: string, buf: Buffer): number[] {
        let le: boolean = true;
        let offset: number = 0;
        let result: number[] = [];
        let num_format: NumberFormat = 0;
        for (let c = 0; c < fmt.length; c++) {
            switch (fmt.charAt(c)) {
                case '<':
                    le = true;
                    continue;
                case '>':
                    le = false;
                    continue;
                case 'c':
                case 'B':
                    num_format = le ? NumberFormat.UInt8LE : NumberFormat.UInt8BE; break;
                case 'b':
                    num_format = le ? NumberFormat.Int8LE : NumberFormat.Int8BE; break;
                case 'H':
                    num_format = le ? NumberFormat.UInt16LE : NumberFormat.UInt16BE; break;
                case 'h':
                    num_format = le ? NumberFormat.Int16LE : NumberFormat.Int16BE; break;
            }
            result.push(buf.getNumber(num_format, offset));
            offset += pins.sizeOf(num_format);
        }
        return result;
    }
}


/**
 * Custom blocks
 */
//% weight=20 color=#AA00AA icon="\uf108"
namespace GROVE_I2C_LCD1602 {
    let i2cAddr: number // 0x3E par défaut

    /**
     * initial LCD, set I2C address : Address is 62 (0x3e)
     * @param Addr is i2c address for LCD, eg: 62. 
     */
    //% blockId="GROVE_I2C_LCD1620_SET_ADDRESS" block="[Grove] LCD initialize with Address $Addr"
    //% weight=100 blockGap=8
    //% addr.defl=0x3e
    export function lcdInit(Addr: number) {
        let buf2 = Buffer.create(2)

        i2cAddr = Addr

        basic.pause(20) // Attente > 15ms
        // 8bits mode, 2Lines mode, 5x8 dots
        //buf2 = Buffer.fromArray([0x80, 0x20 | 0x10 | 0x08 | 0x00])
        //pins.i2cWriteBuffer(i2cAddr, buf2, false)
        smbus.writeByte(i2cAddr, 0x80, 0x20 | 0x10 | 0x08 | 0x00)
        basic.pause(1) // Attente > 39us

        // Display ON, Cursor ON, Blink OFF
        //buf2 = Buffer.fromArray([0x80, 0x08 | 0x04 | 0x02 | 0x00])
        //pins.i2cWriteBuffer(i2cAddr, buf2, false)
        smbus.writeByte(i2cAddr, 0x80, 0x08 | 0x04 | 0x02 | 0x00)
        basic.pause(1) // Attente > 39us

        // Clear
        //buf2 = Buffer.fromArray([0x80, 0x01])
        //pins.i2cWriteBuffer(i2cAddr, buf2, false)
        smbus.writeByte(i2cAddr, 0x80, 0x01)
        basic.pause(2) // Attente > 1.53ms

        // Entry left
        //buf2 = Buffer.fromArray([0x80, 0x04 | 0x02 | 0x00])
        //pins.i2cWriteBuffer(i2cAddr, buf2, false)
        smbus.writeByte(i2cAddr, 0x80, 0x04 | 0x02 | 0x00)
    }

    //% blockId="GROVE_I2C_LCD1620_SET_CURSOR" block="[Grove] set cursor at |x %x |y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function setCursor(x: number, y: number): void {
        //let buf2 = Buffer.create(2)

        if (y == 0)
            x = x | 0x80
        else
            x = x | 0xc0

        //buf2 = Buffer.fromArray([0x80, x])
        //pins.i2cWriteBuffer(i2cAddr, buf2, false)
        smbus.writeByte(i2cAddr, 0x80, x)
    }

    /**
         * show a string in LCD at given position
         * @param s is string will be show, eg: "Hello"
         * @param x is LCD column position, [0 - 15], eg: 0
         * @param y is LCD row position, [0 - 1], eg: 0
         */
    //% blockId="GROVE_I2C_LCD1620_SHOW_STRING" block="[Grove] show string %s"
    //% weight=90 blockGap=8
    export function showString(s: string): void {
        //let buf2 = Buffer.create(2)

        for (let i = 0; i < s.length; i++) {
            //buf2 = Buffer.fromArray([0x40, s.charCodeAt(i)])
            //pins.i2cWriteBuffer(i2cAddr, buf2, false)
            smbus.writeByte(i2cAddr, 0x40, s.charCodeAt(i))

        }
    }


}