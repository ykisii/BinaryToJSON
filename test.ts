import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { BinaryToJSON } from "./binary_to_json.ts";

Deno.test(
  "constructor",
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
  "convert",
  function():void {
    const file = Deno.openSync("sample.dat");
    const buffer = Deno.readAllSync(file);
    Deno.close(file.rid);
    const format = JSON.parse(Deno.readTextFileSync("sample_format.json"));
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(buffer, format);
    console.log(data);
    assertEquals(0x0A,  data['state']);
    assertEquals(0x07,  data['infos'][0]['type']);
    assertEquals(0x00,  data['dat'][0]['type']);
  },
);

Deno.test(
  "little endian",
  function(): void {
    const buffer = new ArrayBuffer(4);
    const arry = new Uint8Array(buffer);
    arry[0] = 0x0D;
    arry[1] = 0x0C;
    arry[2] = 0x0B;
    arry[3] = 0x0A;
    const format = [{"dat":4}];
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(arry, format, true);
    console.log(data);
    assertEquals(0x0A0B0C0D, data['dat']);
  },
);

Deno.test(
  "big endian",
  function(): void {
    const buffer = new ArrayBuffer(5);
    const arry = new Uint8Array(buffer);
    arry[0] = 0x00;
    arry[1] = 0x01;
    arry[2] = 0x02;
    arry[3] = 0x03;
    const format = [{"dat":4}];
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(arry, format);
    console.log(data);
    assertEquals(0x00010203, data['dat']);
  },
);