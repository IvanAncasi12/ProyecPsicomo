// app/academico/page.tsx
import Link from 'next/link'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function AcademicoPage() {
  const opciones = [
    { titulo: 'Cursos', href: '/academico/cursos', icono: '📚', desc: 'Talleres y capacitaciones continuas' },
    { titulo: 'Seminarios', href: '/academico/seminarios', icono: '🎓', desc: 'Espacios de debate y especialización' },
    { titulo: 'Convocatorias', href: '/academico/convocatorias', icono: '📢', desc: 'Llamados oficiales y oportunidades' },
    { titulo: 'Ofertas Académicas', href: '/academico/ofertas-academicas', icono: '🎯', desc: 'Programas de admisión y estudio' },
    { titulo: 'Gacetas', href: '/academico/gacetas', icono: '📰', desc: 'Publicaciones y normativas institucionales' },
  ]

  return (
    <>
      <PortadaSeccion titulo="Área Académica" subtitulo="Formación, investigación y extensión universitaria" />
      
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opciones.map((op) => (
              <Link 
                key={op.titulo} 
                href={op.href}
                className="group p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{op.icono}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">{op.titulo}</h3>
                <p className="text-gray-500">{op.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}