var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};
var Tests = artifacts.require("./Tests.sol");

module.exports = function(deployer) {
  deployer.deploy(Tests);
};
