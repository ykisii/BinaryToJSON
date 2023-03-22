import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

export class BinaryToJSON {
    convert(buf:Uint8Array, formatFilePath: string):{} {
	const format = JSON.parse(Deno.readTextFileSync(formatFilePath));
	return this.bufferToJSON(buf, format);
    }

    private bufferToJSON(buf: Uint8Array, format:{}):{} {
	const br = new BinaryReader(buf);
	const output: Object = {};
	for (const [k, v] of Object.entries(format)) {
	    //console.log(k, v);
	    this.generateObject(br, v, output);
	    
	}
	return {};
    }

    private generateObject(br: BinaryReader, v: any , out: {}): {} {
	if (Array.isArray(v)) {
	    //gnerateObject(br, k, v, out);
	}
	else {
	    let value = Object.entries(v)[0];
	    console.log((typeof v));	    
	    //console.log(">" + value);
	    this.readBytes(br, value);
	}
	return {};	
    }

    private readBytes(br: BinaryReader, v: any): number {
	let test = Object.entries(v)[0];
	console.log("test> " + test);
	const length  = Number(v);
	const bytes: Uint8Array = br.readBytes(length);
	let shift: number = 0x00;
	console.log(length, bytes);
	let val: number = bytes.reduce((acc: number, val: number): number => {
	    let ret = acc | (val << shift);
	    shift += 0x08;
	    console.log(ret);
	    return ret;
	}, 0);

	return 0;
    }
}
