import React from 'react'
import * as Sentry from '@sentry/browser'
import NextHead from 'next/head'
import { useSpring, animated } from 'react-spring'
import { createGlobalStyle } from 'styled-components'
import { ViewportProvider } from 'use-viewport'
import { WalletProvider } from 'lib/wallet'
import '../styles/globals.css'

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'BaiJamjuree';
    src: url('/fonts/BaiJamjuree-Regular.ttf');
  }
  body,
  button {
    font-family: 'BaiJamjuree', sans-serif;
  }
  body,
  html {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
`

export default function App({ Component, pageProps }) {
  const revealProps = useSpring({
    from: { opacity: 0, transform: 'scale3d(0.98, 0.98, 1)' },
    to: { opacity: 1, transform: 'scale3d(1, 1, 1)' },
  })

  return (
    <ViewportProvider>
      <animated.div style={revealProps}>
        <NextHead>
          <title>TEC Dashboard</title>
        </NextHead>
        <GlobalStyles />
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </animated.div>
    </ViewportProvider>
  )
}
