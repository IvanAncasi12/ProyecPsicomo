'use client'

import { useState } from 'react'

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  className?: string
}

export default function ZoomableImage({ src, alt, className, ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Imagen normal - SIN LUPA, SIN CURSOR ESPECIAL */}
      <img
        src={src}
        alt={alt || 'Imagen ampliable'}
        className={`${className} transition-all duration-300`}
        onClick={() => setIsOpen(true)}
        {...props}
      />

      {/* Modal de pantalla completa */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white text-5xl font-light transition-transform hover:rotate-90 duration-300"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar imagen"
          >
            &times;
          </button>
          <img
            src={src}
            alt={alt || 'Vista completa'}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}