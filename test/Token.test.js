import { EVM_REVERT, tokens } from './helpers'

const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver]) => {

    const name = 'Andrew Token'
        const symbol = 'AML'
        const decimals = '18'
        const totalSupply = tokens(1000000).toString()
        let token
        
    beforeEach(async () => {
        token = await Token.new({ from: deployer })
    })

    describe('deployment', () => {

        it('tracks the name', async () => {
            const result = await token.name()
            result.should.equal(name)
        })

        it('tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('tracks the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the total supply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply)
        })

        it('assigns total supply to deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply)
        })
    })

    describe('sending tokens', () => {

        let result
        let amount

        describe('success', async () => {
            
            beforeEach(async () => {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, { from: deployer })
            })
    
            it('transfers token balances', async () => {
                let deployerBalance = await token.balanceOf(deployer)
                let receiverBalance = await token.balanceOf(receiver)
                deployerBalance.toString().should.equal('999900000000000000000000')
                receiverBalance.toString().should.equal('100000000000000000000')
            })
    
            it('emits a transfer event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct')
                event.to.toString().should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
        })

        describe('failure', async () => {

            it('rejects insufficient balances', async () => {
                let invalidAmount
                
                invalidAmount = tokens(100000000) // larger than total supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
                
                invalidAmount = tokens(10)
                await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
            })

            it('rejects invalid recipients', async () => {
                await token.transfer(0x0, amount).should.be.rejected
            })
        })
    })
})