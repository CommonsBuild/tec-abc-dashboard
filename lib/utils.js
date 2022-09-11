import { utils as EthersUtils } from 'ethers'
import env from './environment'

export function getBlockExplorerHref(transactionHash) {
  const chainId = env('CHAIN_ID')

  switch (chainId) {
    case '1':
      return `https://etherscan.io/tx/${transactionHash}`
    case '4':
      return `https://rinkeby.etherscan.io/tx/${transactionHash}`
    case '100':
      return `https://blockscout.com/poa/xdai/tx/${transactionHash}`
  }
}

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}
