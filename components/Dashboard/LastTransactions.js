import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'
import { shortenAddress } from 'lib/web3-utils'
import { MainTitle } from './Helpers'

const Items = ({ currentItems }) => {
  const [items, setItems] = useState(null)
  const getTx = async txHash => {
    return fetch(
      `https://blockscout.com/xdai/mainnet/api?module=transaction&action=gettxinfo&txhash=${txHash}`
    )
      .then(response => response.json())
      .then(res => res)
  }

  useEffect(() => {
    const getHashes = async () => {
      if (!currentItems) return
      let itemsArray = []
      await Promise.all(
        currentItems.map(async i => {
          const { data } = i
          const txHash = data?.tx_hash?.match(/href="([^"]*)/)[1]?.split('/')[6]
          const hash = await getTx(txHash)
          itemsArray.push({ ...data, hash })
        })
      )
      setItems(itemsArray)
    }
    getHashes()
  }, [currentItems])

  return items
    ? items.map(data => {
        return (
          <tr>
            <td>{data?.hash ? shortenAddress(data.hash.result.from) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{data.paidAmount.toFixed(2) || 0} wxDAI</td>
            <td>{data.price_per_token.toFixed(2) || 0}</td>
            <td>{data.tribute.toFixed(2) || 0}</td>
            <td>{`${data.amountBought.toFixed(2)} TEC` || 0}</td>
            <td>-</td>
            <td>{data.action || ''}</td>
          </tr>
        )
      })
    : null
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
