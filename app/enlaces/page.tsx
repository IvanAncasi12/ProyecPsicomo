'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function EnlacesPage() {
  const [enlaces, setEnlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/recursos`)
        
        const linksRaw = res.data?.linksExternoInterno || []
        const linksActivos = linksRaw.filter((l: any) => l.estado === 1)
        
        const formatted = linksActivos.map((l: any) => {
          let img_url = ''
          if (l.imagen) {
            img_url = l.imagen.startsWith('http') 
              ? l.imagen 
              : `${baseUrl}${l.imagen}`
          }
          
          return {
            id: l.id_link,
            nombre: l.nombre,
            url: l.url_link || '#',
            tipo: l.tipo,
            img_url
          }
        })
      
        if (formatted.length === 0) {
          setEnlaces([
            { id: 1, nombre: 'Campus Virtual', url: 'https://virtualeconomia.upea.bo/', tipo: 'CAMPUS', img_url: '' },
            { id: 2, nombre: 'Inscripciones', url: 'https://inscripcioneseconomia.upea.bo/', tipo: 'INSCRIPCIONES', img_url: '' },
            { id: 3, nombre: 'Página Web', url: 'https://economia.upea.edu.bo/', tipo: 'WEB', img_url: '' },
          ])
        } else {
          setEnlaces(formatted)
        }
      } catch (e) { 
        console.error('Error cargando enlaces:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Enlaces de Interés" subtitulo="Recursos y plataformas útiles" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <p className="text-center py-20 text-gray-500">Cargando enlaces...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enlaces.map((link: any) => (
                <a
                  key={link.id || link.nombre}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl overflow-hidden group-hover:bg-blue-200 transition-colors flex-shrink-0">
                      {link.img_url ? (
                        <img 
                          src={link.img_url} 
                          alt={link.nombre}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                            ;(e.target as HTMLImageElement).parentElement!.innerHTML = '🔗'
                          }}
                        />
                      ) : (
                        '🔗'
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
                        {link.nombre}
                      </h3>
                      {link.tipo && (
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                          {link.tipo}
                        </span>
                      )}
                      <p className="text-gray-500 text-sm">
                        Visitar sitio externo
                      </p>
                      <span className="inline-block mt-2 text-xs text-blue-600 font-medium group-hover:underline">
                        Abrir enlace →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}