const { expect } = require("chai");

describe("Staking contract deploy", async function () {
    let factoryProxy;
    let daiToken;
    let owner;
    before("Deploy staking", async function () {
        [owner] = await ethers.getSigners();
        const Dai = await ethers.getContractFactory("Dai");
        daiToken = await Dai.deploy("4");
        await daiToken.deployed();
        // daiToken = Dai.attach("0x1fBF4E64007c13e1d61391195F8D3f32A648e583");

        const Stake = await ethers.getContractFactory("Stake");
        factoryProxy = await upgrades.deployProxy(Stake, ["0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF", daiToken.address, daiToken.address, "1314000"], {kind: 'uups'})
        // factoryProxy = Stake.attach("0x40d1A4496351fE32C391C4e4539a1296844fd95b");

        const mintTx = await daiToken.mint(owner.address, "100000000000000000000000");
        mintTx.wait();

  
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

    describe("Deposit tokens without approve", async () => {
            
        it("Deposit trasaction should revert", async () => {
            await expect(factoryProxy.deposit("200000000000000000000")).to.be.reverted;
        })
    })

    describe("Deposit 200 tokens with approve", async () => {
        before("Deposit 200 tokens", async () => {
            const trasnferTx = await daiToken.transfer(factoryProxy.address, "10000000000000000");
            trasnferTx.wait();
            const approveTx = await daiToken.approve(factoryProxy.address, "100000000000000000000000");
            await approveTx.wait();
            // expect(await daiToken.allowance(owner.address, factoryProxy.address)).to.equal("100000000000000000000000");

            const depositTx = await factoryProxy.deposit("200000000000000000000");
            await depositTx.wait();
        })
        it("User's deposited tokens should be 200", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(userData[0]).to.equal("200000000000000000000");
        })
    })

    describe("Withdraw more tokens than deposited", async () => {
        it("Withdraw 201 tokens should reverted", async () => {
            await expect(factoryProxy.withdraw("201000000000000000000")).to.be.reverted;
        })
    })

    describe("Withdraw 200 tokens", async () => {
        before("withdraw", async () => {
            const withdrawTx = await factoryProxy.withdraw("200000000000000000000");
            withdrawTx.wait();
        })

        
        // it("Withdraw 200 tokens and user's deposited tokens should be 0", async () => {
        //     const userData = await factoryProxy.userData(owner.address);

        //     expect(userData[0]).to.equal("0");
        // })
    })

    describe("Deposit tokens", async () => {

        before("Deposit 200 tokens and claim", async () => {
            // const approveTx = await daiToken.approve(factoryProxy.address, "100000000000000000000000");
            // await approveTx.wait();
            // expect(await daiToken.allowance(owner.address, factoryProxy.address)).to.equal("100000000000000000000000");

            const depositTx = await factoryProxy.deposit("200000000000000000000");
            await depositTx.wait();
        })
        it("User's allowance should be 99600", async () => {
            const allowance = await daiToken.allowance(owner.address, factoryProxy.address);

            expect(allowance).to.equal("99600000000000000000000");
        })
        it("User's deposited tokens should be 400", async () => {
            const userData = await factoryProxy.userData(owner.address);

            expect(userData[0]).to.equal("400000000000000000000");
        })
        it("Total staked tokens should be 400", async () => {
            const totalStaked = await factoryProxy.totalStaked();

            expect(totalStaked).to.equal("400000000000000000000");
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