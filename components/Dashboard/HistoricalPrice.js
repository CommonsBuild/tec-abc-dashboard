import React from 'react'
import { SplitContainer, Title, Display } from './Helpers'

function HistoricalPrice() {
  const leftContent = () => {
    return (
      <div>
        <Title value="Historical Price" />
        <div
          css={`
            margin: 43.5px 0 0 0;
          `}
        >
          <Display title="Mint" content={'2 USD'} />
          <Display title="Burn" content={'0.80 USD'} />
        </div>
      </div>
    )
  }

  const rightContent = () => {
    return <div>right</div>
  }

  return (
    <SplitContainer leftContent={leftContent()} rightContent={rightContent()} />
  )
}

export default HistoricalPrice
