import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import appConfig from '../micro-app-config.json'
import App from './App'

const styleCache = createCache({
  key: appConfig.appName,
})

// Mount function to start up the app
const mount = (el, noHydrate) => {
  const root = createRoot(el)
  const reactNode = (
    <CacheProvider value={styleCache}>
      <App />
    </CacheProvider>
  )

  if (noHydrate) {
    root.render(reactNode)
  } else {
    hydrateRoot(el, reactNode)
  }
}

// If we are in development and in isolation,
// call mount immediately

if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#remote_root')
  if (devRoot) {
    mount(devRoot, true)
  }
}

// We are running through container
// and we should export the mount function
export { mount }
