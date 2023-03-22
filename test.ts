import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { BinaryToJSON } from "./binary_to_json.ts";

Deno.test(
    "constructor()",
    function(): void {
	const buffer = new ArrayBuffer(4);
	const arry = new Uint8Array(buffer);
	arry[0] = 0x48;
	arry[1] = 0x65;
	arry[2] = 0xAC;
	arry[3] = 0x6C;
	const b2j = new BinaryToJSON();
	assertNotEquals(null, b2j);
    },
);

Deno.test(
    "convert test1",
    function():void {
	const file = Deno.openSync("sample.dat");
	const buffer = Deno.readAllSync(file);
	Deno.close(file.rid);
	const b2j = new BinaryToJSON();
	assertEquals({}, b2j.convert(buffer, "./sample.json"));
    },
);
