'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function AutoridadesPage() {
  const [autores, setAutores] = useState<any[]>([])
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'

  function buildImageUrl(image?: string | null) {
    if (!image) return ''

    const imageClean = String(image).trim()

    if (!imageClean) return ''

    if (imageClean.startsWith('http')) {
      return imageClean
    }

    const cleanBase = baseUrl.replace(/\/$/, '')

    if (
      imageClean.includes('/') ||
      imageClean.startsWith('InstitucionUpea') ||
      imageClean.startsWith('/InstitucionUpea')
    ) {
      const path = imageClean.startsWith('/') ? imageClean : `/${imageClean}`
      return `${cleanBase}${path}`
    }

    return `${cleanBase}/InstitucionUpea/Autoridad/${imageClean}`
  }

  function getInitials(name?: string) {
    if (!name) return 'U'

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  function cleanValue(value?: string | null) {
    if (!value) return ''

    const clean = String(value).trim()

    return clean === '_' ? '' : clean
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const autoridades = contenidoRes.data?.autoridad || []

        const formatted = autoridades.map((autoridad: any) => ({
          ...autoridad,
          foto_url: buildImageUrl(autoridad.foto_autoridad),
        }))

        setAutores(formatted)
      } catch (error) {
        console.error('Error cargando autoridades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  return (
    <main className="bg-white">
      <PageHero titulo="Autoridades" />

      <section className="relative overflow-hidden py-16 md:py-20 bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 12% 16%, ${colorSecundario}10, transparent 28%),
              radial-gradient(circle at 90% 82%, ${colorPrimario}08, transparent 30%),
              linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] animate-pulse"
                >
                  <div className="h-72 rounded-2xl bg-slate-200 mb-6" />
                  <div className="h-6 w-3/4 mx-auto bg-slate-200 rounded mb-4" />
                  <div className="h-4 w-1/2 mx-auto bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : autores.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
              <div className="text-5xl mb-4">👥</div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                No hay autoridades registradas
              </h3>

              <p className="text-slate-600 font-medium">
                Cuando se registren autoridades en el servicio, aparecerán aquí
                automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {autores.map((autoridad, index) => {
                const celular = cleanValue(autoridad.celular_autoridad)

                return (
                  <article
                    key={autoridad.id_autoridad || index}
                    className="group relative overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.13)]"
                    style={{
                      borderColor: `${colorPrimario}20`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full w-1"
                      style={{
                        background: `linear-gradient(180deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    />

                    <div className="p-5 pb-0">
                      <div className="relative h-72 overflow-hidden rounded-[1.35rem] bg-slate-100">
                        {autoridad.foto_url ? (
                          <ZoomableImage
                            src={autoridad.foto_url}
                            alt={autoridad.nombre_autoridad}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white text-5xl font-black"
                            style={{
                              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                            }}
                          >
                            {getInitials(autoridad.nombre_autoridad)}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                      </div>
                    </div>

                    <div className="relative p-6 text-center">
                      <h3 className="font-black text-xl md:text-2xl text-slate-950 mb-3 leading-tight">
                        {autoridad.nombre_autoridad}
                      </h3>

                      <div
                        className="w-14 h-1 mx-auto rounded-full mb-4"
                        style={{
                          background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
                        }}
                      />

                      <p
                        className="font-black text-sm uppercase tracking-[0.14em] mb-4"
                        style={{ color: colorPrimario }}
                      >
                        {autoridad.cargo_autoridad}
                      </p>

                      {celular && (
                        <a
                          href={`tel:${celular}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-slate-50 text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-md"
                          style={{
                            borderColor: `${colorSecundario}55`,
                            color: colorPrimario,
                          }}
                        >
                          <span>📞</span>
                          <span>{celular}</span>
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}