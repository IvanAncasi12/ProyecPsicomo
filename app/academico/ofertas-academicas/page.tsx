'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function OfertasAcademicasPage() {
  const [ofertas, setOfertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const todasOfertas = res.data?.ofertasAcademicas || []
        const formatted = todasOfertas.map((o: any) => {
          let img_url = '/placeholder.jpg'
          
          if (o.ofertas_imagen) {
            img_url = o.ofertas_imagen.startsWith('http') 
              ? o.ofertas_imagen 
              : `${baseUrl}${o.ofertas_imagen}`
          }
          
          return {
            ...o,
            img_url
          }
        })
        
        console.log('🎯 Ofertas procesadas:', formatted.map((o: any) => ({ id: o.ofertas_id, img: o.img_url })))
        setOfertas(formatted)
      } catch (e) { 
        console.error('❌ Error cargando ofertas:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Ofertas Académicas" subtitulo="Programas de estudio y procesos de admisión" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center py-20 text-gray-500 animate-pulse">Cargando ofertas académicas...</p>
          ) : ofertas.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay ofertas académicas disponibles en este momento.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {ofertas.map((oferta) => (
                <div key={oferta.ofertas_id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="h-64 bg-gray-200 relative">
                    <ZoomableImage 
                      src={oferta.img_url} 
                      alt={oferta.ofertas_titulo} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        oferta.ofertas_estado === 1 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {oferta.ofertas_estado === 1 ? 'Disponible' : 'Cerrado'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{oferta.ofertas_titulo}</h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3" 
                       dangerouslySetInnerHTML={{ __html: oferta.ofertas_descripcion || 'Sin descripción disponible' }} 
                    />
                    
                    <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">📅</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700">Inscripciones:</p>
                          <p className="text-sm text-gray-600">
                            {oferta.ofertas_inscripciones_ini 
                              ? new Date(oferta.ofertas_inscripciones_ini).toLocaleDateString('es-BO', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })
                              : 'No especificado'
                            }
                            {oferta.ofertas_inscripciones_fin && (
                              <> - {new Date(oferta.ofertas_inscripciones_fin).toLocaleDateString('es-BO', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })
                              }</>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-xl">📝</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700">Examen:</p>
                          <p className="text-sm text-gray-600">
                            {oferta.ofertas_fecha_examen 
                              ? new Date(oferta.ofertas_fecha_examen).toLocaleDateString('es-BO', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })
                              : 'Por definir'
                            }
                          </p>
                        </div>
                      </div>

                      {oferta.ofertas_referencia && (
                        <div className="flex items-start gap-3">
                          <span className="text-xl">📞</span>
                          <p className="text-sm text-blue-600 font-medium">{oferta.ofertas_referencia}</p>
                        </div>
                      )}
                    </div>

                    <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                      Más Información
                    </button>
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