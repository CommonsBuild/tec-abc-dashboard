import React from 'react'
import { keyframes, css } from 'styled-components'
import { ABSOLUTE_FILL } from 'lib/css-utils'
import token from '../assets/token.svg'
import Image from 'next/image'

const spinAnimation = css`
  mask-image: linear-gradient(35deg, transparent 15%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 1.25s linear infinite;
`

const FullPageLoader = () => {
  return (
    <div
      css={`
        width: 110px;
        margin-bottom: 25px;
      `}
    >
      <div
        css={`
          position: relative;
          width: 100%;
          padding-top: 100%;
        `}
      >
        <div
          css={`
            ${ABSOLUTE_FILL}

            display: flex;

            align-items: center;
            justify-content: center;
          `}
        >
          <div
            css={`
              position: absolute;

              top: 50%;
              left: 50%;

              transform: translate(-50%, -50%);

              line-height: 1;
              color: #ffffff;
              font-size: 24px;
              font-weight: 600;

              z-index: 1;
            `}
          >
            <Image
              src={token}
              alt="TEC Token Logo"
              width="64px"
              height="64px"
            />
          </div>

          <div
            css={`
              ${ABSOLUTE_FILL}

              border-radius: 100%;

              border: 2px solid #defb48;

              ${spinAnimation};
            `}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default FullPageLoader
