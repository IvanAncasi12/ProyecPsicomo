'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function AvisosPage() {
  const [avisos, setAvisos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const convs = res.data?.convocatorias || []
        
        const avisosFiltrados = convs.filter((c: any) => 
          c.tipo_conv_comun?.tipo_conv_comun_titulo?.toUpperCase() === 'AVISOS'
        )
        
        const formatted = avisosFiltrados.map((c: any) => {
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
        
        setAvisos(formatted)
      } catch (e) { 
        console.error('Error cargando avisos:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Avisos" subtitulo="Notificaciones importantes" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {loading ? (
            <p className="text-center py-20 text-gray-500 animate-pulse">Cargando avisos...</p>
          ) : avisos.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay avisos disponibles.</p>
          ) : (
            avisos.map((aviso: any) => (
              <div key={aviso.idconvocatorias} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-yellow-100 rounded-lg overflow-hidden">
                    {aviso.img_url && aviso.img_url !== '/placeholder.jpg' ? (
                      <ZoomableImage 
                        src={aviso.img_url} 
                        alt={aviso.con_titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold mb-2">
                      AVISO
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{aviso.con_titulo}</h3>
                    <p className="text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: aviso.con_descripcion || '' }} />
                    <div className="text-sm text-gray-500">
                      {aviso.con_fecha_inicio && <p>📅 Inicio: {new Date(aviso.con_fecha_inicio).toLocaleDateString()}</p>}
                      {aviso.con_fecha_fin && <p>📅 Fin: {new Date(aviso.con_fecha_fin).toLocaleDateString()}</p>}
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