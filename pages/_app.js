import React, { useEffect } from 'react'
import * as Sentry from '@sentry/browser'
import { useRouter } from 'next/router'
import NextHead from 'next/head'
import { useSpring, animated } from 'react-spring'
import { createGlobalStyle } from 'styled-components'
import { ViewportProvider } from 'use-viewport'
import { WalletProvider } from 'lib/wallet'
import NProgress from 'nprogress'
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
  const router = useRouter()
  const revealProps = useSpring({
    from: { opacity: 0, transform: 'scale3d(0.98, 0.98, 1)' },
    to: { opacity: 1, transform: 'scale3d(1, 1, 1)' },
  })

  useEffect(() => {
    const handleStart = url => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

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
