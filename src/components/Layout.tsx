import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import WorkbaseLogo from '@/components/WorkbaseLogo'
import { Tooltip } from '@/components/ui'

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-[#1a1a1f]">
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 px-4 flex items-center justify-between bg-[#1e1e24]/95 border-b border-zinc-700/40 backdrop-blur-xl shrink-0">
        <Tooltip label="Menu">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-3 -ml-2 text-zinc-400 hover:text-white transition-colors rounded-lg active:bg-zinc-800/80"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </Tooltip>
        <div className="flex items-center gap-2">
          <WorkbaseLogo size="sm" />
          <span className="font-semibold text-white">Workbase</span>
        </div>
        <div className="w-10" aria-hidden />
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 min-h-0 pt-14 md:pt-0 overflow-auto">
        <div className="w-full min-w-0 px-4 py-4 sm:py-5 md:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
