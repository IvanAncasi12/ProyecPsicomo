'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

export default function Programs() {
  const [ofertas, setOfertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [selectedOferta, setSelectedOferta] = useState<any | null>(null)

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

    return `${cleanBase}/InstitucionUpea/Ofertas/${imageClean}`
  }

  function cleanHtml(text?: string | null) {
    if (!text) return ''

    return String(text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'

    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const recursosRes = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const ofertasData =
          recursosRes.data?.ofertasAcademicas?.filter(
            (o: any) => o.ofertas_estado === 1
          ) || []

        const ofertasFormateadas = ofertasData.map((oferta: any) => ({
          ...oferta,
          ofertas_imagen_url: buildImageUrl(oferta.ofertas_imagen),
        }))

        setOfertas(ofertasFormateadas)
      } catch (error) {
        console.warn('Error cargando ofertas académicas', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedOferta) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedOferta(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedOferta])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  return (
    <section
      id="programas"
      className="relative overflow-hidden py-24 bg-white"
    >
       
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 12% 16%, ${colorSecundario}18, transparent 26%),
            radial-gradient(circle at 88% 78%, ${colorPrimario}12, transparent 28%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 52%, #ffffff 100%)
          `,
        }}
      />

      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[linear-gradient(90deg,#020617_1px,transparent_1px),linear-gradient(180deg,#020617_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border shadow-sm mb-5 bg-white"
            style={{
              borderColor: `${colorSecundario}55`,
              color: colorPrimario,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorSecundario }}
            />

            <span className="text-xs md:text-sm font-extrabold tracking-[0.22em] uppercase">
              Formación académica
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-5 tracking-tight">
            Ofertas Académicas
          </h2>

          <div
            className="w-28 h-1.5 mx-auto rounded-full mb-5"
            style={{
              background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`,
              boxShadow: `0 0 22px ${colorSecundario}55`,
            }}
          />

          <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Oportunidades de estudio, capacitación y actualización para tu
            desarrollo profesional.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden animate-pulse shadow-lg"
              >
                <div className="h-64 bg-slate-200" />
                <div className="p-7">
                  <div className="h-7 w-3/4 rounded bg-slate-200 mb-4" />
                  <div className="h-4 w-full rounded bg-slate-100 mb-2" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : ofertas.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {ofertas.map((program, index) => (
              <article
                key={program.ofertas_id || index}
                className="group relative overflow-hidden rounded-[2rem] border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
                style={{
                  borderColor: `${colorPrimario}22`,
                }}
              >
                <div
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${colorSecundario}80, transparent 70%)`,
                  }}
                />

                <button
                  type="button"
                  onClick={() => setSelectedOferta(program)}
                  className="relative h-64 w-full overflow-hidden block text-left"
                  aria-label={`Ver imagen de ${program.ofertas_titulo}`}
                >
                  {program.ofertas_imagen_url ? (
                    <img
                      src={program.ofertas_imagen_url}
                      alt={program.ofertas_titulo}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    >
                      Oferta Académica
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  <div className="absolute top-5 left-5">
                    <span
                      className="inline-flex items-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.14em] bg-white text-slate-900 shadow-lg"
                      style={{
                        color: colorPrimario,
                      }}
                    >
                      Inscripciones abiertas
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-bold">
                      Ver imagen
                    </span>
                  </div>
                </button>

                <div className="relative z-10 p-7 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-950 mb-4 leading-tight group-hover:opacity-90 transition-opacity">
                    {program.ofertas_titulo}
                  </h3>

                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed font-medium">
                    {cleanHtml(program.ofertas_descripcion) ||
                      'Sin descripción disponible.'}
                  </p>

                  <div className="grid grid-cols-1 gap-3 mb-7 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-3 text-sm">
                      <span className="text-lg">📅</span>
                      <div>
                        <span className="block font-black text-slate-900">
                          Inicio de inscripciones
                        </span>
                        <span className="text-slate-600 font-medium">
                          {formatDate(program.ofertas_inscripciones_ini)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                      <span className="text-lg">🏁</span>
                      <div>
                        <span className="block font-black text-slate-900">
                          Fin de inscripciones
                        </span>
                        <span className="text-slate-600 font-medium">
                          {formatDate(program.ofertas_inscripciones_fin)}
                        </span>
                      </div>
                    </div>

                    {program.ofertas_referencia && (
                      <div className="flex items-start gap-3 text-sm">
                        <span className="text-lg">📞</span>
                        <div>
                          <span className="block font-black text-slate-900">
                            Referencia
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: colorPrimario }}
                          >
                            {program.ofertas_referencia}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOferta(program)}
                    className="w-full py-3.5 rounded-2xl font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                      boxShadow: `0 16px 32px ${colorPrimario}22`,
                    }}
                  >
                    Ver detalles
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 text-slate-600 bg-white rounded-[2rem] border border-dashed border-slate-300 shadow-sm">
            No hay ofertas académicas disponibles en este momento.
          </div>
        )}
      </div>
 
      {selectedOferta && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setSelectedOferta(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedOferta(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 border border-white/40 text-2xl leading-none transition-colors shadow-lg"
              aria-label="Cerrar oferta"
            >
              ×
            </button>

            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
              <div
                className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                  background: `
                    radial-gradient(circle at 20% 15%, ${colorSecundario}25, transparent 28%),
                    radial-gradient(circle at 80% 80%, ${colorPrimario}20, transparent 32%)
                  `,
                }}
              />

              <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
                <div className="min-h-[380px] lg:min-h-[620px] bg-slate-100 flex items-center justify-center">
                  {selectedOferta.ofertas_imagen_url ? (
                    <img
                      src={selectedOferta.ofertas_imagen_url}
                      alt={selectedOferta.ofertas_titulo}
                      className="max-h-[78vh] w-full h-full object-contain"
                    />
                  ) : (
                    <div
                      className="w-full h-full min-h-[380px] flex items-center justify-center text-white text-3xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    >
                      Oferta Académica
                    </div>
                  )}
                </div>

                <div className="relative p-7 md:p-9 flex flex-col justify-center">
                  <span
                    className="text-xs font-extrabold uppercase tracking-[0.22em] mb-4"
                    style={{ color: colorPrimario }}
                  >
                    Oferta Académica
                  </span>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-950 mb-5 leading-tight">
                    {selectedOferta.ofertas_titulo}
                  </h3>

                  <p className="text-slate-600 leading-relaxed font-medium mb-7">
                    {cleanHtml(selectedOferta.ofertas_descripcion) ||
                      'Sin descripción disponible.'}
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-slate-950 font-black">
                        📅 Inicio de inscripciones
                      </span>
                      <span className="text-slate-600 font-medium">
                        {formatDate(selectedOferta.ofertas_inscripciones_ini)}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-slate-950 font-black">
                        🏁 Fin de inscripciones
                      </span>
                      <span className="text-slate-600 font-medium">
                        {formatDate(selectedOferta.ofertas_inscripciones_fin)}
                      </span>
                    </div>

                    {selectedOferta.ofertas_referencia && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="block text-slate-950 font-black">
                          📞 Referencia
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: colorPrimario }}
                        >
                          {selectedOferta.ofertas_referencia}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-8 text-slate-500 text-sm">
                    Presiona fuera de la ventana o la tecla ESC para cerrar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}