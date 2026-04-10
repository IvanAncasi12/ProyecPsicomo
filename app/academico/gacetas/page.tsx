'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function GacetasPage() {
  const [gacetas, setGacetas] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const gacs = res.data?.upea_gaceta_universitaria || []
        
        const formatted = gacs.map((g: any) => ({
          ...g,
          doc_url: g.gaceta_documento?.startsWith('http') ? g.gaceta_documento : `${baseUrl}${g.gaceta_documento}`
        }))
        
        setGacetas(formatted)
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Gaceta Universitaria" subtitulo="Publicaciones oficiales y normativas" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {gacetas.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay gacetas publicadas.</p>
          ) : (
            gacetas.map((gaceta) => (
              <div key={gaceta.gaceta_id} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-3xl">
                    📰
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{gaceta.gaceta_titulo}</h3>
                    <p className="text-gray-500 text-sm">📅 {new Date(gaceta.gaceta_fecha).toLocaleDateString()}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {gaceta.gaceta_tipo}
                    </span>
                  </div>
                </div>
                {gaceta.doc_url && (
                  <a 
                    href={gaceta.doc_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    📥 Descargar PDF
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}