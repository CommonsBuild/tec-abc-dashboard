import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import styled from 'styled-components'
import EthIdenticon from 'components/EthIdenticon/EthIdenticon'
import { useWalletAugmented } from 'lib/wallet'
import { shortenAddress } from 'lib/web3-utils'

import frame from './provider-icons/frame.svg'
import metamask from './provider-icons/metamask.svg'
import colors from '../../utils/colors'
import lightning from './lightning.svg'
import Image from 'next/image'

function AccountModule() {
  const { account } = useWalletAugmented()
  return account ? <ConnectedMode /> : <DisconnectedMode />
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function DisconnectedMode() {
  const { activate } = useWalletAugmented()

  const containerRef = useRef()

  return (
    <ButtonBase
      ref={containerRef}
      css={`
        position: relative;
        width: 159px;
        height: 40px;
        border: 2px solid #d2f67b;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        background: transparent !important;
      `}
    >
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
        overlay={
          <StyledPopover
            css={`
              position: absolute;
              left: 0;
            `}
          >
            <div
              css={`
                position: relative;
                width: 100%;
                height: 32px;
                border-bottom: 0.5px solid #dde4e8;
                text-transform: uppercase;
                color: #637381;
              `}
            >
              <span
                css={`
                  display: block;
                  width: 100%;
                  padding-top: 8px;
                  padding-left: 16px;
                  padding-bottom: 8px;
                  font-size: 12px;
                `}
              >
                Ethereum Providers
              </span>
              <div
                css={`
                  display: grid;
                  grid-gap: 10px;
                  grid-auto-flow: row;
                  grid-template-columns: repeat(2, 1fr);
                  padding: 16px;
                `}
              >
                <ProviderButton
                  name="Metamask"
                  onActivate={() => activate('injected')}
                  image={metamask}
                />
                <ProviderButton
                  name="Frame"
                  onActivate={() => activate('frame')}
                  image={frame}
                />
              </div>
            </div>
          </StyledPopover>
        }
      >
        <div
          css={`
            font-size: 16px;
            font-weight: medium;
            background: transparent;
            color: ${colors.primary};
          `}
        >
          Connect Wallet
        </div>
      </OverlayTrigger>
    </ButtonBase>
  )
}

function ProviderButton({ name, onActivate, image }) {
  return (
    <ButtonBase
      onClick={onActivate}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        color: #1c1c1c;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 96px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        text-transform: capitalize;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <Image src={image} alt="" width="42px" height="42px" />
      <div
        css={`
          margin-top: 8px;
        `}
      >
        {name}
      </div>
    </ButtonBase>
  )
}

ProviderButton.propTypes = {
  name: PropTypes.string,
  onActivate: PropTypes.func,
  image: PropTypes.string,
}

function ConnectedMode() {
  const { account, deactivate } = useWalletAugmented()
  const containerRef = useRef()

  return (
    <Container ref={containerRef}>
      <ButtonBase
        css={`
          position: relative;
          background: rgba(255, 255, 255, 0.5);
          &:active {
            top: 1px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
        onClick={deactivate}
      >
        <div
          css={`
            position: relative;
          `}
        >
          <EthIdenticon address={account} scale={1} radius={4} />
        </div>
        <Address>{shortenAddress(account)}</Address>
      </ButtonBase>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 40px;
`
const StyledPopover = styled(Popover)`
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 7px 24px rgba(0, 0, 0, 0.25);
  border: 0 solid transparent;
  width: 410px;
  max-width: 90vw;
  height: 165px;
  left: 982px;
  top: 103px;

  &.bs-popover-bottom .arrow::after {
    border-bottom-color: #f9fafc;
  }
  &.bs-popover-bottom .arrow::before {
    border-bottom-color: transparent;
  }

  div.header {
    background: #f9fafc;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      line-height: 32px;
      padding: 0;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      text-align: right;
      color: #7fdfa6;
      margin: 0;
    }
    button {
      background: transparent;
      border: 0;
      cursor: pointer;
      color: #637381;
    }
    button:hover {
      color: #212b36;
    }
  }
  span {
    top: 0px;
  }
`

const Address = styled.div`
  font-size: 18px;
  line-height: 31px;
  color: #1c1c1c;
  padding-left: 8px;
  padding-right: 4px;
  font-family: monospace;
`

const ButtonBase = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  padding: 0 8px 0 16px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  cursor: pointer;
`

export default AccountModule
