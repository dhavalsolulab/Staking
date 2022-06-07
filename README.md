# Staking

# Note
Set wallet and rpc url in config file before running the project.

# Steps to run project
1. npm i
2. npx hardhat compile

# To deploy token contract
npx hardhat run ./scripts/deployToken.js --network rinkeby

# To deploy staking contract
npx hardhat run ./scripts/deployStaking.js --network rinkeby

# To verify the contract on etherscan
npx hardhat verify --network rinkeby {contractAddress} {constructor args in any}

