'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function NosotrosPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const res = await apiClient.get(`/institucionesPrincipal/${id}`)
        setData(res.data?.Descripcion)
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  if (!data) return <div className="h-screen flex items-center justify-center">Cargando contenido...</div>

  return (
    <>
      <PortadaSeccion titulo="Nosotros" subtitulo="Historia, Misión y Visión Institucional" />

      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-16">
          
          <section className="bg-gray-50 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-4xl">📜</span> Historia
            </h2>
            <div 
              className="text-gray-600 leading-relaxed text-lg" 
              dangerouslySetInnerHTML={{ __html: data.institucion_historia }} 
            />
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-600 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🎯</span>
                <h3 className="text-2xl font-bold text-gray-800">Misión</h3>
              </div>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.institucion_mision }} />
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔭</span>
                <h3 className="text-2xl font-bold text-gray-800">Visión</h3>
              </div>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.institucion_vision }} />
            </section>
          </div>

        </div>
      </div>
    </>
  )
}