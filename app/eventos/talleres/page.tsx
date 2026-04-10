'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        
        const todosEventos = res.data?.upea_evento || []
        
        // Filtrar talleres/congresos
        const talleresFiltrados = todosEventos.filter((e: any) => {
          const titulo = (e.evento_titulo || '').toLowerCase()
          return titulo.includes('taller') || titulo.includes('congreso') || titulo.includes('conferencia') || titulo.includes('seminario')
        })
        
        const formatted = talleresFiltrados.map((e: any) => {
          let img_url = '/placeholder.jpg'
          if (e.evento_imagen) {
            img_url = e.evento_imagen.startsWith('http') ? e.evento_imagen : `${baseUrl}${e.evento_imagen}`
          }
          return { ...e, img_url }
        })
        
        setTalleres(formatted)
      } catch (e) { 
        console.error('Error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Talleres y Congresos" subtitulo="Capacitaciones especializadas" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center py-20">Cargando...</p>
          ) : talleres.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-500">No hay talleres disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talleres.map((taller: any) => (
                <div key={taller.evento_id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {taller.img_url && taller.img_url !== '/placeholder.jpg' ? (
                      <ZoomableImage 
                        src={taller.img_url} 
                        alt={taller.evento_titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-purple-400 to-pink-500">
                        🎯
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{taller.evento_titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: taller.evento_descripcion || 'Sin descripción' }} />
                    
                    {taller.evento_fecha && (
                      <p className="text-sm text-gray-500">📅 {new Date(taller.evento_fecha).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}