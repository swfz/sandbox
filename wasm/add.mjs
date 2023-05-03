import fs from "node:fs/promises";

const file = await fs.readFile("add.wasm");
const result = await WebAssembly.instantiate(file);
console.log(result.instance.exports.add(1,2));
