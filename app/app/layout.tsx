// This layout wraps all protected /app/* routes
// Phase 2 will add: sidebar navigation, top bar, and full design system
// For now it's a plain passthrough so the route structure is established

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Phase 2: Sidebar + TopBar will go here */}
      <main className="p-6">{children}</main>
    </div>
  )
}
