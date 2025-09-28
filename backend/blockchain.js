// blockchain.js
// Utility for interacting with BatchLifecycle contract
const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_RPC_URL = process.env.ETH_RPC_URL;

const abi = JSON.parse(fs.readFileSync(__dirname + '/BatchLifecycleABI.json'));

const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const wallet = new ethers.Wallet(ETH_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Example: getBatch
async function getBatch(batchId) {
  return await contract.getBatch(batchId);
}

// Example: recordBatch
async function recordBatch(batchId, herbName, farmer, quantity, unit, harvestDate, certifications, additionalInfo) {
  const tx = await contract.recordBatch(
    batchId,
    herbName,
    farmer,
    quantity,
    unit,
    harvestDate,
    certifications,
    additionalInfo
  );
  await tx.wait();
  return tx.hash;
}

module.exports = {
  contract,
  getBatch,
  recordBatch
};
