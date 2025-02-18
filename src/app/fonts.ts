import { Roboto_Slab } from 'next/font/google'
import { Inter } from 'next/font/google'

// ✅ Stainless Font Family
const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export { inter, robotoSlab }