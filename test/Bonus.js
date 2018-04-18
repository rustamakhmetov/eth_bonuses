require('truffle-test-utils').init();
require('chai').use(require('chai-as-promised')).should();
const Reverter = require('./helpers/reverter');
const Asserts = require('./helpers/asserts');
const Bonus = artifacts.require('Bonus');

contract('Bonus', function(accounts) {
    const reverter = new Reverter(web3);
    afterEach('revert', reverter.revert);

    let token;

    before('setup', () => {
        return Bonus.deployed()
            .then(instance => token = instance)
            .then(reverter.snapshot);
    });

    it('payable', async function() {
        let account1 = web3.eth.accounts[1];

        let result = await token.sendTransaction({ from: account1, gas: 50000, value: 4999});
        assert.web3Event(result, {
            event: 'Buy',
            args: {
                investor: account1,
                amount: 4999
            }
        }, 'от $0 до $5.000, бонус = 0%');

        amount = 5781;
        result = await token.sendTransaction({ from: account1, gas: 50000, value: amount});
        assert.web3Event(result, {
            event: 'Buy',
            args: {
                investor: account1,
                amount: amount + parseInt((amount * 300)/10000) //5954
            }
        }, 'от $5.000 до $50.000, бонус = 3%');

        amount = 50000;
        result = await token.sendTransaction({ from: account1, gas: 50000, value: amount});
        assert.web3Event(result, {
            event: 'Buy',
            args: {
                investor: account1,
                amount: amount + parseInt((amount * 700)/10000)
            }
        }, 'от $50.000 до $125.000, бонус = 7%;');

        amount = 125000;
        result = await token.sendTransaction({ from: account1, gas: 50000, value: amount});
        assert.web3Event(result, {
            event: 'Buy',
            args: {
                investor: account1,
                amount: amount + parseInt((amount * 1000)/10000)
            }
        }, 'от $125.000 до $200.000, бонус = 10%;');
    });

});