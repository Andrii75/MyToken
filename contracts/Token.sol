// contracts/CJOToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

 import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
 import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
 import "@openzeppelin/contracts/access/Ownable.sol";
 

contract CJOToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor() ERC20("CJO Token", "CJO") ERC20Capped(4700000 * 10 ** decimals()) {
        // Not minting tokens on deployment
    }

    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        // Check if the amount doesn't exceed the cap, this check is also done in _mint method of ERC20Capped contract
        require(totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount) internal override(ERC20, ERC20Capped) {
        super._mint(account, amount);
    }
}