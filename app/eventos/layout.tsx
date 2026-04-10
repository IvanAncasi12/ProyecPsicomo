// app/eventos/layout.tsx
export default function EventosLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <main className="min-h-screen bg-gray-50">{children}</main>
}