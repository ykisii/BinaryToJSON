import { BinaryReader } from "https://deno.land/x/binary_reader@v0.1.6/mod.ts";

export class BinaryToJSON {
    
    constructor(private buffer: Uint8Array) {
	if (!buffer) {
	    return;
	}
	this.buffer = buffer;
    }
}
