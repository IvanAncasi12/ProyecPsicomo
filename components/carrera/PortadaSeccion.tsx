'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

export default function PortadaSeccion({ titulo, subtitulo }: { titulo: string, subtitulo: string }) {
  const [imgUrl, setImgUrl] = useState('')
  const [colorPrimario, setColorPrimario] = useState('#DC0E10')
  const [colorSecundario, setColorSecundario] = useState('#E9C202')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const p = contenidoRes.data?.portada?.[0]
        if (p) {
          const img = p.portada_imagen
          setImgUrl(img.startsWith('http') ? img : `${baseUrl}${img}`)
        }

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const cols = principalRes.data?.Descripcion?.colorinstitucion?.[0]
        if (cols) {
          setColorPrimario(cols.color_primario)
          setColorSecundario(cols.color_secundario)
        }
      } catch (error) {
        console.error('Error cargando portada:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="relative h-72 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900">
      {imgUrl ? (
        <div className="absolute inset-0">
          <img src={imgUrl} alt="Fondo" className="w-full h-full object-cover opacity-40" />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorPrimario}dd, ${colorPrimario}99)` }} />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-4 max-w-4xl mx-auto">
        <div className="w-20 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: colorSecundario }} />
        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-xl tracking-tight uppercase">
          {titulo}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md">
          {subtitulo}
        </p>
      </div>
    </section>
  )
}