import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0';

function App({ Component, pageProps }: AppProps) {
  return <UserProvider>
    <a href="/api/auth/login">Login</a>
      <Component {...pageProps} />
    </UserProvider>
}

export default App
