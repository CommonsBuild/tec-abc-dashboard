import React from 'react'
import PropTypes from 'prop-types'
import AccountModule from 'components/AccountModule/AccountModule'
import dynamic from 'next/dynamic'

const Logo = dynamic(() => import('components/Logo/Logo'), {
  ssr: false,
})

function NavBar({ logoMode }) {
  return (
    <div
      css={`
        width: 100vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 16px 40px 0 40px;
      `}
    >
      <Logo mode={logoMode} />
      <div
        css={`
          z-index: 5;
        `}
      >
        <AccountModule />
      </div>
    </div>
  )
}

NavBar.propTypes = {
  logoMode: PropTypes.string,
}

export default NavBar
