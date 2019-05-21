const ethers = require('ethers');
const fs = require('fs');


if (process.argv.length < 4) {
    console.error("Voter-list merkle tree calculator v1.0.0");
    console.error("    node voter-tree.js root <addresses-file>");
    console.error("    node voter-tree.js proof <addresses-file> <address-to-prove>");
    process.exit(1);
}

let mode = process.argv[2];
let addressesFile = process.argv[3];

let addresses = fs.readFileSync(addressesFile, 'utf-8')
                    .split('\n')
                    .map(a => a.replace(/#.*/, '').trim())
                    .filter(a => a.length > 0)
                  ;

if (mode === 'root') {
    console.log(getMerkleRoot(addresses));
} else if (mode === 'proof') {
    if (process.argv.length < 5) throw("must pass in address to prove");

    let proof = generateMerkleProof(addresses, process.argv[4]);

    console.log('path: ', proof.path);
    console.log('witnesses: ', JSON.stringify(proof.witnesses));
} else {
    throw("unrecognized mode: " + mode);
}


function getMerkleRoot(items) {
    if (items.length === 0) throw("can't build merkle tree without level");

    let level = items.map(leafHash);

    while (level.length > 1) {
        let nextLevel = [];

        for (let i = 0; i < level.length; i += 2) {
            if (i === level.length - 1) nextLevel.push(level[i]); // odd number of nodes at this level
            else nextLevel.push(nodeHash(level[i], level[i+1]));
        }

        level = nextLevel;
    }

    return level[0];
}

function generateMerkleProof(items, item) {
    let index = items.findIndex((i) => i === item);
    if (index === -1) throw("item not found in items: " + item);

    let pathArr = [];
    let witnesses = [];

    let level = items.map(leafHash);
 
    while (level.length > 1) {
        // Get proof for this level

        let nextIndex = Math.floor(index / 2);

        if (nextIndex * 2 === index) {
            // left side
            if (index < level.length - 1) {
                // only if we're not the last in a level with odd number of nodes
                pathArr.push(0);
                witnesses.push(level[index + 1]);
            }
        } else {
            // right side
            pathArr.push(1);
            witnesses.push(level[index - 1]);
        }

        index = nextIndex;

        // Compute next level

        let nextLevel = []; 

        for (let i = 0; i < level.length; i += 2) {
            if (i === level.length - 1) nextLevel.push(level[i]); // odd number of nodes at this level
            else nextLevel.push(nodeHash(level[i], level[i+1]));
        }

        level = nextLevel;
    }

    let path = 0;
    for (let i of pathArr.reverse()) path = (path << 1) | i;

    return { path, witnesses };
}

function leafHash(v) {
    return ethers.utils.keccak256(ethers.utils.concat(['0x00', v]));
}

function nodeHash(left, right) {
    return ethers.utils.keccak256(ethers.utils.concat(['0x01', left, right]));
}
