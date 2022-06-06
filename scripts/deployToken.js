async function main() {
    const Token = await ethers.getContractFactory("Dai");
    console.log("Deploying Dai Contract. Hold Tight..");

    const token = await Token.deploy("4");
    await token.deployed();
    console.log("token deployed to address: ", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error  => {
      console.log(error);
      process.exit(1);
    })