// app/carrera/layout.tsx
export default function CarreraLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  )
}