let Bonus = artifacts.require("./Bonus.sol");

module.exports = function(deployer) {
  deployer.deploy(Bonus);
};
