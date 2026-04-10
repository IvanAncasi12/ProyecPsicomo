'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function CursosPage() {
  const [cursos, setCursos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const todosCursos = res.data?.cursos || []
        const cursosFiltrados = todosCursos.filter((c: any) => 
          c.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() === 'CURSOS'
        )
        
        const formatted = cursosFiltrados.map((c: any) => ({
          ...c,
          img_url: c.det_img_portada?.startsWith('http') ? c.det_img_portada : `${baseUrl}${c.det_img_portada}`
        }))
        
        setCursos(formatted)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Cursos" subtitulo="Formación continua y actualización profesional" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center py-20">Cargando cursos...</p>
          ) : cursos.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay cursos disponibles actualmente.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursos.map((curso) => (
                <div key={curso.iddetalle_cursos_academicos} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="h-48 bg-gray-200">
                    <ZoomableImage src={curso.img_url || '/placeholder.jpg'} alt={curso.det_titulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{curso.det_titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: curso.det_descripcion || 'Sin descripción' }} />
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>📅 Inicio: {new Date(curso.det_fecha_ini).toLocaleDateString()}</p>
                      <p>⏰ Horario: {curso.det_hora_ini}</p>
                      <p>📍 {curso.det_lugar_curso || 'Por definir'}</p>
                      {curso.det_costo && <p className="text-red-600 font-bold">💵 Bs {curso.det_costo}</p>}
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