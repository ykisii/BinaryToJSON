import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

export class BinaryToJSON {
    // constructor(private buffer: Uint8Array) {
    // 	if (!buffer) {
    // 	    return;
    // 	}
    // 	this.buffer = buffer;
    // }

    convert(buf:Uint8Array, formatFilePath: string):{} {
	const format = JSON.parse(Deno.readTextFileSync(formatFilePath));
	console.log(format);
	return this.bufferToJSON(buf, format);
    }

    private bufferToJSON(buf: Uint8Array, format:{}):{} {
	return {};
    }
}
