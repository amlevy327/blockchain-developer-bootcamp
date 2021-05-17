import { EVM_REVERT, ETHER_ADDRESS, ether, tokens } from './helpers'

const Exchange = artifacts.require('./Exchange');
const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
    
    let token
    let exchange
    const feePercent = 10;

    beforeEach(async () => {

        // deploy token
        token = await Token.new()

        // transfer some tokens to user1
        token.transfer(user1, tokens(100), { from: deployer })
        
        // deploy exchange 
        exchange = await Exchange.new(feeAccount, feePercent)
    })

    describe('deployment', () => {

        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount()
            result.toString().should.equal(feeAccount.toString())
        })

        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
    })

    describe('fallback', () => {

        it('reverts when Ether is sent', async () => {
            await exchange.sendTransaction({ from: user1, value: 1}).should.be.rejectedWith(EVM_REVERT)
        })
    })

    describe('depositing Ether', () => {

        let result
        let amount

        beforeEach(async () => {
            amount = ether(1)
            result = await exchange.depositEther({ from: user1, value: amount})
        })

        describe('success', () => {

            it('tracks the Ether deposit', async () => {
                let balance
                // check Ether on exchange
                balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal(amount.toString())
            })

            it('emits a Deposit event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Deposit')
                const event = log.args
                event.token.toString().should.equal(ETHER_ADDRESS, 'token address is correct')
                event.user.toString().should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal(amount.toString(), 'balance is correct')
            })
        })

        describe('failure', () => {
            
        })
    })

    describe('withdrawing Ether', () => {

        let result
        let depositAmount
        let withdrawAmount
        let balance

        beforeEach(async () => {
            depositAmount = ether(2)
            withdrawAmount = ether(1)
            await exchange.depositEther({ from: user1, value: depositAmount})
            result = await exchange.withdrawEther(withdrawAmount, { from: user1 })
        })

        describe('success', () => {

            it('tracks the Ether withdraw', async () => {
                balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal((depositAmount - withdrawAmount).toString())
            })

            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Withdraw')
                const event = log.args
                event.token.toString().should.equal(ETHER_ADDRESS, 'token address is correct')
                event.user.toString().should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(withdrawAmount.toString(), 'amount is correct')
                event.balance.toString().should.equal(balance.toString(), 'balance is correct')
            })
        })

        describe('failure', () => {
            it('rejects withdraws with insufficient balances', async() => {
                await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing tokens', () => {

        let result
        let amount

        describe('success', () => {

            beforeEach(async () => {

                amount = tokens(10)
                await token.approve(exchange.address, amount, { from: user1 })
                result = await exchange.depositToken(token.address, amount, { from: user1 })
            })
            
            it('tracks the token deposit', async () => {
                let balance
                // check exchange token balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                // check tokens on exchange
                balance = await exchange.tokens(token.address,user1)
                balance.toString().should.equal(amount.toString())
            })

            it('emits a Deposit event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Deposit')
                const event = log.args
                event.token.toString().should.equal(token.address, 'token address is correct')
                event.user.toString().should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal(amount.toString(), 'balance is correct')
            })
        })

        describe('failure', () => {

            it('rejects ether deposits', async () => {
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('fails when no tokens are approved', async () => {
                await exchange.depositToken(token.address, amount, { from: user2 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('withdrawing tokens', () => {

        let result
        let depositAmount
        let withdrawAmount
        let balance

        beforeEach(async () => {
            depositAmount = tokens(30)
            withdrawAmount = tokens(10)
            // deposit
            await token.approve(exchange.address, depositAmount, { from: user1 })
            await exchange.depositToken(token.address, depositAmount, { from: user1 })
            // withdraw
            result = await exchange.withdrawToken(token.address, withdrawAmount, { from: user1 })
        })

        describe('success', () => {

            it('tracks the token withdraw', async () => {
                // check tokens on exchange
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal((depositAmount - withdrawAmount).toString())
            })

            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Withdraw')
                const event = log.args
                event.token.toString().should.equal(token.address, 'token address is correct')
                event.user.toString().should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(withdrawAmount.toString(), 'amount is correct')
                event.balance.toString().should.equal(balance.toString(), 'balance is correct')
            })
        })

        describe('failure', () => {

            it('rejects ether deposits', async () => {
                await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('rejects withdraws with insufficient balances', async() => {
                await exchange.withdrawToken(token.address, tokens(1000), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('checking balance', () => {

        let amount
        let balance

        beforeEach(async () => {
            amount = ether(1)
            await exchange.depositEther({ from: user1, value: amount })
        })

        it('returns user balance', async () => {
            // check tokens on exchange
            balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
            balance.toString().should.equal(amount.toString())
        })
    })
})