'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ZoomableImageProps = {
  src: string
  alt: string
  className?: string
}

export default function ZoomableImage({
  src,
  alt,
  className = '',
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [modalLoaded, setModalLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    setModalLoaded(false)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const modal = (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute -top-12 right-0 z-50 w-11 h-11 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-2xl leading-none shadow-xl transition-all"
          aria-label="Cerrar imagen"
        >
          ×
        </button>

        <div className="relative mx-auto">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-amber-300/20 via-red-900/20 to-slate-950/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_35px_120px_rgba(0,0,0,0.65)] animate-[bookOpen_0.45s_cubic-bezier(0.22,1,0.36,1)_forwards]">
            <div className="grid lg:grid-cols-[76px_1fr]">
             
              <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-b from-[#26030b] via-[#7a0c14] to-[#160106]">
                <div className="absolute inset-y-0 right-0 w-px bg-white/20" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent,rgba(0,0,0,0.35))]" />

                <span className="relative rotate-[-90deg] whitespace-nowrap text-white/80 text-xs font-black tracking-[0.28em] uppercase">
                  Vista ampliada
                </span>
              </div>

               
              <div className="relative bg-[#f8fafc] p-3 md:p-5">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,0,0,0.10),transparent_8%,transparent_92%,rgba(0,0,0,0.08))]" />

                <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-100 border border-slate-200 min-h-[360px] md:min-h-[520px] h-[72vh] max-h-[720px] flex items-center justify-center">
                  {!modalLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-950 animate-spin" />
                    </div>
                  )}

                  <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-contain bg-white transition-opacity duration-300 ${
                      modalLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setModalLoaded(true)}
                    onError={() => setModalLoaded(true)}
                  />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-slate-950 font-black text-sm md:text-base truncate">
                      {alt}
                    </p>
                    <p className="text-slate-500 text-xs font-semibold">
                      Presiona fuera de la imagen o ESC para cerrar.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-slate-950 text-white text-sm font-black hover:bg-slate-800 transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 h-5 w-[70%] rounded-full bg-black/45 blur-xl" />
        </div>
      </div>

      <style jsx>{`
        @keyframes bookOpen {
          0% {
            opacity: 0;
            transform: perspective(1200px) rotateY(-18deg) translateY(18px)
              scale(0.94);
          }

          100% {
            opacity: 1;
            transform: perspective(1200px) rotateY(0deg) translateY(0px)
              scale(1);
          }
        }
      `}</style>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block w-full h-full overflow-hidden group focus:outline-none"
        aria-label={`Ampliar imagen: ${alt}`}
      >
        <img src={src} alt={alt} className={className} />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-slate-950 text-xs font-black uppercase tracking-[0.14em] shadow-lg">
            Ver imagen
          </span>
        </div>
      </button>

      {mounted && open ? createPortal(modal, document.body) : null}
    </>
  )
}