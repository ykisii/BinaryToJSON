import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

type Obj = {
  [prop: string]: any;
}

type SetParam = {
  br: BinaryReader,
  buf: Uint8Array,
  dataArray: object[],
  formats: any[]
}

export class BinaryToJSON {
  #array_size:number = 0;
  #littlEndian: boolean = false;

  convert(buf: Uint8Array, format: any[], littleEndian?: boolean): {} {
    const br = new BinaryReader(buf);
    this.#littlEndian = littleEndian ?? this.#littlEndian;
    this.#array_size = 0;

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
        this.setObjects({br:br, buf:buf, dataArray:array, formats:val});
        output[key] = structuredClone(array);
        this.#array_size = 0;
        array.splice(0);
      }
      else {
        const value = this.getValue(br, format);
        if (value !== null) {
          output[key] = value;
        }
      }
    }
    return output;
  }

  private setObjects(param: SetParam)
  {
    for (let i = 0; i < this.#array_size; i++) {
      const obj = this.bufferToJSON(param.br, param.buf, param.formats);
      //console.log(i, this.#array_size, formats, obj);
      if (Object.keys(obj).length > 0) {
        param.dataArray.push(obj);
      }
    }
  }

  private getValue(br: BinaryReader, format:{}) : number | null | string {
    const [key, val] = Object.entries(format)[0];
    if (key === "__reserve") {
      br.seek(br.position + Number(val));
      return null;
    }
    if (key == "__repeat") {
      this.#array_size = Number(val);
      return null;
    }
    if (/^__string/.test(key)) {
      return this.getString(br, Number(val));
    }
    
    let value: number = this.readBytes(br, Number(val));

    if (/^__repeat/.test(key)) {
      this.#array_size = value;
    }
    
    return value;
  }

  private readBytes(br: BinaryReader, length: number): number {
    const surplusLength = length >= 4 ? length - 4 : 0;
    let val = 0;
    if (length >= 4) {
      val = br.readUint32(this.#littlEndian);
    }
    else {
      const bytes = br.readBytes(length);
      val = this.convolutionBytes(bytes);
    }

    if (surplusLength > 0) {
      for (let i = 0; i < surplusLength * 2; i++) {
        // bit shift
        val *= 16;
      }
      val += this.convolutionBytes(br.readBytes(surplusLength));
    }
    return val;
  }

  private getString(br: BinaryReader, length: number): string {
    let ret: string = "";
    for (let i = 0; i < length; i++) {
      const value = br.readBytes(1)[0];
      let char = '';
      // support ascii
      if ((0 <= value) && (value <= 127)) {
        char = String.fromCharCode(value);
      }
      else {
        char = value.toString(16);
      }
      ret += char;
    }
    return ret;
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