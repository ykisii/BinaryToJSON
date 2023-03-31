# BinaryToJSON
[![Deno Doc](https://doc.deno.land/badge.svg)](https://deno.land/x/binary_to_json@v0.1.0/mod.ts)

A Deno 🦕 module helper class that convert binary array buffer to JSON format.
Binary interpretation is defined by JSON.

This module depends on https://deno.land/x/binary_reader@v0.1.6/mod.ts .

## Usage
```typescript
import { BinaryToJSON } from "https://deno.land/x/binary_to_json@v0.1.0/mod.ts";

const buffer = new ArrayBuffer(4);
const arry = new Uint8Array(buffer);
arry[0] = 0x0A;
arry[1] = 0x0B;
arry[2] = 0x0C;
arry[3] = 0x0D;
const format = [{"dat": 4}];
const b2j = new BinaryToJSON();
const data: any = b2j.convert(arry, format); // default endian is big

// => {"dat": 168496141 }   # 0x0A0B0C0D
```
## Example
### binary
```bin
FF FF 01 02 03 04 05 06 07 08 09 0A 05 01 02 03 04 05
```
### format
```json
[
  {"__reserve": 2},
  {"__repeat": 10},
  {"dat1": [{"v1": 1}]},
  {"__repeat/num": 1},
  {"dat2": [{"v1": 1}]}
]
```
### output
```
{
  dat1: [
    { v1: 1 }, { v1: 2 },
    { v1: 3 }, { v1: 4 },
    { v1: 5 }, { v1: 6 },
    { v1: 7 }, { v1: 8 },
    { v1: 9 }, { v1: 10 }
  ],
  "__repeat/num": 5,
  dat2: [ { v1: 1 }, { v1: 2 }, { v1: 3 }, { v1: 4 }, { v1: 5 } ]
}
```

more info: please refer to test.ts.
