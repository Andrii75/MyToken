const hre = require('hardhat');
async function main() {
  // console.log('Deploying contracts with the account:', deployer.address);

  const token = await hre.ethers.getContractFactory('CJOToken');
  const Token = await token.deploy();
  await Token.waitForDeployment();

  console.log('Token address:', Token.target);
  const [deployer] = await ethers.getSigners();
  const mintTxn = await Token.mint(
    deployer.address,
    hre.ethers.parseUnits('1000', 8)
  );
  await mintTxn.wait();

  console.log("Minted tokens to the deployer's address");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
