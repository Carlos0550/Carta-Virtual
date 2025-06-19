import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AppContextProvider } from './Context/AppContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "@mantine/notifications/styles.css"

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <MantineProvider>
            <Notifications />
            <App />
          </MantineProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
