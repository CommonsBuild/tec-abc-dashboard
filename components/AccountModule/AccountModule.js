import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import styled from 'styled-components'
import EthIdenticon from 'components/EthIdenticon/EthIdenticon'
import { useWalletAugmented } from 'lib/wallet'
import { shortenAddress } from 'lib/web3-utils'

import frame from './provider-icons/frame.svg'
import metamask from './provider-icons/metamask.svg'
import colors from '../../utils/colors'

function AccountModule() {
  const { pathname } = useRouter()
  const { account } = useWalletAugmented()
  const isAdvanced = pathname === '/'
  return (
    <BtnsContainer>
      <Link href={isAdvanced ? '/convert' : '/'}>
        <Switch isAdvanced={isAdvanced}>
          {!isAdvanced ? (
            <p style={{ color: '#ffff' }}>Advanced Page</p>
          ) : (
            <p>Simple Page</p>
          )}
          <Image
            src={isAdvanced ? '/icons/switch.svg' : '/icons/white_switch.svg'}
            width="26px"
            height="26px"
          />
        </Switch>
      </Link>
      {account ? <ConnectedMode /> : <DisconnectedMode />}
    </BtnsContainer>
  )
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function DisconnectedMode() {
  const { activate } = useWalletAugmented()
  const { pathname } = useRouter()
  const isAdvanced = pathname === '/'
  const containerRef = useRef()
  const disconnectedColor = isAdvanced ? '#d2f67b' : '#ffff'
  return (
    <ButtonBase
      ref={containerRef}
      css={`
        position: relative;
        min-width: 159px;
        height: 40px;
        border: 2px solid ${disconnectedColor};
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
                border-bottom: 0.5px solid #ffff;
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
            color: ${disconnectedColor};
            font-weight: 500;
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
    border-bottom-color: #ffff;
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
const BtnsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const Switch = styled.div`
  cursor: pointer;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 40px;
  border: 2px solid ${props => (props.isAdvanced ? '#d2f67b' : '#ffff')};
  border-radius: 10px;
  margin: 0 9px 0 0;
  padding: 13.5px 8px;
  color: #d2f67b;
  p {
    margin: 0 4px 2px 0;
  }
`

export default AccountModule
