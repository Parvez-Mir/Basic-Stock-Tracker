import "./globals.css"

export const metadata = {
  title: "Stock Tracker Dashboard",
  description: "Inventory management dashboard",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
