// Ajouter votre code ici
namespace smbus {
    export function sm_writeByte(addr: number, register: number, value: number): void {
        let temp = pins.createBuffer(2);
        temp[0] = register;
        temp[1] = value;
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function sm_writeBuffer(addr: number, register: number, value: Buffer): void {
        let temp = pins.createBuffer(value.length + 1);
        temp[0] = register;
        for (let x = 0; x < value.length; x++) {
            temp[x + 1] = value[x];
        }
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function sm_readBuffer(addr: number, register: number, len: number): Buffer {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadBuffer(addr, len, false);
    }
    function sm_readNumber(addr: number, register: number, fmt: NumberFormat = NumberFormat.UInt8LE): number {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadNumber(addr, fmt, false);
    }
    export function sm_unpack(fmt: string, buf: Buffer): number[] {
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
//% weight=20 color=#0080FF icon="\uf108"
namespace AfficheurLcd16x2 {
 
    let i2cAddr: number=0x3e  // 62(0x3E) par défaut
    let regCTRL: number // Registre Control LCD (Display ON/OFF, Cursor ON/OFF, Blink ON/OFF)

    /**
     * Initialise l'afficheur LCD (adresse I2C par défaut = 62 (0x3e))
     * @param Addr : adresse I2C de l'afficheur LCD,  ex: 62
     */
    //% blockId="GROVE_I2C_LCD1602_SET_ADDRESS" block="[LCD] Initialiser || avec adresse I2C $Addr"
    //% expandableArgumentMode="toggle"
    //% Addr.defl=0x3e
    //% weight=100 blockGap=8
    export function LCD_init(Addr: number = 0x3e) {
        i2cAddr = Addr

        basic.pause(20) // Attente > 15ms
        // 8bits mode, 2Lines mode, 5x8 dots
        smbus.sm_writeByte(i2cAddr, 0x80, 0x20|0x10|0x08|0x00)
        basic.pause(1) // Attente > 39us

        // Display ON, Cursor OFF, Blink OFF
        regCTRL = 0x04|0x00|0x00
        smbus.sm_writeByte(i2cAddr, 0x80, 0x08|regCTRL)
        basic.pause(1) // Attente > 39us

        // Clear display
        //smbus.writeByte(i2cAddr, 0x80, 0x01)
        //basic.pause(2) // Attente > 1.53ms
        LCD_clearDisplay()

        // Entry left
        smbus.sm_writeByte(i2cAddr, 0x80, 0x04|0x02|0x00)
    }

    /**
    * Efface l'écran de l'afficheur LCD (affiche des espaces sur les 2 lignes)
    */
    //% blockId="GROVE_I2C_LCD1602_CLEAR_DISPLAY" block="[LCD] Effacer écran"
    export function LCD_clearDisplay(): void {
        smbus.sm_writeByte(i2cAddr, 0x80, 0x01)
        basic.pause(2) // Attente > 1.53ms
    }

    /**
    * Efface la ligne donnée en paramètre (0 ou 1)
    * @param line : Ligne à effacer (0 ou 1)
    */
    //% blockId="GROVE_I2C_LCD1602_CLEAR_LINE" block="[LCD] Effacer ligne $line"
    //% line.min=0 line.max=1
    export function LCD_clearLine(line: number): void {
        let s = "                "
        LCD_showString(s, 0, line)

    }

    /**
    * Active/désactive l'affichage
    * @param on : état ON/OFF
    */
    //% blockId="GROVE_I2C_LCD1602_DISPLAY_ONOFF" block="[LCD] Définir état affichage $on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function LCD_displayOnOff(on: boolean): void {
        if (on) regCTRL |= 0x04; else regCTRL &= ~0x04
        smbus.sm_writeByte(i2cAddr, 0x80, 0x08|regCTRL)
        basic.pause(1) // Attente > 39us
    }

    /**
    * Active/désactive le curseur
    * @param on : état ON/OFF
    */
    //% blockId="GROVE_I2C_LCD1602_CURSOR_ONOFF" block="[LCD] Définir état curseur $on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function LCD_cursorOnOff(on: boolean): void {
        if (on) regCTRL |= 0x02; else regCTRL &= ~0x02
        smbus.sm_writeByte(i2cAddr, 0x80, 0x08|regCTRL)
        basic.pause(1) // Attente > 39us
    }

    /**
    * Active/désactive le clignotement du curseur
    * @param on : état ON/OFF
    */
    //% blockId="GROVE_I2C_LCD1602_CURSOR_BLINK_ONOFF" block="[LCD] Définir état clignotement curseur $on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function LCD_cursorBlinkOnOff(on: boolean): void {
        if (on) regCTRL |= 0x01; else regCTRL &= ~0x01
        smbus.sm_writeByte(i2cAddr, 0x80, 0x08|regCTRL)
        basic.pause(1) // Attente > 39us
    }


    /**
    * Définit la position du curseur à l'écran
    * @param x = Colonne LCD, [0 - 15], ex: 0
    * @param y = Ligne LCD, [0 - 1], ex: 0
    */
    //% blockId="GROVE_I2C_LCD1602_SET_CURSOR_POSITION" block="[LCD] Définir position curseur à  |x: $x |y: $y"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function LCD_setCursorPosition(x: number, y: number): void {
        if (y == 0) x |= 0x80; else x |= 0xc0
        smbus.sm_writeByte(i2cAddr, 0x80, x)
        basic.pause(1) // Attente > 39us
    }


    /**
    * Affiche une chaîne de caractères à l'écran, à une position donnée (colonne, ligne)
    * @param s = Chaine à afficher ex: "Hello"
    * @param x = Colonne LCD, [0 - 15], ex: 0
    * @param y = Ligne LCD, [0 - 1], ex: 0
    */
    //% blockId="GROVE_I2C_LCD1620_SHOW_STRING" block="[LCD] Afficher texte $s à  |x: $x |y: $y"
    //% s.defl="Hello"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function LCD_showString(s: string, x: number, y: number): void {
        // Set cursor position
        LCD_setCursorPosition(x,y)
        
        // Display string characters
        for (let i = 0; i < s.length; i++) {
            smbus.sm_writeByte(i2cAddr, 0x40, s.charCodeAt(i))
        }
    }

    /**
    * Affiche un nombre à l'écran, à une position donnée (colonne, ligne)
    * @param n = nombre à afficher, ex: 10, 100, 200
    * @param x = Colonne LCD, [0 - 15], ex: 0
    * @param y = Ligne LCD, [0 - 1], ex: 0
    */
    //% blockId="GROVE_I2C_LCD1602_SHOW_NUMBER" block="[LCD] Afficher nombre $n à  |x: $x |y: $y"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% n.defl=0 
    export function LCD_ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        LCD_showString(s, x, y)
    }



}