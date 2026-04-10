'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'

export default function Hero() {
  const [portadas, setPortadas] = useState<any[]>([])
  const [currentPortadaIndex, setCurrentPortadaIndex] = useState(0)
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = contenidoRes.data?.portada || []
        if (portadasData.length > 0) {
          setPortadas(portadasData.map((p: any) => ({
            ...p,
            portada_imagen: p.portada_imagen.startsWith('http') 
              ? p.portada_imagen 
              : `${baseUrl}${p.portada_imagen}`
          })))
        }

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)
      } catch (error) {
        console.warn('Error cargando datos del Hero')
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (portadas.length <= 1) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPortadaIndex((prev) => (prev + 1) % portadas.length)
        setTimeout(() => setIsTransitioning(false), 1000)
      }, 600)
    }, 6000)
    return () => clearInterval(interval)
  }, [portadas])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#DC0E10'
  const colorSecundario = colores?.color_secundario || '#E9C202'
  const gradientStyle = `linear-gradient(270deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`
  const nombreCarrera = institucionData?.institucion_nombre || 'Derecho'
  
  const misionLimpia = institucionData?.institucion_mision
    ? institucionData.institucion_mision.replace(/<[^>]*>/g, '').slice(0, 180) + '...'
    : 'Formación integral de profesionales con excelencia académica, ética y compromiso con la sociedad.'

  return (
    <section id="inicio" className="relative min-h-[90vh] overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {portadas.map((portada, index) => (
          <div
            key={portada.portada_id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentPortadaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={portada.portada_imagen}
              alt={portada.portada_titulo}
              className="w-full h-full object-cover animate-slow-zoom"
              style={{ filter: 'brightness(1.05) contrast(1.05)' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-background/10 via-background/5 to-transparent" />
        <div 
          className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-1000 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `linear-gradient(135deg, ${colorPrimario}30, ${colorSecundario}30, ${colorPrimario}30)`,
            backdropFilter: 'blur(8px)',
          }}
        />
      </div>
      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-0 min-h-[90vh] flex flex-col justify-center">
        <div className="mb-10 animate-fade-in-down">
          <div className="inline-flex items-center gap-5 bg-white/90 backdrop-blur-md p-3 pr-8 rounded-lg shadow-xl border-l-8 border-accent">
            <div className="w-16 h-16 rounded bg-gray-50 flex items-center justify-center p-1 shadow-inner border border-gray-200">
              <img 
                src="logoupea.jpg"
                alt="Logo UPEA" 
                className="w-full h-full object-contain"
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight uppercase">
                Universidad Pública de El Alto
              </h2>
              <p className="text-md font-bold text-accent tracking-widest uppercase">
                La Universidad del pueblo
              </p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] drop-shadow-lg">
              <span className="block text-white mb-2 drop-shadow-md">Carrera de</span>
              <span 
                className="text-6xl md:text-8xl animated-title"
                style={{ backgroundImage: gradientStyle }}
              >
                {nombreCarrera}
              </span>
            </h1>
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-2xl border-l-4 border-accent max-w-xl">
              <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
                {misionLimpia}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm shadow-lg group">
                Más Información
                <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
          <div className="hidden md:block h-[70vh] overflow-hidden rounded-l-3xl animate-fade-in-delayed">
            <img
              src="imagen1.png"
              alt="Excelencia Académica"
              className="w-full h-full object-cover object-center animate-image-zoom"
              style={{ 
                filter: 'contrast(1.1) brightness(1.05)',
                clipPath: 'inset(0 0 0 -5%)'
              }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9?q=80&w=2000&auto=format&fit=crop'
              }}
            />
          </div>
        </div>
      </div>
      {portadas.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-50">
          {portadas.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentPortadaIndex(index)
                  setTimeout(() => setIsTransitioning(false), 1000)
                }, 600)
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentPortadaIndex
                  ? 'w-12 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                  : 'bg-white/60 hover:bg-white/90 w-6'
              }`}
              style={{ backgroundColor: index === currentPortadaIndex ? colorSecundario : undefined }}
              aria-label={`Ver portada ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}