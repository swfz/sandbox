#!/usr/bin/env zx

console.log(path.basename(__filename));
console.log(argv)
console.log(argv._.filter(a => a !== path.basename(__filename)))
