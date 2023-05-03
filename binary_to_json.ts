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
    if (Array.isArray(formats) === false ||
        buf.length === 0) {
          return {};
    }
    
    const output: Obj = {};
    const array: object[] = []; 
    for (const format of formats) {
      const [key, val] = Object.entries(format)[0];
      if (Array.isArray(val)) {
        this.setObjects(br, buf, array, val);
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
              dataArray: object[], 
                formats: unknown[]) 
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
      br.seek(br.position + Number(val));
      return null;
    }
    if (key == "__repeat") {
      this.#array_size = Number(val);
      return null;
    }
    
    let value: number = this.readBytes(br, Number(val));

    if (/^__repeat/.test(key)) {
      this.#array_size = value;
    }
    
    return value;
  }

  private readBytes(br: BinaryReader, length: number): number {
    const surplusLength = length >= 4 ? length - 4 : 0;
    const bytes = br.readBytes(length - surplusLength);
    let val = this.convolutionBytes(bytes);
    if (surplusLength > 0) {
      for (let i = 0; i < surplusLength*2; i++) {
        // bit shift
        val *= 16;
      }
      val += this.convolutionBytes(br.readBytes(surplusLength));
    }
    return val;
  }

  private convolutionBytes(bytes: any): number {
    let shift = 0;
    return bytes.reduce((acc: number, val: number): number => {
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
  }
}