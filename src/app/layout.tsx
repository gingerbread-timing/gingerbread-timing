import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Profile from './homecomponents/usernamebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GingerBread Timing',
  description: 'WE DO BE RACING',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
        <div className='navbar'>
          <Link href="/"><h2>Home</h2></Link>
          <Profile/>
        </div>
        <ToastContainer position='top-center' autoClose={5000} closeOnClick theme='light'/>
          {children}
          </body>
      </html>
    </UserProvider>
  )
}
