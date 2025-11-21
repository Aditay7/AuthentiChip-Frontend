import Sidebar from '../Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary text-white flex">
      <Sidebar />
      <main className="flex-1 min-h-screen p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">{children}</div>
      </main>
    </div>
  )
}


