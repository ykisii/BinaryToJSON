import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
//import { BinaryToJSON } from "https://deno.land/x/binary_to_json@v0.1.0/mod.ts";
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
    assertEquals(0x01,  data['infos'][0]['type']);
    assertEquals(0x00,  data['dat'][0]['type']);
  },
);

Deno.test(
  "convert repeat",
  function():void {
    const file = Deno.openSync("sample2.dat");
    const buffer = Deno.readAllSync(file);
    Deno.close(file.rid);
    const format = JSON.parse(Deno.readTextFileSync("sample_format2.json"));
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(buffer, format);
    console.log(data);
    assertEquals(0x01,  data['dat1'][0]['v']);
    assertEquals(0x01,  data['dat2'][0]['v']);
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

Deno.test(
  "convert array null",
  function(): void {
    const arry = new Uint8Array();
    const format = [{"dat":4}];
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(arry, format);
    console.log(data);
    assertEquals({}, data);
  },
);

Deno.test(
  "read 5bytes",
  function(): void {
    const buffer = new ArrayBuffer(5);
    const arry = new Uint8Array(buffer);
    arry[0] = 0x00;
    arry[1] = 0x01;
    arry[2] = 0x02;
    arry[3] = 0x03;
    arry[4] = 0x04;
    const format = [{"dat":5}];
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(arry, format);
    console.log(data);
    assertEquals(0x0001020304, data['dat']);
  },
);

Deno.test(
  "read 8bytes",
  function(): void {
    const buffer = new ArrayBuffer(8);
    const arry = new Uint8Array(buffer);
    arry[0] = 0x00;
    arry[1] = 0x01;
    arry[2] = 0x02;
    arry[3] = 0x03;
    arry[4] = 0x04;
    arry[5] = 0x05;
    arry[6] = 0x06;
    arry[7] = 0x07;
    const format = [{"dat":8}];
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(arry, format);
    console.log(data);
    assertEquals(0x0001020304050607, data['dat']);
  },
);
/*
Deno.test(
  "complex dat",
  function(): void {
    const file = Deno.openSync("xxx.DAT");
    const buffer = Deno.readAllSync(file);
    Deno.close(file.rid);
    const format = JSON.parse(Deno.readTextFileSync("prct_format.json"));
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(buffer, format);
    console.log(data);
  },
);
*/
