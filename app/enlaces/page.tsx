'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'

export default function EnlacesPage() {
  const [enlaces, setEnlaces] = useState<any[]>([])
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
      imageClean.startsWith('/InstitucionUpea') ||
      imageClean.startsWith('storage') ||
      imageClean.startsWith('/storage')
    ) {
      const path = imageClean.startsWith('/') ? imageClean : `/${imageClean}`
      return `${cleanBase}${path}`
    }

    return `${cleanBase}/InstitucionUpea/Links/${imageClean}`
  }

  function cleanValue(value?: string | number | null) {
    if (value === null || value === undefined) return ''

    const clean = String(value).trim()

    return clean === '_' ? '' : clean
  }

  function isActive(value: any) {
    return String(value).trim() === '1' || value === 1 || value === true
  }

  function normalizeUrl(url?: string | null) {
    const clean = cleanValue(url)

    if (!clean) return '#'

    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean
    }

    return `https://${clean}`
  }

  function getLinkIcon(tipo?: string | null) {
    const text = cleanValue(tipo).toUpperCase()

    if (text.includes('CAMPUS')) return '🎓'
    if (text.includes('INSCRIP')) return '📝'
    if (text.includes('WEB')) return '🌐'
    if (text.includes('BIBLIOTECA')) return '📚'
    if (text.includes('SISTEMA')) return '💻'
    if (text.includes('AULA')) return '🏛️'

    return '🔗'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const res = await apiClient.get(`/institucion/${id}/recursos`)
        const linksRaw = res.data?.linksExternoInterno || []

        const linksActivos = linksRaw.filter((link: any) =>
          isActive(link.estado)
        )

        const formatted = linksActivos.map((link: any) => ({
          id: link.id_link,
          nombre: cleanValue(link.nombre) || 'Enlace institucional',
          url: normalizeUrl(link.url_link),
          tipo: cleanValue(link.tipo) || 'ENLACE',
          img_url: buildImageUrl(link.imagen),
        }))

        setEnlaces(formatted)
      } catch (error) {
        console.error('Error cargando enlaces:', error)
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
      <PageHero titulo="Enlaces" />

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Recursos digitales
            </span>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mt-5">
              Accede de forma rápida a plataformas, recursos institucionales y
              sitios oficiales relacionados con la carrera.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] animate-pulse"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 mb-6" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
                  <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : enlaces.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
              <div className="text-5xl mb-4">🔗</div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                No hay enlaces disponibles
              </h3>

              <p className="text-slate-600 font-medium">
                Cuando se registren enlaces activos en el servicio, aparecerán
                aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enlaces.map((link, index) => (
                <a
                  key={link.id || `${link.nombre}-${index}`}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.13)]"
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

                  <div
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${colorSecundario}80, transparent 70%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 overflow-hidden border shadow-sm"
                        style={{
                          background: `${colorPrimario}10`,
                          borderColor: `${colorSecundario}35`,
                        }}
                      >
                        {link.img_url ? (
                          <img
                            src={link.img_url}
                            alt={link.nombre}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display =
                                'none'
                            }}
                          />
                        ) : (
                          <span>{getLinkIcon(link.tipo)}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className="inline-flex px-3 py-1 rounded-full bg-white border text-xs font-black uppercase tracking-[0.14em] shadow-sm mb-3"
                          style={{
                            color: colorPrimario,
                            borderColor: `${colorSecundario}55`,
                          }}
                        >
                          {link.tipo || 'ENLACE'}
                        </span>

                        <h3 className="text-xl md:text-2xl font-black text-slate-950 leading-tight group-hover:opacity-80 transition-opacity">
                          {link.nombre}
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-5">
                      Accede a este recurso institucional en una nueva pestaña.
                    </p>

                    <div
                      className="w-14 h-1 rounded-full mb-5"
                      style={{
                        background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    />

                    <div
                      className="inline-flex items-center gap-2 text-sm font-black"
                      style={{ color: colorPrimario }}
                    >
                      <span>Abrir enlace</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}