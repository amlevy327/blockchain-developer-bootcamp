import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from './Spinner'
import {
  loadBalances,
  depositEther,
  withdrawEther,
  depositToken,
  withdrawToken
} from '../store/interactions'
import {
  web3Selector,
  exchangeSelector,
  tokenSelector,
  accountSelector,
  etherBalanceSelector,
  tokenBalanceSelector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  balancesLoadingSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector
} from '../store/selectors'
import {
  etherDepositAmountChanged,
  etherWithdrawAmountChanged,
  tokenDepositAmountChanged,
  tokenWithdrawAmountChanged
} from '../store/actions'

const depositForm = (props) => {
  const {
    etherBalance,
    tokenBalance,
    exchangeEtherBalance,
    exchangeTokenBalance
  } = props
  
  return(
    <div>
      <table className="table table-dark table-sm small">
        <thead>
          <tr>
            <th>Token</th>
            <th>Wallet</th>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ETH</td>
            <td>{etherBalance}</td>
            <td>{exchangeEtherBalance}</td>
          </tr>
        </tbody>
      </table>
      { etherDepositField(props) }
      <table className="table table-dark table-sm small">
        <tbody>
          <tr>
            <td>AML</td>
            <td>{tokenBalance}</td>
            <td>{exchangeTokenBalance}</td>
          </tr>
        </tbody>
      </table>
      { tokenDepositField(props) }
    </div>
  )
}

const withdrawForm = (props) => {
  const {
    etherBalance,
    tokenBalance,
    exchangeEtherBalance,
    exchangeTokenBalance
  } = props
  
  return(
    <div>
      <table className="table table-dark table-sm small">
        <thead>
          <tr>
            <th>Token</th>
            <th>Wallet</th>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ETH</td>
            <td>{etherBalance}</td>
            <td>{exchangeEtherBalance}</td>
          </tr>
        </tbody>
      </table>
      { etherWithdrawField(props) }
      <table className="table table-dark table-sm small">
        <tbody>
          <tr>
            <td>AML</td>
            <td>{tokenBalance}</td>
            <td>{exchangeTokenBalance}</td>
          </tr>
        </tbody>
      </table>
      { tokenWithdrawField(props) }
    </div>
  )
}

const etherDepositField = (props) => {
  const {
    dispatch,
    exchange,
    web3,
    etherDepositAmount,
    account
  } = props

  return(
    <form className="row" onSubmit={(event) => {
      event.preventDefault()
      depositEther(dispatch, exchange, web3, etherDepositAmount, account)
    }}>
      <div className="col-12 col-sm pr-sm-2">
        <input
        type="text"
        placeholder="ETH amount"
        onChange={(e) => dispatch(etherDepositAmountChanged(e.target.value))}
        className="form-control form-control-sm bg-dark text-white"
        required />
      </div>
      <div className="col-12 col-sm-auto pl-sm-0">
        <button type="submit" className="btn btn-primary btn-black btm-sm">Deposit</button>
      </div>
  </form>
  )
}

const etherWithdrawField = (props) => {
  const {
    dispatch,
    exchange,
    web3,
    etherWithdrawAmount,
    account
  } = props

  return(
    <form className="row" onSubmit={(event) => {
      event.preventDefault()
      withdrawEther(dispatch, exchange, web3, etherWithdrawAmount, account)
    }}>
      <div className="col-12 col-sm pr-sm-2">
        <input
        type="text"
        placeholder="ETH amount"
        onChange={(e) => dispatch(etherWithdrawAmountChanged(e.target.value))}
        className="form-control form-control-sm bg-dark text-white"
        required />
      </div>
      <div className="col-12 col-sm-auto pl-sm-0">
        <button type="submit" className="btn btn-primary btn-black btm-sm">Withdraw</button>
      </div>
  </form>
  )
}

const tokenDepositField = (props) => {
  const {
    dispatch,
    exchange,
    web3,
    token,
    tokenDepositAmount,
    account
  } = props

  return(
    <form className="row" onSubmit={(event) => {
      event.preventDefault()
      depositToken(dispatch, exchange, web3, token, tokenDepositAmount, account)
    }}>
      <div className="col-12 col-sm pr-sm-2">
        <input
        type="text"
        placeholder="AML amount"
        onChange={(e) => dispatch(tokenDepositAmountChanged(e.target.value))}
        className="form-control form-control-sm bg-dark text-white"
        required />
      </div>
      <div className="col-12 col-sm-auto pl-sm-0">
        <button type="submit" className="btn btn-primary btn-black btm-sm">Deposit</button>
      </div>
  </form>
  )
}

const tokenWithdrawField = (props) => {
  const {
    dispatch,
    exchange,
    web3,
    token,
    tokenWithdrawAmount,
    account
  } = props

  return(
    <form className="row" onSubmit={(event) => {
      event.preventDefault()
      withdrawToken(dispatch, exchange, web3, token, tokenWithdrawAmount, account)
    }}>
      <div className="col-12 col-sm pr-sm-2">
        <input
        type="text"
        placeholder="AML amount"
        onChange={(e) => dispatch(tokenWithdrawAmountChanged(e.target.value))}
        className="form-control form-control-sm bg-dark text-white"
        required />
      </div>
      <div className="col-12 col-sm-auto pl-sm-0">
        <button type="submit" className="btn btn-primary btn-black btm-sm">Withdraw</button>
      </div>
  </form>
  )
}

const showForm = (props) => {

  return(
    <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
      
      <Tab eventKey="deposit" title="Deposit" className="bg-dark">
        { depositForm(props) }
      </Tab>
      <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
        { withdrawForm(props) }
      </Tab>
    </Tabs>
  )
}

class Balance extends Component {
  
  componentWillMount() {
    this.loadBlockchainData()
  }

  componentWillReceiveProps() {
    this.loadBlockchainData()
} 
  
  async loadBlockchainData() {
    const { dispatch, web3, exchange, token, account } = this.props
    await loadBalances(dispatch, web3, exchange, token, account)
  }

  render() {
    return (
      <div className="card bg-dark text-white">
          <div className="card-header">
              Balances
          </div>
          <div className="card-body">
            { this.props.showForm ? showForm(this.props) : <Spinner /> }
          </div>
      </div>
    )
    }
  }
  
  function mapStateToProps(state) {
    const balancesLoading = balancesLoadingSelector(state)
    
    return {
      web3: web3Selector(state),
      exchange: exchangeSelector(state),
      token: tokenSelector(state),
      account: accountSelector(state),
      etherBalance: etherBalanceSelector(state),
      tokenBalance: tokenBalanceSelector(state),
      exchangeEtherBalance: exchangeEtherBalanceSelector(state),
      exchangeTokenBalance: exchangeTokenBalanceSelector(state),
      etherDepositAmount: etherDepositAmountSelector(state),
      etherWithdrawAmount: etherWithdrawAmountSelector(state),
      tokenDepositAmount: tokenDepositAmountSelector(state),
      tokenWithdrawAmount: tokenWithdrawAmountSelector(state),
      balancesLoading,
      showForm: !balancesLoading
    }
  }
  
  export default connect(mapStateToProps)(Balance)