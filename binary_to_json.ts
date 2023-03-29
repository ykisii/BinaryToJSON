import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

interface Obj {
  [prop: string]: any;
}

export class BinaryToJSON {
  #array_size:number = 0;
  #littlEndian: boolean = false;

  convert(buf: Uint8Array, format: any[], littleEndian?: boolean): {} {
    const br = new BinaryReader(buf);
    this.#littlEndian = littleEndian ?? false;

    return this.bufferToJSON(br, buf, format);
  }

  private bufferToJSON(br: BinaryReader, buf: Uint8Array, formats:any[]): {} {
    // needs array. when read binary sequentially.
    if (Array.isArray(formats) === false) return {};
    
    const output: Obj = {};
    const array: object[] = []; 

    for (const format of formats) {
      const [key, val] = Object.entries(format)[0];
      if (Array.isArray(val)) {
        this.setObjects(br, buf, output, array, val);
        output[key] = structuredClone(array);
        this.#array_size = 0;
        array.splice(0);
      }
      else {
        const value = this.getValue(br, format);
        if (value !== null) output[key] = value;
      }
    }
    return output;
  }

  private setObjects(br: BinaryReader,
                    buf: Uint8Array, 
                 output: Obj, 
              dataArray: object[], 
                formats: any[]) 
  {
    for (let i = 0; i < this.#array_size; i++) {
      const obj = this.bufferToJSON(br, buf, formats);
      //console.log(i, this.#array_size, formats, obj);
      if (Object.keys(obj).length > 0) {
        dataArray.push(obj);
      }
    }
  }

  private getValue(br: BinaryReader, format:{}) : number | null {
    const [key, val] = Object.entries(format)[0];
    if (key === "__reserve") {
      // just increase offset.
      br.readBytes(Number(val));
      return null;
    }

    let value: number = this.readBytes(br, Number(val));

    if (/^__repeat/.test(key)) {
      this.#array_size = value;
      if (key === "__repeat") return null;
    }
    return value;
  }

  private readBytes(br: BinaryReader, length: number): number {
    const bytes = br.readBytes(length);
    let shift = 0x00;
    let val = bytes.reduce((acc: number, val: number): number => {
      let ret = 0;
      if (this.#littlEndian) {
        ret = acc | (val << shift)
        shift += 0x08;
      }
      else {
        ret = (acc << shift) | val;
        shift = 0x08;
      }
      return ret;
    }, 0);

    return val;
  }
}