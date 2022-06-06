require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    'rinkeby': {
      url: 'https://rinkeby.infura.io/v3/6cbc509e3fd7443e94a3e94d5c260b38',
      accounts: ['4d93e17a7d53f6f65db0485cf805a9b5a8cdb80fce80b3ce86546249228e2789']
    }
  },
  solidity: {
    compilers:[
      {
        version: "0.5.12"
      },
      {
        version: "0.8.11"
      }],
    settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
},
etherscan: {
  // Your API key for Etherscan
  // Obtain one at https://etherscan.io/
  apiKey: "N6P8JPQE2DNBYCX9WX2E3TUFVUKJURGWZ3"
}
};
