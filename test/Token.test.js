const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {

    describe('deployement', () => {
        const name = 'My Name'
        const symbol = 'Symnol'
        const decimals = 'Decimals'
        const totalSupply = 'Total Supply'
        let token
        
        beforeEach(async () => {
            token = await Token.new()
        })
        
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
            result.should.equal(decimals)
        })

        it('tracks the total supply', async () => {
            const result = await token.totalSupply()
            result.should.equal(totalSupply)
        })
    })
})