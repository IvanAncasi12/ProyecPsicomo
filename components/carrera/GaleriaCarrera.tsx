'use client'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

export default function GaleriaCarrera() {
  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    const fetchGaleria = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const res = await apiClient.get(`/institucion/${id}/recursos`)
        const pubs = res.data?.upea_publicaciones || []
        const list = pubs.slice(0, 3).map((p: any) => {
          return p.publicaciones_imagen.startsWith('http') ? p.publicaciones_imagen : `${baseUrl}${p.publicaciones_imagen}`
        })
        setImgs(list)
      } catch (e) { console.error(e) }
    }
    fetchGaleria()
  }, [])

  if (imgs.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Nuestra Facultad en Imágenes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {imgs.map((src, i) => (
            <div key={i} className="h-64 rounded-xl overflow-hidden shadow-md">
              <img src={src} alt="Galeria" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}