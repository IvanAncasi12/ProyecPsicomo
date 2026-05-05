'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

export default function Team() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [selectedMember, setSelectedMember] = useState<any | null>(null)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const autoridades = contenidoRes.data?.autoridad || []

        const teamFormateado = autoridades.map((member: any) => ({
          ...member,
          foto_url: buildImageUrl(member.foto_autoridad),
        }))

        setTeam(teamFormateado)

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)
      } catch (error) {
        console.warn('Error cargando equipo/autoridades', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedMember) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMember(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedMember])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  return (
    <section
      id="equipo"
      className="relative overflow-hidden py-24 bg-white"
    >
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 12% 18%, ${colorSecundario}18, transparent 26%),
            radial-gradient(circle at 88% 78%, ${colorPrimario}12, transparent 28%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 48%, #ffffff 100%)
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
              Equipo institucional
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-5 tracking-tight">
            Autoridades y Docentes
          </h2>

          <div
            className="w-28 h-1.5 mx-auto rounded-full mb-5"
            style={{
              background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`,
              boxShadow: `0 0 22px ${colorSecundario}55`,
            }}
          />

          <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Profesionales con experiencia, vocación académica y compromiso con
            la formación de excelencia.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 animate-pulse shadow-lg"
              >
                <div className="w-36 h-36 mx-auto mb-6 rounded-full bg-slate-200" />
                <div className="h-6 w-3/4 mx-auto rounded bg-slate-200 mb-4" />
                <div className="h-4 w-1/2 mx-auto rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : team.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <article
                key={member.id_autoridad || index}
                className="group relative overflow-hidden rounded-[2rem] border bg-white p-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)]"
                style={{
                  borderColor: `${colorPrimario}22`,
                }}
              >
                <div
                  className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${colorSecundario}80, transparent 70%)`,
                  }}
                />

                <div
                  className="absolute -bottom-28 -left-28 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${colorPrimario}45, transparent 72%)`,
                  }}
                />
 
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="relative block w-36 h-36 mx-auto mb-6 rounded-full focus:outline-none focus:ring-4 focus:ring-slate-200"
                  aria-label={`Ver foto de ${member.nombre_autoridad}`}
                >
                  <span
                    className="absolute -inset-2 rounded-full opacity-80 blur-md transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                    }}
                  />

                  <span className="relative block w-full h-full rounded-full overflow-hidden border-4 bg-white shadow-2xl">
                    {member.foto_url ? (
                      <img
                        src={member.foto_url}
                        alt={member.nombre_autoridad}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <span
                        className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
                        style={{
                          background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                        }}
                      >
                        {getInitials(member.nombre_autoridad)}
                      </span>
                    )}

                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                        Ver foto
                      </span>
                    </span>
                  </span>
                </button>

                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-black text-slate-950 mb-2 leading-tight transition-colors duration-300">
                    {member.nombre_autoridad}
                  </h3>

                  <p
                    className="font-extrabold mb-4 text-sm uppercase tracking-[0.14em]"
                    style={{ color: colorPrimario }}
                  >
                    {member.cargo_autoridad}
                  </p>

                  {member.celular_autoridad &&
                    member.celular_autoridad !== '_' && (
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border bg-slate-50"
                        style={{
                          borderColor: `${colorSecundario}55`,
                          color: colorPrimario,
                        }}
                      >
                        <span>📞</span>
                        <span className="font-bold">
                          {member.celular_autoridad}
                        </span>
                      </div>
                    )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 text-slate-600 bg-white rounded-[2rem] border border-dashed border-slate-300 shadow-sm">
            No hay autoridades registradas en este momento.
          </div>
        )}
      </div>
 
      {selectedMember && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 border border-white/40 text-2xl leading-none transition-colors shadow-lg"
              aria-label="Cerrar imagen"
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

              <div className="relative grid md:grid-cols-[1fr_0.8fr] gap-0">
                <div className="min-h-[420px] md:min-h-[580px] bg-slate-100 flex items-center justify-center">
                  {selectedMember.foto_url ? (
                    <img
                      src={selectedMember.foto_url}
                      alt={selectedMember.nombre_autoridad}
                      className="max-h-[78vh] w-full h-full object-contain"
                    />
                  ) : (
                    <div
                      className="w-60 h-60 rounded-full flex items-center justify-center text-white text-6xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    >
                      {getInitials(selectedMember.nombre_autoridad)}
                    </div>
                  )}
                </div>

                <div className="relative p-7 md:p-9 flex flex-col justify-center">
                  <span
                    className="text-xs font-extrabold uppercase tracking-[0.22em] mb-4"
                    style={{ color: colorPrimario }}
                  >
                    Autoridad / Docente
                  </span>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-950 mb-4 leading-tight">
                    {selectedMember.nombre_autoridad}
                  </h3>

                  <p
                    className="text-base md:text-lg font-black uppercase tracking-[0.14em] mb-6"
                    style={{ color: colorSecundario }}
                  >
                    {selectedMember.cargo_autoridad}
                  </p>

                  {selectedMember.celular_autoridad &&
                    selectedMember.celular_autoridad !== '_' && (
                      <div
                        className="w-fit inline-flex items-center gap-2 px-5 py-3 border rounded-full bg-slate-50"
                        style={{
                          borderColor: `${colorSecundario}55`,
                          color: colorPrimario,
                        }}
                      >
                        <span>📞</span>
                        <span className="font-bold">
                          {selectedMember.celular_autoridad}
                        </span>
                      </div>
                    )}

                  <p className="mt-8 text-slate-500 text-sm">
                    Presiona fuera de la imagen o la tecla ESC para cerrar.
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