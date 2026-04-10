'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const convs = res.data?.convocatorias || []
        
        const formatted = convs.map((c: any) => ({
          ...c,
          img_url: c.con_foto_portada?.startsWith('http') ? c.con_foto_portada : `${baseUrl}${c.con_foto_portada}`
        }))
        
        setConvocatorias(formatted)
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

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
                <div className="flex gap-4">
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={conv.img_url || '/placeholder.jpg'} alt={conv.con_titulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold mb-2">
                      {conv.tipo_conv_comun?.tipo_conv_comun_titulo || 'CONVOCATORIA'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{conv.con_titulo}</h3>
                    <p className="text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: conv.con_descripcion || '' }} />
                    <div className="text-sm text-gray-500">
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