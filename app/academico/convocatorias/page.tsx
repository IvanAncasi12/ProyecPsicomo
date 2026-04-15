'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const convs = res.data?.convocatorias || []
        
        const formatted = convs.map((c: any) => {
          let imgUrl = '/placeholder.jpg'
          const rawImg = c.con_foto_portada

          if (rawImg) {
            if (rawImg.startsWith('http')) {
              imgUrl = rawImg
            } else {
              const path = rawImg.startsWith('/') ? rawImg : `/${rawImg}`
              imgUrl = `${baseUrl}${path}`
            }
          }

          return { ...c, img_url: imgUrl }
        })
        
        setConvocatorias(formatted)
      } catch (e) {
        // Error manejado silenciosamente
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <>
        <PortadaSeccion titulo="Convocatorias" subtitulo="Oportunidades y llamados oficiales" />
        <div className="py-20 text-center text-gray-500">Cargando convocatorias...</div>
      </>
    )
  }

  return (
    <>
      <PortadaSeccion titulo="Convocatorias" subtitulo="Oportunidades y llamados oficiales" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {convocatorias.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay convocatorias activas.</p>
          ) : (
            convocatorias.map((conv) => (
              <div key={conv.idconvocatorias} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-600">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Imagen con Zoom */}
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden cursor-pointer">
                    <ZoomableImage 
                      src={conv.img_url} 
                      alt={conv.con_titulo || 'Convocatoria'} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold mb-2">
                      {conv.tipo_conv_comun?.tipo_conv_comun_titulo || 'CONVOCATORIA'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{conv.con_titulo}</h3>
                    <p className="text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: conv.con_descripcion || '' }} />
                    <div className="text-sm text-gray-500 space-y-1">
                      {conv.con_fecha_inicio && <p>📅 Inicio: {new Date(conv.con_fecha_inicio).toLocaleDateString()}</p>}
                      {conv.con_fecha_fin && <p>📅 Fin: {new Date(conv.con_fecha_fin).toLocaleDateString()}</p>}
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