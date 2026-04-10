'use client'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

export default function PortadaCarrera({ titulo, subtitulo }: { titulo: string, subtitulo: string }) {
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    const fetchPortada = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const res = await apiClient.get(`/institucion/${id}/contenido`)
        const p = res.data?.portada?.[0]
        if (p) {
          setImgUrl(p.portada_imagen.startsWith('http') ? p.portada_imagen : `${baseUrl}${p.portada_imagen}`)
        }
      } catch (e) { console.error(e) }
    }
    fetchPortada()
  }, [])

  return (
    <div className="relative h-80 md:h-96 flex items-center justify-center text-center overflow-hidden bg-gray-900">
      {imgUrl && (
        <div className="absolute inset-0">
          <img src={imgUrl} alt="Portada" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
      )}
      <div className="relative z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{titulo}</h1>
        <p className="text-xl md:text-2xl text-yellow-400 font-medium">{subtitulo}</p>
      </div>
    </div>
  )
}