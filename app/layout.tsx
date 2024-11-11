import Sidebar from '@/components/Sidebar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a]">
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar className="w-1/4 min-w-[250px]" />
          <main className="w-3/4 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}