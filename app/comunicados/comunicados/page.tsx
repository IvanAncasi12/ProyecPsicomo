'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function ComunicadosOficialesPage() {
  const [comunicados, setComunicados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const convs = res.data?.convocatorias || []
        
        // Filtrar solo COMUNICADOS
        const comunicadosFiltrados = convs.filter((c: any) => 
          c.tipo_conv_comun?.tipo_conv_comun_titulo?.toUpperCase() === 'COMUNICADOS'
        )
        
        // Construcción segura de URL
        const formatted = comunicadosFiltrados.map((c: any) => {
          let img_url = '/placeholder.jpg'
          
          if (c.con_foto_portada) {
            img_url = c.con_foto_portada.startsWith('http') 
              ? c.con_foto_portada 
              : `${baseUrl}${c.con_foto_portada}`
          }
          
          return {
            ...c,
            img_url
          }
        })
        
        setComunicados(formatted)
      } catch (e) { 
        console.error('Error cargando comunicados:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Comunicados Oficiales" subtitulo="Información institucional oficial" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {loading ? (
            <p className="text-center py-20 text-gray-500 animate-pulse">Cargando comunicados...</p>
          ) : comunicados.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay comunicados disponibles.</p>
          ) : (
            comunicados.map((com: any) => (
              <div key={com.idconvocatorias} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-600">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-blue-100 rounded-lg overflow-hidden">
                    {com.img_url && com.img_url !== '/placeholder.jpg' ? (
                      <ZoomableImage 
                        src={com.img_url} 
                        alt={com.con_titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📋
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">
                      COMUNICADO
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{com.con_titulo}</h3>
                    <p className="text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: com.con_descripcion || '' }} />
                    <div className="text-sm text-gray-500">
                      {com.con_fecha_inicio && <p>📅 Publicado: {new Date(com.con_fecha_inicio).toLocaleDateString()}</p>}
                      {com.con_fecha_fin && <p>📅 Vigencia: {new Date(com.con_fecha_fin).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}