import { expect } from "chai";
import { ethers } from "hardhat";
import { Vault } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Vault", function () {
  let vault: Vault;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const VaultFactory = await ethers.getContractFactory("Vault");
    vault = await VaultFactory.deploy();
    await vault.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero balance", async function () {
      expect(await vault.getBalance()).to.equal(0);
      expect(await vault.getTotalFeesCollected()).to.equal(0);
      expect(await vault.getTotalWithdrawn()).to.equal(0);
    });
  });

  describe("Receiving Funds", function () {
    it("Should receive BNB via receive function", async function () {
      const amount = ethers.parseEther("1.0");

      await expect(
        user1.sendTransaction({
          to: await vault.getAddress(),
          value: amount,
        })
      ).to.changeEtherBalance(vault, amount);

      expect(await vault.getBalance()).to.equal(amount);
      expect(await vault.getTotalFeesCollected()).to.equal(amount);
    });

    it("Should emit FeeReceived event", async function () {
      const amount = ethers.parseEther("0.5");

      await expect(
        user1.sendTransaction({
          to: await vault.getAddress(),
          value: amount,
        })
      ).to.emit(vault, "FeeReceived").withArgs(user1.address, amount, "fee");
    });

    it("Should accumulate multiple deposits", async function () {
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("0.5");

      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: amount1,
      });

      await user2.sendTransaction({
        to: await vault.getAddress(),
        value: amount2,
      });

      expect(await vault.getBalance()).to.equal(amount1 + amount2);
      expect(await vault.getTotalFeesCollected()).to.equal(amount1 + amount2);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // Deposit some funds
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("5.0"),
      });
    });

    it("Should allow owner to withdraw specific amount", async function () {
      const withdrawAmount = ethers.parseEther("2.0");
      const balanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await vault.connect(owner).withdraw(withdrawAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter + gasUsed).to.equal(balanceBefore + withdrawAmount);
      expect(await vault.getBalance()).to.equal(ethers.parseEther("3.0"));
      expect(await vault.getTotalWithdrawn()).to.equal(withdrawAmount);
    });

    it("Should emit Withdrawal event", async function () {
      const withdrawAmount = ethers.parseEther("1.0");

      await expect(vault.connect(owner).withdraw(withdrawAmount))
        .to.emit(vault, "Withdrawal")
        .withArgs(owner.address, withdrawAmount);
    });

    it("Should fail to withdraw more than balance", async function () {
      const withdrawAmount = ethers.parseEther("10.0");

      await expect(
        vault.connect(owner).withdraw(withdrawAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should fail to withdraw zero amount", async function () {
      await expect(
        vault.connect(owner).withdraw(0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should fail non-owner withdrawal", async function () {
      await expect(
        vault.connect(user1).withdraw(ethers.parseEther("1.0"))
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to withdraw all", async function () {
      const vaultBalance = await vault.getBalance();
      const balanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await vault.connect(owner).withdrawAll();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter + gasUsed).to.be.closeTo(
        balanceBefore + vaultBalance,
        ethers.parseEther("0.0001")
      );
      expect(await vault.getBalance()).to.equal(0);
    });
  });

  describe("Emergency Withdrawal", function () {
    it("Should allow owner to emergency withdraw", async function () {
      // Deposit funds
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("3.0"),
      });

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const vaultBalance = await vault.getBalance();

      const tx = await vault.connect(owner).emergencyWithdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter + gasUsed).to.be.closeTo(
        balanceBefore + vaultBalance,
        ethers.parseEther("0.0001")
      );
      expect(await vault.getBalance()).to.equal(0);
    });

    it("Should emit EmergencyWithdrawal event", async function () {
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("1.0"),
      });

      await expect(vault.connect(owner).emergencyWithdraw())
        .to.emit(vault, "EmergencyWithdrawal")
        .withArgs(owner.address, ethers.parseEther("1.0"));
    });

    it("Should fail non-owner emergency withdrawal", async function () {
      await expect(
        vault.connect(user1).emergencyWithdraw()
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("Contract Authorization", function () {
    it("Should authorize a contract", async function () {
      expect(await vault.isAuthorized(user1.address)).to.be.false;

      await vault.connect(owner).authorizeContract(user1.address);

      expect(await vault.isAuthorized(user1.address)).to.be.true;
    });

    it("Should revoke contract authorization", async function () {
      await vault.connect(owner).authorizeContract(user1.address);
      expect(await vault.isAuthorized(user1.address)).to.be.true;

      await vault.connect(owner).revokeContract(user1.address);
      expect(await vault.isAuthorized(user1.address)).to.be.false;
    });

    it("Should fail to authorize zero address", async function () {
      await expect(
        vault.connect(owner).authorizeContract(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should fail non-owner authorization", async function () {
      await expect(
        vault.connect(user1).authorizeContract(user2.address)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("View Functions", function () {
    it("Should return correct balance", async function () {
      expect(await vault.getBalance()).to.equal(0);

      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("2.5"),
      });

      expect(await vault.getBalance()).to.equal(ethers.parseEther("2.5"));
    });

    it("Should track total fees collected", async function () {
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("1.0"),
      });

      await user2.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("2.0"),
      });

      expect(await vault.getTotalFeesCollected()).to.equal(ethers.parseEther("3.0"));
    });

    it("Should track total withdrawn", async function () {
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("5.0"),
      });

      await vault.connect(owner).withdraw(ethers.parseEther("2.0"));
      await vault.connect(owner).withdraw(ethers.parseEther("1.0"));

      expect(await vault.getTotalWithdrawn()).to.equal(ethers.parseEther("3.0"));
    });

    it("Should calculate available balance correctly", async function () {
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("10.0"),
      });

      await vault.connect(owner).withdraw(ethers.parseEther("3.0"));

      expect(await vault.getAvailableBalance()).to.equal(ethers.parseEther("7.0"));
    });
  });
});

