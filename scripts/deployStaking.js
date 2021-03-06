async function main() {
    const Factory = await ethers.getContractFactory("Stake");
    console.log("Deploying Proxy Contract. Hold Tight..");
    const factoryProxy = await upgrades.deployProxy(Factory, ["0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF", "0x98Fbb68EE19B1310Ce2CB5C222Ec2077b42104e8", "0x98Fbb68EE19B1310Ce2CB5C222Ec2077b42104e8", "1314000"], {kind: 'uups'})
    console.log("proxy address: ", factoryProxy.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error  => {
      console.log(error);
      process.exit(1);
    })