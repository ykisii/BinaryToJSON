import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

interface Obj {
  [prop: string]: any;
}

export class BinaryToJSON {
  #array_size: number = 0

  convert(buf: Uint8Array, format: []): {} {
    return this.bufferToJSON(buf, format);
  }

  private bufferToJSON(buf: Uint8Array, formats:[]): {} {
    // needs array. when read binary sequentially.
    if (Array.isArray(formats) === false) return {};

    const br = new BinaryReader(buf);
    const output: Obj = {};
    const array: object[] = []; 

    for (const format of formats) {
      const [key, val] = Object.entries(format)[0];
      if (Array.isArray(val)) {
        for (let i = 0; i < this.#array_size; i++) {
          array.push(this.bufferToJSON(buf, format[key]));
        }
        //console.log(array);
        output[key] = array;
      }
      else {
        const value = this.getValue(br, format);
        output[key] = value;
      }
    }
    return output;
  }

  private getValue(br: BinaryReader, format:{}) : number | null {
      const [key, val] = Object.entries(format)[0];
      //if (Array.isArray(val)) return {[key]:val};

      if (key === "__reserve") {
        // just increase offset.
        br.readBytes(Number(val));
        return null;
      }

      let value: number = this.readBytes(br, Number(val));

      if (key === "__repeat") {
        this.#array_size = value;
      }

      return value;//{[key]:value};
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
