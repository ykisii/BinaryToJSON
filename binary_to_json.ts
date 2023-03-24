import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

export class BinaryToJSON {

    convert(buf: Uint8Array, format: []) : {} {
        return this.bufferToJSON(buf, format);
    }

    private bufferToJSON(buf: Uint8Array, formats:[]):{} {
        // needs array. when read binary sequentially.
        if (Array.isArray(formats) === false) return {};

        const br = new BinaryReader(buf);
        const output = {};

        for (const format of formats) {
            this.generateObject(br, format, output);
        }
        return output;
    }

    private generateObject(br: BinaryReader, format:{} , out: {}): {} {
        let obj = {};
	    if (Array.isArray(format)) {
            console.log("array ....");
    	    //gnerateObject(br, k, v, out);
        }
        else {
            const [key, val] = Object.entries(format)[0];
            console.log(key, val);
            if (key === "reserve") {
                // just increase offset.
                br.readBytes(Number(val));
                return {};
            }
            let value: number = this.readBytes(br, Number(val));
            console.log(value.toString(16));
        }
        return obj;
    }

    private readBytes(br: BinaryReader, length: number): number {
        const bytes = br.readBytes(length);
        let shift = 0x00;
        
        let val: number = bytes.reduce((acc: number, val: number): number => {
            let ret = (acc << shift) | val;
            shift = 0x08;
            return ret
        }, 0);

        return val;
    }
}
