'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function AutoridadesPage() {
  const [autores, setAutores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/contenido`)
        const auths = res.data?.autoridad || []
        
        const formatted = auths.map((a: any) => ({
          ...a,
          foto_url: a.foto_autoridad?.startsWith('http') ? a.foto_autoridad : `${baseUrl}${a.foto_autoridad}`
        }))
        setAutores(formatted)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Autoridades" subtitulo="Equipo Directivo y Representativo" />

      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          
          {loading ? (
            <div className="text-center py-20 text-xl text-gray-500 animate-pulse">Cargando autoridades...</div>
          ) : autores.length === 0 ? (
             <div className="text-center py-20 text-xl text-gray-500">No hay autoridades registradas.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {autores.map((a) => (
                <div key={a.id_autoridad} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="h-72 overflow-hidden bg-gray-200">
                    <ZoomableImage 
                      src={a.foto_url || '/placeholder.jpg'} 
                      alt={a.nombre_autoridad} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{a.nombre_autoridad}</h3>
                    <p className="text-red-600 font-bold text-sm uppercase tracking-wide border-b-2 border-red-100 pb-2 inline-block">
                      {a.cargo_autoridad}
                    </p>
                    
                    {a.celular_autoridad && a.celular_autoridad !== '_' && (
                       <p className="text-gray-400 text-xs mt-3">📞 {a.celular_autoridad}</p>
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