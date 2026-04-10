// app/enlaces/layout.tsx (y app/contacto/layout.tsx)
export default function SimpleLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-gray-50">{children}</main>
}