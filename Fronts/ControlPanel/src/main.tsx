import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AppContextProvider } from './Context/AppContext.tsx'

import "@mantine/notifications/styles.css"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <MantineProvider>
          <Notifications />
          <App />
        </MantineProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
