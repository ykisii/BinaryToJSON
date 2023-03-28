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
    const format = JSON.parse(Deno.readTextFileSync("sample.json"));
    const b2j = new BinaryToJSON();
    const data: any = b2j.convert(buffer, format);
    console.log(data);
    assertEquals(10,  data['state']);
    assertEquals(2,  data['type']);
    assertEquals(2320,  data['sub_value']);
  },
);