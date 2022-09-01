import React from 'react'

function Item({ title, content }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        color: white;
      `}
    >
      <p>{title}</p>
      <p
        css={`
          margin: -14px 0 0 0;
        `}
      >
        {content}
      </p>
    </div>
  )
}

function TopContainer() {
  return (
    <>
      <div
        css={`
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 40px;
          align-items: center;
          div:nth-child(2) {
            display: flex;
            padding: 0 40px 0 0;
            border-right: 1.20548px solid #ffffff;
            height: 88px;
            justify-content: center;
          }
          div:last-child {
            border: none; /* remove border ? */
          }
        `}
      >
        <Item title="Mint Price" content="$0.00" />
        <Item title="Burn Price" content="$0.00" />
        <Item title="Entry Tribute" content="0.00%" />
        <Item title="Exit Tribute" content="0.00%" />
      </div>
    </>
  )
}

export default TopContainer
