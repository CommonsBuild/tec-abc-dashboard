import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'
import { shortenAddress } from 'lib/web3-utils'
import { MainTitle } from './Helpers'
import { useCollateral } from 'lib/web3-contracts'
import { collateral, bonded } from '../../config'

const Items = ({ currentItems }) => {
  return currentItems
    ? currentItems.map(data => {
        const d = new Date(parseInt(data.timestamp) * 1000)
        const isSell = !!data?.burnPrice
        const purchase = data[isSell ? 'sellAmount' : 'purchaseAmount']
        const action = isSell ? 'Sell' : 'Buy'
        const price = data[isSell ? 'burnPrice' : 'mintPrice'] / 1e6
        const newPrice = data?.newPrice / 1e6

        const txUrl = `https://blockscout.com/xdai/mainnet/tx/${data.hash}`
        return (
          <tr>
            <td>{moment(d).format('MMM Do YY')}</td>
            <td>
              <a href={txUrl} target="_blank" rel="noreferrer">
                {data?.id ? shortenAddress(data.id) : '-'}
              </a>
            </td>
            <td>
              {(data.reserveBalance / 1e18).toLocaleString('en-US', {
                maximumFractionDigits: 1,
              })}
            </td>
            <td>
              {(data.supplyBalance / 1e18).toLocaleString('en-US', {
                maximumFractionDigits: 1,
              })}
            </td>
            <td>
              {(purchase / 1e18).toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              }) || 0}{' '}
              {isSell ? bonded.symbol : collateral.symbol}
            </td>
            <td>
              {price.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              }) || 0}
            </td>
            <td>
              {(data.fee / 1e18).toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              }) || 0}
            </td>
            <td>
              {`${(data.returnedAmount / 1e18).toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })} ${isSell ? collateral.symbol : bonded.symbol}` || 0}
            </td>
            <td>
              {newPrice
                ? newPrice.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                  })
                : '-'}
            </td>
            <td>{action || ''}</td>
          </tr>
        )
      })
    : null
}

function LastTransactions({ transactions }) {
  const [virtualBalance, virtualSupply, reserveRatio] = useCollateral()
  const itemsPerPage = 10
  const items = transactions
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0)

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage
    setCurrentItems(items.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(items.length / itemsPerPage))
  }, [itemOffset, itemsPerPage])

  // Invoke when user click to request another page.
  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    setItemOffset(newOffset)
  }

  return (
    <Container>
      <BigTitle>
        <MainTitle value={'Last Transactions'} size="32px" />
      </BigTitle>
      <TableContainer>
        <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Reserve {`(wxDAI)`}</th>
              <th>Total Supply {`(TEC)`}</th>
              <th>Amount In</th>
              <th>Price</th>
              <th>Tribute</th>
              <th>Amount Out</th>
              <th>New Price</th>
              <th>Action</th>
            </tr>
            <Items currentItems={currentItems} />
          </tbody>
        </table>
        <StyledPaginateContainer>
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            breakClassName="break-me"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            activeClassName="active"
          />
        </StyledPaginateContainer>
      </TableContainer>
    </Container>
  )
}

const Container = styled.div`
  @media screen and (max-width: 1100px) {
    display: none;
  }
`

const BigTitle = styled.div`
  width: 100%;
  height: 112px;
  background: #313131;
  border-radius: 11px;
  padding: 32px 27px;
  margin: 0 0 16px 0;
`

const TableContainer = styled.div`
  width: 1123px;
  overflow-x: auto;
  background: #313131;
  border-radius: 11px;
  color: white;
  padding: 39px;

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  th {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #d2f67b;
    padding: 10px;
  }

  td {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    padding: 24px 8px;
  }

  th,
  td {
    text-align: left;
    border-bottom: 1px solid white;
  }

  a {
    text-decoration: underline;
  }
  a:hover {
    color: #d2f67b;
  }
`

const StyledPaginateContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 25px 0 0 0;
  a {
    display: flex;
    width: 32px;
    height: 100%;
    justify-content: center;
    align-items: center;
    border: 2px solid #f1f3f7 !important;
    padding: 6px;
  }
  .pagination {
    color: #0366d6;
  }
  .break-me {
    cursor: default;
    align-self: flex-end;
    a {
      border: none !important;
    }
  }
  .break-me:hover {
    a {
      border: none !important;
    }
  }
  .active {
    a {
      color: #d2f67b !important;
      border: 2px solid #d2f67b !important;
    }
  }
  ul {
    display: flex;
    flex-direction: row;
    gap: 4px;
    margin: 20px 0 0 0;
  }
  li:first-child,
  li:last-child {
    a {
      border: none !important;
      color: #f1f3f7 !important;
      text-decoration: none;
    }
  }
  li:hover {
    * {
      cursor: pointer;
      color: #d2f67b !important;
      border: 2px solid #d2f67b !important;
      text-decoration: none;
    }
  }
`

export default LastTransactions
