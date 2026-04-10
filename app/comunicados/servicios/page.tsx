'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const servs = res.data?.serviciosCarrera || []
        
        const activos = servs.filter((s: any) => s.serv_active === '1')
        
        const formatted = activos.map((s: any) => ({
          ...s,
          img_url: s.serv_imagen?.startsWith('http') ? s.serv_imagen : `${baseUrl}${s.serv_imagen}`
        }))
        
        setServicios(formatted)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Servicios" subtitulo="Servicios disponibles para estudiantes" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center py-20 text-gray-500 animate-pulse">Cargando servicios...</p>
          ) : servicios.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay servicios disponibles.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((serv) => (
                <div key={serv.serv_id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <ZoomableImage 
                      src={serv.img_url || '/placeholder.jpg'} 
                      alt={serv.serv_nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{serv.serv_nombre}</h3>
                    <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: serv.serv_descripcion || 'Sin descripción' }} />
                    {serv.serv_nro_celular && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>📞</span>
                        <span>{serv.serv_nro_celular}</span>
                      </div>
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