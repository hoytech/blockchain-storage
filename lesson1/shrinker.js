const fs = require('fs');

if (process.argv.length < 5) {
    console.error("Super file shrinker v1.0.0");
    console.error("    node shrinker.js shrink <input-file> <output-file>");
    console.error("    node shrinker.js unshrink <input-file> <output-file>");
    process.exit(1);
}

let mode = process.argv[2];
let inputFile = process.argv[3];
let outputFile = process.argv[4];

let inputBytes = Array.prototype.slice.call(fs.readFileSync(inputFile));
let outputBytes;

if (mode === 'shrink') outputBytes = shrink(inputBytes);
else if (mode === 'unshrink') outputBytes = unshrink(inputBytes);
else throw("Unknown mode: " + mode);

fs.writeFileSync(outputFile, new Buffer(outputBytes));


////////// Your code: //////////


function shrink(input) {
    let output = [];

    // EDIT ME

    return output;
}

function unshrink(input) {
    let output = [];

    // EDIT ME

    return output;
}
