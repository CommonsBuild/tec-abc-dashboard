import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'
import { shortenAddress } from 'lib/web3-utils'
import { MainTitle } from './Helpers'

const Items = ({ currentItems }) => {
  if (!currentItems) return
  return (
    <>
      {currentItems?.map(i => {
        const [txData, setTxData] = useState(null)
        const { data } = i
        const txHash = data?.tx_hash?.match(/href="([^"]*)/)[1]?.split('/')[6]

        useEffect(() => {
          fetch(
            `https://blockscout.com/xdai/mainnet/api?module=transaction&action=gettxinfo&txhash=${txHash}`
          )
            .then(response => response.json())
            .then(res => {
              setTxData(res)
            })
        }, [txHash])

        return (
          <tr>
            <td>{txData?.result ? shortenAddress(txData.result.from) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{data.paidAmount.toFixed(2) || 0} wxDAI</td>
            <td>{data.price_per_token.toFixed(2) || 0}</td>
            <td>{data.tribute.toFixed(2) || 0}</td>
            <td>{`${data.amountBought.toFixed(2)} TEC` || 0}</td>
            <td>-</td>
            <td>{i?.data.action || ''}</td>
          </tr>
        )
      })}
    </>
  )
}

function LastTransactions({ transactions }) {
  console.log({ transactions })
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
    console.log(`Loading items from ${itemOffset} to ${endOffset}`)
    setCurrentItems(items.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(items.length / itemsPerPage))
  }, [itemOffset, itemsPerPage])

  // Invoke when user click to request another page.
  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    )
    setItemOffset(newOffset)
  }

  return (
    <div>
      <BigTitle>
        <MainTitle value={'Last Transactions'} size="32px" />
      </BigTitle>
      <TableContainer>
        <table>
          <tbody>
            <tr>
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
            nextLabel="next >"
            breakClassName="break-me"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            activeClassName="active"
          />
        </StyledPaginateContainer>
      </TableContainer>
    </div>
  )
}

const BigTitle = styled.div`
  width: 1123px;
  height: 112px;
  background: #313131;
  border-radius: 11px;
  padding: 32px 27px;
`

const TableContainer = styled.div`
  width: 1123px;
  background: #313131;
  border-radius: 11px;
  color: white;
  margin: 16px 0 0 0;
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
`

const StyledPaginateContainer = styled.div`
  .pagination {
    color: #0366d6;
  }
  .break-me {
    cursor: default;
  }
  .active {
    border-color: transparent;
    background-color: #d2f67b;
    color: black;
  }
  ul {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: 20px 0 0 0;
  }
`

export default LastTransactions
