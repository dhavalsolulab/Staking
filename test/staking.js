const { expect } = require("chai");

describe("Staking contract deploy", async function () {
    let factoryProxy;
    let daiToken;
    let owner;
    before("Deploy staking", async function () {
        [owner] = await ethers.getSigners();
        const Dai = await ethers.getContractFactory("Dai");
        daiToken = Dai.attach("0x1fBF4E64007c13e1d61391195F8D3f32A648e583");
        // daiToken = await ethers.getContractAtFromArtifact("Dai", "0x1fBF4E64007c13e1d61391195F8D3f32A648e583")

        const Stake = await ethers.getContractFactory("Stake");
        factoryProxy = await upgrades.deployProxy(Stake, ["0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF", "0x1fBF4E64007c13e1d61391195F8D3f32A648e583", "0x1fBF4E64007c13e1d61391195F8D3f32A648e583", "1314000"], {kind: 'uups'})
        // factoryProxy = Stake.attach("0x40d1A4496351fE32C391C4e4539a1296844fd95b");
        console.log("proxy address: ", factoryProxy.address);
  
    });
    it("Deposit and Reward token should be Dai", async () => {
        expect(await factoryProxy.depositToken()).to.equal(daiToken.address);
        expect(await factoryProxy.rewardToken()).to.equal(daiToken.address);
    })
    it("Reward interval should be 365 hours", async () => {
        expect(await factoryProxy.rewardInterval()).to.equal("1314000");
    })
    it("Agreegator address should be DAI/USD", async () => {
        expect(await factoryProxy.dataFeedAddress()).to.equal("0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF");
    })

    describe("Deposit tokens", async () => {
        before("Deposit 200 tokens", async () => {
            const approveTx = await daiToken.approve(factoryProxy.address, "100000000000000000000000");
            await approveTx.wait();
            // expect(await daiToken.allowance(owner.address, factoryProxy.address)).to.equal("100000000000000000000000");

            const depositTx = await factoryProxy.deposit("200000000000000000000");
            await depositTx.wait();
        })
        it("User's allowance should be 99800", async () => {
            const allowance = await daiToken.allowance(owner.address, factoryProxy.address);

            expect(allowance).to.equal("99800000000000000000000");
        })
        it("User's deposited tokens should be 200", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(userData[0]).to.equal("200000000000000000000");
        })
        it("Total staked tokens should be 200", async () => {
            const totalStaked = await factoryProxy.totalStaked();

            expect(totalStaked).to.equal("200000000000000000000");
        })
        it("Number of holders should be 1", async () => {
            const holders = await factoryProxy.getNumberOfHolders();

            expect(holders).to.equal("1");
        })
    })

    describe("Claim token after 5 minutes in progress...", async () => {
        before("Claim tokens after 5 minutes", async () => {
            function timeOut(ms) {
                return new Promise((res) => {
                    setTimeout(res, ms);
                });
            }
            await timeOut(300000).then(async () => {
                const claimTx = await factoryProxy.claimDivs();
                await claimTx.wait();
            })
        })
        it("Claimed amount should be 0.00319634703", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(parseFloat(ethers.utils.formatEther(userData[3]))).to.be.above(0.00319634703);
        })
    })

    describe("Claim token after 35 minutes in progress... Reward rate will be 12%", async () => {
        before("Claim tokens after 35 minutes", async () => {
            function timeOut(ms) {
                return new Promise((res) => {
                    setTimeout(res, ms);
                });
            }
            await timeOut(2100000).then(async () => {
                const claimTx = await factoryProxy.claimDivs();
                await claimTx.wait();
            })
        })
        it("Claimed amount should be 0.03835616437", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(parseFloat(ethers.utils.formatEther(userData[3]))).to.be.above(0.03835616437);
        })
    })

    describe("Deposit tokens", async () => {
        before("Deposit 300 tokens", async () => {

            const depositTx = await factoryProxy.deposit("300000000000000000000");
            await depositTx.wait();
        })
        it("User's allowance should be 99500", async () => {
            const allowance = await daiToken.allowance(owner.address, factoryProxy.address);

            expect(allowance).to.equal("99500000000000000000000");
        })
        it("User's deposited tokens should be 500", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(userData[0]).to.equal("500000000000000000000");
        })
        it("Total staked tokens should be 500", async () => {
            const totalStaked = await factoryProxy.totalStaked();

            expect(totalStaked).to.equal("500000000000000000000");
        })
        it("Number of holders should be 1", async () => {
            const holders = await factoryProxy.getNumberOfHolders();

            expect(holders).to.equal("1");
        })
    })

    describe("Claim token after 35 minutes in progress... Reward rate will be 15%", async () => {
        before("Claim tokens after 35 minutes", async () => {
            function timeOut(ms) {
                return new Promise((res) => {
                    setTimeout(res, ms);
                });
            }
            await timeOut(2100000).then(async () => {
                const claimTx = await factoryProxy.claimDivs();
                await claimTx.wait();
            })
        })
        it("Claimed amount should be 0.11986301369", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(parseFloat(ethers.utils.formatEther(userData[3]))).to.be.above(0.11986301369);
        })
    })
});