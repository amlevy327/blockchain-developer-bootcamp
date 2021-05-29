import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import {
  exchangeSelector,
  tokenSelector,
  web3Selector,
  accountSelector,
  buyOrderSelector,
  sellOrderSelector
} from '../store/selectors'
import {
  buyOrderAmountChanged,
  buyOrderPriceChanged,
  sellOrderAmountChanged,
  sellOrderPriceChanged
} from '../store/actions'
import {
  makeBuyOrder,
  makeSellOrder
} from '../store/interactions'

const buyForm = (props) => {
  const {
    dispatch,
    exchange,
    token,
    web3,
    account,
    buyOrder,
    showBuyTotal
  } = props

  return(
    <form onSubmit={(event) => {
      event.preventDefault()
      makeBuyOrder(dispatch, exchange, web3, token, buyOrder, account)
    }}>
      <div className="form-group small">
        <label>Buy Amount (AML)</label>
        <div className="input-group"></div>
          <input
          type="text"
          placeholder="Buy Amount"
          onChange={(e) => dispatch(buyOrderAmountChanged(e.target.value))}
          className="form-control form-control-sm bg-dark text-white"
          required
          />
        </div>
        <div className="form-group small">
          <label>Buy Price</label>
          <div className="input-group"></div>
            <input
            type="text"
            placeholder="Buy Price"
            onChange={(e) => dispatch(buyOrderPriceChanged(e.target.value))}
            className="form-control form-control-sm bg-dark text-white"
            required
            />
        </div>
        <button type="submit" className="btn btn-primary btm-sm btn-black">Buy Order</button>
        { showBuyTotal ? <small>Total: {buyOrder.price * buyOrder.amount} ETH</small> : null }
    </form>
  )
}

const sellForm = (props) => {
  const {
    dispatch,
    exchange,
    token,
    web3,
    account,
    sellOrder,
    showSellTotal
  } = props

  return(
    <form onSubmit={(event) => {
      event.preventDefault()
      makeSellOrder(dispatch, exchange, web3, token, sellOrder, account)
    }}>
      <div className="form-group small">
        <label>Sell Amount (AML)</label>
        <div className="input-group"></div>
          <input
          type="text"
          placeholder="Sell Amount"
          onChange={(e) => dispatch(sellOrderAmountChanged(e.target.value))}
          className="form-control form-control-sm bg-dark text-white"
          required
          />
        </div>
        <div className="form-group small">
          <label>Sell Price</label>
          <div className="input-group"></div>
            <input
            type="text"
            placeholder="Sell Price"
            onChange={(e) => dispatch(sellOrderPriceChanged(e.target.value))}
            className="form-control form-control-sm bg-dark text-white"
            required
            />
        </div>
        <button type="submit" className="btn btn-primary btm-sm btn-black">Sell Order</button>
        { showSellTotal ? <small>Total: {sellOrder.price * sellOrder.amount} ETH</small> : null }
    </form>
  )
}

const showForm = (props) => {
  return(
    <Tabs defaultActiveKey="buy" className="bg-dark text-white">
      <Tab eventKey="buy" title="Deposit" className="bg-dark">
        { showForm ? buyForm(props) : <Spinner />}
      </Tab>
      <Tab eventKey="sell" title="Sell" className="bg-dark">
        { showForm ? sellForm(props) : <Spinner />}
      </Tab>
    </Tabs>
  )
}

class NewOrder extends Component {
  
  render() {
    return (
      <div className="card bg-dark text-white">
          <div className="card-header">
              New Order
          </div>
          <div className="card-body">
            { showForm(this.props) }
          </div>
      </div>
    )
    }
  }
  
  function mapStateToProps(state) {
    const buyOrder = buyOrderSelector(state)
    const sellOrder = sellOrderSelector(state)

    return {
      exchange: exchangeSelector(state),
      token: tokenSelector(state),
      web3: web3Selector(state),
      account: accountSelector(state),
      buyOrder,
      sellOrder,
      showForm: !buyOrder.making && !sellOrder.making,
      showBuyTotal: buyOrder.amount && buyOrder.price,
      showSellTotal: sellOrder.amount && sellOrder.price
    }
  }
  
  export default connect(mapStateToProps)(NewOrder)