const withFonts = require('next-fonts')
const { fullEnvironment } = require('./lib/environment')

const ENV = fullEnvironment()
// Defined by Next
delete ENV.NODE_ENV

module.exports = withFonts({
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
})
