const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game3", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game3");
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

    const [addr1, addr2, addr3] = await Promise.all([
      signer1.getAddress(),
      signer2.getAddress(),
      signer3.getAddress(),
    ]);

    const signers = [signer1, signer2, signer3];
    const addresses = [addr1, addr2, addr3];

    return { game, signers, addresses };
  }

  it("should be a winner", async function () {
    const { game, signers, addresses } = await loadFixture(
      deployContractAndSetVariables
    );

    // you'll need to update the `balances` mapping to win this stage
    await Promise.all([
      game.connect(signers[1]).buy({ value: ethers.utils.parseEther("3") }),
      game.connect(signers[0]).buy({ value: ethers.utils.parseEther("2") }),
      game.connect(signers[2]).buy({ value: ethers.utils.parseEther("1") }),
    ]);

    // TODO: win expects three arguments
    await game.win(addresses[0], addresses[1], addresses[2]);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
