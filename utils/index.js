import { formatUnits } from 'lib/web3-utils'

export function capitalizeFirstLetter(str) {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1)
  return capitalized
}

export function formatLocale(value) {
  if (!value) return
  return parseFloat(formatUnits(value).replace(/,/g, ''))
}

export function formatNumber(num, digits = 4) {
  if (!num) return Number(0).toFixed(3)
  if (num < 1) {
    return Number(num).toFixed(digits)
  }
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function(item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0'
}

export function formatWEI(val) {
  return formatUnits(val || 0, {
    truncateToDecimalPlace: 3,
    replaceZeroBy: '0',
  })
}
