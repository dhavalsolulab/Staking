const { expect } = require("chai");

describe("Token contract", function () {
    let factoryProxy;
    let hardhatToken;
    let [owner] = await ethers.getSigners();
    before("Deployment should assign the total supply of tokens to the owner", async function () {
        const Token = await ethers.getContractFactory("Dai");
        hardhatToken = await Token.deploy("4");

        const Stake = await ethers.getContractFactory("Stake");

        factoryProxy = await upgrades.deployProxy(Stake, ["0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF", hardhatToken.address, hardhatToken.address, "86400"], {kind: 'uups'})
        console.log("proxy address: ", factoryProxy.address);
  
        
        // const ownerBalance = await factoryProxy.rewardInterval();
        expect(await factoryProxy.rewardInterval()).to.equal("86400");
        expect(await factoryProxy.depositToken()).to.equal(hardhatToken.address);
    });
    it("Should deposit tokens to the contract", async function(){
        const approveTx = await hardhatToken.approve(factoryProxy.address, "100000000000000000000000");
        expect(await hardhatToken.allowance(owner, factoryProxy.address)).to.equal("100000000000000000000000");

        const depositTx = await factoryProxy.deposit("1000000000000000000");
        const userData = await factoryProxy.userData();

        expect(userData[0]).to.equal("1000000000000000000");
    });

    it("Should withdraw tokens from the contract", async function(){

        const depositTx = await factoryProxy.deposit("1000000000000000000");
        const userData = await factoryProxy.userData();

        expect(userData[0]).to.equal("1000000000000000000");
    });

    it("Should claim tokens from the contract", async function(){

        const claimTx = await factoryProxy.claimDivs();
        const userData = await factoryProxy.userData();

        expect(userData[3]).to.equal("1000000000000000000");
    });
  });