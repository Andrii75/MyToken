const hre = require('hardhat');

async function main() {
  // Get the contract factory
  const VestingWallet = await hre.ethers.getContractFactory('VestingWallet');
  const CJOToken = await hre.ethers.getContractFactory('CJOToken');

  // Deploy the Token contract
  const cjoToken = await CJOToken.deploy();
  await cjoToken.waitForDeployment();
  const TokenAddress = cjoToken.target;

  // Get the signer for deploy
  const [deployer] = await hre.ethers.getSigners();

  // Get current timestamp and calculate vesting duration in seconds
  const startTimestamp = 1688666849;
  const vestingDuration = 113078985;

  // Deploy the contract with constructor parameters
  const vestingWalletInstance = await VestingWallet.deploy(
    deployer.address,
    startTimestamp,
    vestingDuration
  );
  await vestingWalletInstance.waitForDeployment();

  console.log('VestingWallet deployed to:', vestingWalletInstance.target);

  // Mint and send tokens to the VestingWallet
  const tokensToMint = ethers.parseUnits('282000', 8);
  await cjoToken.mint(vestingWalletInstance.target, tokensToMint);
  console.log('Tokens minted and sent to VestingWallet', tokensToMint);

  // Calculate timestamps for 1 month, 6 months, and end of vesting from now
  let oneMonthLater = Math.floor(Date.now() / 1000 + 30 * 24 * 60 * 60);
  let sixMonthsLater = Math.floor(Date.now() / 1000 + 30 * 24 * 60 * 60 * 6);
  let vestingEnd = Math.floor(Date.now() / 1000 + 30 * 24 * 60 * 60 * 12);

  // Vesting
  const vestedAmountOneMonth = await vestingWalletInstance[
    'vestedAmount(address,uint64)'
  ](TokenAddress, oneMonthLater);
  console.log('Vested amount after 1 month:', vestedAmountOneMonth.toString());

  const vestedAmountSixMonths = await vestingWalletInstance[
    'vestedAmount(address,uint64)'
  ](TokenAddress, sixMonthsLater);
  console.log(
    'Vested amount after 6 months:',
    vestedAmountSixMonths.toString()
  );

  const vestedAmountVestingEnd = await vestingWalletInstance[
    'vestedAmount(address,uint64)'
  ](TokenAddress, vestingEnd);
  console.log(
    'Vested amount at the end of vesting:',
    vestedAmountVestingEnd.toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// console.log(646683077319 / 10 ** 8);
// console.log(3878689448795 / 10 ** 8);
// console.log(7757097094566 / 10 ** 8);
