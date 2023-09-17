const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CJOToken', function () {
  let Token, owner, addr1, addr2;

  this.beforeEach(async function () {
    const tokenFactory = await ethers.getContractFactory('CJOToken');
    Token = await tokenFactory.deploy();
    await Token.waitForDeployment();
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  it('Return the correct name and symbol', async function () {
    expect(await Token.name()).to.equal('CJO Token');
    expect(await Token.symbol()).to.equal('CJO');
  });

  it('Return the correct decimal value', async function () {
    expect(await Token.decimals()).to.equal(8);
  });

  it('Return total supply = 0', async function () {
    const totalSupply = await Token.totalSupply();
    expect(totalSupply).to.equal(0);
  });

  it('The deploying account should have the same balance as the total supply', async function () {
    const initialBalance = await Token.balanceOf(owner.address);
    const totalSupply = await Token.totalSupply();
    expect(initialBalance).to.equal(totalSupply);
  });

  describe('Transfer', function () {
    it('Should transfer tokens correctly', async function () {
      await Token.mint(owner.address, 100);
      await Token.transfer(addr1.address, 50);
      expect(await Token.balanceOf(owner.address)).to.equal(50);
      expect(await Token.balanceOf(addr1.address)).to.equal(50);
    });
  });

  describe('Approve', function () {
    it("Should change the recipient's allowance correctly", async function () {
      await Token.mint(owner.address, 100);
      await Token.approve(addr1.address, 50);
      expect(await Token.allowance(owner.address, addr1.address)).to.equal(50);
    });
  });
  describe('TransferFrom', function () {
    it('Should transfer tokens correctly from allowed account and reduce the allowance', async function () {
      // Mint 1000 tokens (adjust this based on your token's decimals)
      await Token.mint(owner.address, 1000);

      // Owner approves addr1 to spend 500 of their tokens
      await Token.approve(addr1.address, 500);

      // addr1 transfers 500 tokens from owner to addr2
      await Token.connect(addr1).transferFrom(
        owner.address,
        addr2.address,
        500
      );

      // After the transfer, owner should have 500 tokens left
      expect(await Token.balanceOf(owner.address)).to.equal(500);

      // addr2 should have received 500 tokens
      expect(await Token.balanceOf(addr2.address)).to.equal(500);

      // The allowance that owner gave to addr1 should have been reduced to 0
      expect(await Token.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it('Should not transfer tokens if allowance is insufficient', async function () {
      await Token.mint(owner.address, 100);
      await Token.approve(addr1.address, 25);
      await expect(
        Token.connect(addr1).transferFrom(owner.address, addr2.address, 50)
      ).to.be.revertedWith('ERC20: insufficient allowance');
    });
  });

  describe('Burn', function () {
    it('Should burn tokens and reduce balance correctly', async function () {
      // Mint 1000 tokens (adjust this based on your token's decimals)
      await Token.mint(owner.address, 1000);

      // Burn 500 tokens
      await Token.connect(owner).burn(500);

      // After burning, owner should have 500 tokens left
      expect(await Token.balanceOf(owner.address)).to.equal(500);
    });
  });

  describe('Contract Ownership', function () {
    it('Should match the deployer as the owner of the contract', async function () {
      // The owner of the contract should be the same as the deployer
      expect(await Token.owner()).to.equal(owner.address);
    });
  });
  describe('Minting', function () {
    it('Only owner can mint new tokens', async function () {
      // Mint 1000 tokens (adjust this based on your token's decimals)
      await Token.connect(owner).mint(addr1.address, 1000);

      // addr1 should have 1000 tokens
      expect(await Token.balanceOf(addr1.address)).to.equal(1000);
    });

    it('Other users cannot mint new tokens', async function () {
      // Try to mint tokens from non-owner account
      await expect(
        Token.connect(addr1).mint(addr1.address, 1000)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
  describe('Cap', function () {
    it('There is no way to increase total supply beyond the cap value', async function () {
      const cap = await Token.cap();
      const one = BigInt(1);
      // Try to mint tokens beyond the cap
      await expect(
        Token.connect(owner).mint(addr1.address, cap + one)
      ).to.be.revertedWith('ERC20Capped: cap exceeded');
    });
  });
});
