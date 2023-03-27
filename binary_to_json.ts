import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

interface Obj {
  [prop: string]: any;
}

export class BinaryToJSON {

  convert(buf: Uint8Array, format: []) : {} {
    return this.bufferToJSON(buf, format);
  }

  private bufferToJSON(buf: Uint8Array, formats:[]):{} {
    // needs array. when read binary sequentially.
    if (Array.isArray(formats) === false) return {};

    const br = new BinaryReader(buf);
    const output: Obj = {};

    for (const format of formats) {
      const obj = this.generateObject(br, format);
      if (Object.keys(obj).length > 0) {
        const data: Obj = Object.entries(obj)[0];
        output[data[0]] = data[1];
      }
    }
    return output;
  }

  private generateObject(br: BinaryReader, format:{}) : {} {
      const [key, val] = Object.entries(format)[0];
      if (key === "__reserve") {
        // just increase offset.
        br.readBytes(Number(val));
        return {};
      }
      let value: number = this.readBytes(br, Number(val));
      return {[key]:value};
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
