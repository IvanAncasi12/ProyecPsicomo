'use client'

import { useState, useEffect } from 'react'

export default function GaleriaCarrera() {
 
 const imagenes = [
  '/imagen1.webp', 
  '/iamgen2.webp',
  '/imagen3.png',
  '/imagen4.webp',
  '/imagen5.jpg',
  '/imagen6.jpg',
  '/imagen7.jpg',
]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play: cambia cada 4 segundos
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imagenes.length)
    }, 4000) // 4 segundos

    return () => clearInterval(interval)
  }, [imagenes.length, isAutoPlaying])

  // Ir a la imagen anterior
  const prevImage = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextImage = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % imagenes.length)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToImage = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">Nuestra Institución en Imágenes</h3>
        <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
      </div>
  
      <div 
        className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-200"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imagenes.map((src, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <div className="relative h-96 md:h-[500px]">
                {src && !src.startsWith('/imagenes/') ? (
                  <>
                    <img 
                      src={src} 
                      alt={`Galería ${i + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </>
                ) : (
                  // Placeholder mientras agregas tus imágenes
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600">
                    <span className="text-7xl mb-4">🖼️</span>
                    <p className="text-xl font-bold">Imagen {i + 1} de {imagenes.length}</p>
                    <p className="text-sm mt-2 text-gray-500">Agrega tu imagen en el código</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group"
          aria-label="Imagen anterior"
        >
          <svg className="w-6 h-6 text-gray-800 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group"
          aria-label="Siguiente imagen"
        >
          <svg className="w-6 h-6 text-gray-800 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {imagenes.map((_, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-red-600 w-8' 
                  : 'bg-white/60 hover:bg-white'
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>

        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
          {currentIndex + 1} / {imagenes.length}
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-[4000ms] ease-linear"
          style={{ 
            width: isAutoPlaying ? '100%' : '0%',
            animation: isAutoPlaying ? 'progress 4s linear' : 'none'
          }}
        />
      </div>

      <div className="flex justify-center gap-2 mt-6 overflow-x-auto pb-2">
        {imagenes.map((src, i) => (
          <button
            key={i}
            onClick={() => goToImage(i)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              i === currentIndex ? 'border-red-600 scale-110' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {src && !src.startsWith('/imagenes/') ? (
              <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">
                {i + 1}
              </div>
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  )
}