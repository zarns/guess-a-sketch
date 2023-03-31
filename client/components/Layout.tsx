import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'goofy drawings' }: Props) => (
  <div className='bg-blue-600 min-h-screen text-white'>
    <Head>
        <link
            href="https://fonts.googleapis.com/css2?family=Permanent+Marker:wght@400;700&display=swap"
            rel="stylesheet"
        ></link>
    </Head>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
    <nav className="container mx-auto text-center py-1">
        <Link href="/" className="hover:text-yellow-300 transition duration-200">
          Home
        </Link> | {' '}
        <Link href="/about" className="hover:text-yellow-300 transition duration-200">
          About
        </Link> | {' '}
        <Link href="/users" className="hover:text-yellow-300 transition duration-200">
          Activity
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <nav className="container mx-auto text-center py-1">
        <Link href="https://mason.zarns.net" target="_self" className="hover:text-yellow-300 transition duration-200">
          Thanks for Playing!
        </Link>
      </nav>
    </footer>
  </div>
)

export default Layout
