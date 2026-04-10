'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function EventosListPage() {
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        
        const todosEventos = res.data?.upea_evento || []
        
        const formatted = todosEventos.map((e: any) => {
          let img_url = '/placeholder.jpg'
          
          if (e.evento_imagen) {
            img_url = e.evento_imagen.startsWith('http') 
              ? e.evento_imagen 
              : `${baseUrl}${e.evento_imagen}`
          }
          
          return { ...e, img_url }
        })
        
        setEventos(formatted)
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
      <PortadaSeccion titulo="Eventos" subtitulo="Actividades institucionales" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center py-20">Cargando...</p>
          ) : eventos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500">No hay eventos programados</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento: any) => (
                <div key={evento.evento_id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {evento.img_url && evento.img_url !== '/placeholder.jpg' ? (
                      <ZoomableImage 
                        src={evento.img_url} 
                        alt={evento.evento_titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-blue-400 to-cyan-500">
                        📅
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{evento.evento_titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: evento.evento_descripcion || 'Sin descripción' }} />
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      {evento.evento_fecha && (
                        <p className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(evento.evento_fecha).toLocaleDateString()}</span>
                        </p>
                      )}
                      {evento.evento_hora && (
                        <p className="flex items-center gap-2">
                          <span>⏰</span>
                          <span>{evento.evento_hora}</span>
                        </p>
                      )}
                      {evento.evento_lugar && (
                        <p className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{evento.evento_lugar}</span>
                        </p>
                      )}
                    </div>
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