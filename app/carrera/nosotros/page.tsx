'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'
import GaleriaCarrera from '@/components/carrera/GaleriaCarrera'

export default function NosotrosPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  function cleanHtml(text?: string | null) {
    if (!text) return ''

    return String(text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'
        const res = await apiClient.get(`/institucionesPrincipal/${id}`)
        setData(res.data?.Descripcion)
      } catch (error) {
        console.error('Error cargando información de Nosotros:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
          <p className="text-slate-600 font-bold">
            Cargando contenido institucional...
          </p>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-lg text-center rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-2xl font-black text-slate-950 mb-2">
            No se pudo cargar la información
          </h2>

          <p className="text-slate-600 font-medium">
            Intenta recargar la página o verifica que el servicio esté disponible.
          </p>
        </div>
      </main>
    )
  }

  const colores = data?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  const nombreCarrera = data?.institucion_nombre || 'Derecho'

  const historia = data?.institucion_historia || ''
  const mision = data?.institucion_mision || ''
  const vision = data?.institucion_vision || ''

  const hasHistoria = cleanHtml(historia).length > 0
  const hasMision = cleanHtml(mision).length > 0
  const hasVision = cleanHtml(vision).length > 0

  return (
    <main className="bg-white">
      <PageHero titulo="Nosotros" />

      <section className="relative overflow-hidden py-20 md:py-24 bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 12% 16%, ${colorSecundario}12, transparent 28%),
              radial-gradient(circle at 90% 82%, ${colorPrimario}10, transparent 30%),
              linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border bg-white text-xs md:text-sm font-black tracking-[0.18em] uppercase shadow-sm"
              style={{
                borderColor: `${colorSecundario}55`,
                color: colorPrimario,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colorSecundario }}
              />
              Identidad institucional
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-slate-950 mt-5 mb-5">
              Nuestra Carrera
            </h1>

            <div
              className="w-24 h-1.5 mx-auto rounded-full mb-5"
              style={{
                background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
              }}
            />

            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Conoce la historia, misión y visión de la carrera de{' '}
              <span className="font-black" style={{ color: colorPrimario }}>
                {nombreCarrera}
              </span>
              .
            </p>
          </div>

          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{
                  background: `${colorPrimario}12`,
                }}
              >
                🏛️
              </div>

              <div className="flex-1">
                <span
                  className="block text-xs font-black uppercase tracking-[0.18em] mb-2"
                  style={{ color: colorPrimario }}
                >
                  Trayectoria
                </span>

                <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-5">
                  Historia
                </h2>

                {hasHistoria ? (
                  <div
                    className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-slate-950"
                    dangerouslySetInnerHTML={{ __html: historia }}
                  />
                ) : (
                  <p className="text-slate-600 font-medium leading-relaxed">
                    La historia institucional será publicada próximamente.
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Misión"
              eyebrow="Propósito institucional"
              icon="⚖️"
              content={mision}
              hasContent={hasMision}
              fallback="La misión institucional será publicada próximamente."
              accentColor={colorPrimario}
              secondaryColor={colorSecundario}
            />

            <InfoCard
              title="Visión"
              eyebrow="Proyección académica"
              icon="🌟"
              content={vision}
              hasContent={hasVision}
              fallback="La visión institucional será publicada próximamente."
              accentColor={colorSecundario}
              secondaryColor={colorPrimario}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <GaleriaCarrera />
      </section>
    </main>
  )
}

function InfoCard({
  title,
  eyebrow,
  icon,
  content,
  hasContent,
  fallback,
  accentColor,
  secondaryColor,
}: {
  title: string
  eyebrow: string
  icon: string
  content: string
  hasContent: boolean
  fallback: string
  accentColor: string
  secondaryColor: string
}) {
  return (
    <section
      className="group relative overflow-hidden rounded-3xl border bg-white p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.12)]"
      style={{
        borderColor: `${accentColor}26`,
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: `linear-gradient(180deg, ${accentColor}, ${secondaryColor})`,
        }}
      />

      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{
            background: `${accentColor}12`,
          }}
        >
          {icon}
        </div>

        <div>
          <span
            className="block text-xs font-black uppercase tracking-[0.16em] mb-1"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </span>

          <h3 className="text-2xl md:text-3xl font-black text-slate-950">
            {title}
          </h3>
        </div>
      </div>

      {hasContent ? (
        <div
          className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-slate-950"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-slate-600 font-medium leading-relaxed">{fallback}</p>
      )}
    </section>
  )
}