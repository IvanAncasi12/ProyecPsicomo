'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function SeminariosPage() {
  const [seminarios, setSeminarios] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const todosCursos = res.data?.cursos || []
        
        const seminariosFiltrados = todosCursos.filter((c: any) => 
          c.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() === 'SEMINARIOS'
        )
        const formatted = seminariosFiltrados.map((c: any) => {
          let img_url = '/placeholder.jpg'
          
          if (c.det_img_portada) {
            img_url = c.det_img_portada.startsWith('http') 
              ? c.det_img_portada 
              : `${baseUrl}${c.det_img_portada}`
          }
          
          return {
            ...c,
            img_url
          }
        })
        
        console.log('🎓 Seminarios procesados:', formatted.map((s: any) => ({ 
          id: s.iddetalle_cursos_academicos, 
          img: s.img_url 
        })))
        
        setSeminarios(formatted)
      } catch (e) { 
        console.error(' Error cargando seminarios:', e)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <PortadaSeccion titulo="Seminarios" subtitulo="Espacios de aprendizaje especializado" />
      
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {seminarios.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No hay seminarios disponibles.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seminarios.map((sem: any) => (
                <div key={sem.iddetalle_cursos_academicos} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  
                  {/* Imagen */}
                  <div className="h-48 bg-gray-200 relative">
                    <ZoomableImage 
                      src={sem.img_url} 
                      alt={sem.det_titulo} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{sem.det_titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: sem.det_descripcion || '' }} />
                    <div className="text-sm text-gray-500">
                      <p>📅 {sem.det_fecha_ini ? new Date(sem.det_fecha_ini).toLocaleDateString() : 'Por definir'}</p>
                      {sem.det_costo && <p className="text-purple-600 font-bold mt-2">Inversión: Bs {sem.det_costo}</p>}
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