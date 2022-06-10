# Staking

# Overview
Staking means to earn some interest over depositing tokens in contract. It have fix interest rate defined in the contract. User can deposit token and claim their rewards on daily basis through claim function. 

If user deposited tokens till 30 days, user will earn 5% interest.
If user deposited tokens till 180 days, user will earn 10% interest.
If user deposited tokens more than 180 days, user will earn 15% interest.

If user deposited more than $100's of token than users will earn 2% more reward.
If user deposited more than $500's of token than users will earn 5% more reward.
If user deposited more than $1000's of token than users will earn 10% more reward.

15% will the stable interest rate after a year.

# Smart Contracts
Smart contracts are deployed on [Rinkeby Testnet](https://rinkeby.etherscan.io)
- Dai Token : [0x98Fbb68EE19B1310Ce2CB5C222Ec2077b42104e8](https://rinkeby.etherscan.io/address/0x98Fbb68EE19B1310Ce2CB5C222Ec2077b42104e8#code)
- Staking : [0xe555641D8821eb512cA3356BA221DE2bc31B4Fe9](https://rinkeby.etherscan.io/address/0xe555641D8821eb512cA3356BA221DE2bc31B4Fe9#code)

# Note
Set wallet and rpc url in config file before running the project.

# Steps to run project

_This step presumes that node related all the prerequisites are installed in the machine._

1. Clone the Staking repo :
```
git clone https://github.com/dhavalsolulab/Staking.git
```
2. Go to the directory : 
```
cd Staking
```
3. Install dependencies :
``` 
npm i
```
4. Setup environment file for your project :
```
Check the .env.example file.
Create .env file with vim .env command
Configure all the values.
```
5. To compile the contracts : 
```
npx hardhat compile
```

# To deploy token contract
```
npx hardhat run ./scripts/deployToken.js --network rinkeby
```

# To deploy staking contract
```
npx hardhat run ./scripts/deployStaking.js --network rinkeby
```

# To verify the contract on etherscan
```
npx hardhat verify --network rinkeby {contractAddress} {constructor args in any}
```
