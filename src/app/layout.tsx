// src/app/layout.tsx
import '../styles/globals.css'
import { inter, robotoSlab } from './fonts'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'SurveySpan',
  description: 'Create and manage surveys effectively',
}
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}