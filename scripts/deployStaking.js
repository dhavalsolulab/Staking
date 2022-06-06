async function main() {
    const Factory = await ethers.getContractFactory("Stake");
    console.log("Deploying Proxy Contract. Hold Tight..");
    const factoryProxy = await upgrades.deployProxy(Factory, ["0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF", "0x783b5aF21Fd4e99cF98ebE469A2F63dcfdE6C738", "0x783b5aF21Fd4e99cF98ebE469A2F63dcfdE6C738", "86400"], {kind: 'uups'})
    console.log("proxy address: ", factoryProxy.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error  => {
      console.log(error);
      process.exit(1);
    })