// app/eventos/page.tsx
import Link from 'next/link'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function EventosPage() {
  const opciones = [
    { 
      titulo: 'Eventos', 
      href: '/eventos/eventos', 
      icono: '📅', 
      desc: 'Todos los eventos institucionales',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      titulo: 'Talleres', 
      href: '/eventos/talleres', 
      icono: '🎯', 
      desc: 'Talleres, congresos y conferencias',
      color: 'from-purple-500 to-pink-600'
    },
  ]

  return (
    <>
      <PortadaSeccion titulo="Eventos" subtitulo="Actividades académicas y culturales" />
      
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {opciones.map((op) => (
              <Link 
                key={op.titulo} 
                href={op.href}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`h-64 bg-gradient-to-br ${op.color} flex flex-col items-center justify-center p-6`}>
                  <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {op.icono}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{op.titulo}</h3>
                  <p className="text-white/90 text-center">{op.desc}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}