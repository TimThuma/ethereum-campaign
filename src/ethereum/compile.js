const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
const buildPath = path.resolve(__dirname, 'build');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

// remove build
fs.removeSync(buildPath);

const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// create build folder
fs.ensureDirSync(buildPath);

// output each contracts
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
