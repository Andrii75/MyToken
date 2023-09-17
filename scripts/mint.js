const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('deployer', deployer);

  // Replace with your deployed token's address
  const tokenAddress = '0x7B0F1f20Fc6f2E67984b397e06538fC1E6FbEaeb';

  const CJOToken = await hre.ethers.getContractAt('CJOToken', tokenAddress);

  const amountToMint = hre.ethers.parseUnits('5000', 8); // Replace YOUR_AMOUNT with the number of tokens you want to mint

  const mintTxn = await CJOToken.mint(deployer.address, amountToMint);
  await mintTxn.wait();

  console.log(`Minted ${5000} tokens to the deployer's address`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
