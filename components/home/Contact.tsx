'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  function cleanValue(value?: string | null) {
    if (!value) return ''

    const clean = String(value).trim()

    return clean === '_' ? '' : clean
  }

  function buildMapUrl(map?: string | null) {
    if (!map) return ''

    const cleanMap = String(map).trim()

    if (!cleanMap || cleanMap === '_') return ''

    if (cleanMap.startsWith('http')) {
      return cleanMap
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'

    const cleanBase = baseUrl.replace(/\/$/, '')
    const path = cleanMap.startsWith('/') ? cleanMap : `/${cleanMap}`

    return `${cleanBase}${path}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion

        setContactInfo({
          ...data,
          googleMapUrl: buildMapUrl(data?.institucion_api_google_map),
        })
      } catch (error) {
        console.warn('Error cargando información de contacto', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = contactInfo?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  const nombreCarrera = contactInfo?.institucion_nombre || 'Derecho'

  const getPhones = () => {
    const phones = [
      cleanValue(contactInfo?.institucion_celular1),
      cleanValue(contactInfo?.institucion_celular2),
      cleanValue(contactInfo?.institucion_telefono1),
      cleanValue(contactInfo?.institucion_telefono2),
    ].filter(Boolean)

    return [...new Set(phones)]
  }

  const getEmails = () => {
    const emails = [
      cleanValue(contactInfo?.institucion_correo1),
      cleanValue(contactInfo?.institucion_correo2),
    ].filter(Boolean)

    return [...new Set(emails)]
  }

  const socialLinks = [
    {
      label: 'Facebook',
      icon: 'f',
      url: cleanValue(contactInfo?.institucion_facebook),
      description: 'Noticias, comunicados y actividades',
    },
    {
      label: 'YouTube',
      icon: '▶',
      url: cleanValue(contactInfo?.institucion_youtube),
      description: 'Videos institucionales y transmisiones',
    },
    {
      label: 'Twitter / X',
      icon: '𝕏',
      url: cleanValue(contactInfo?.institucion_twitter),
      description: 'Actualizaciones rápidas de la carrera',
    },
  ].filter((item) => item.url)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormStatus('sending')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400))

      console.log('Formulario enviado:', formData)

      setFormStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })

      setTimeout(() => setFormStatus('idle'), 5000)
    } catch (error) {
      console.error('Error enviando formulario:', error)
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 5000)
    }
  } 

  return (
    <section id="contacto" className="relative overflow-hidden py-24 bg-white">
      
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
              Contacto institucional
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-5 tracking-tight">
            Ponte en Contacto
          </h2>

          <div
            className="w-28 h-1.5 mx-auto rounded-full mb-5"
            style={{
              background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`,
              boxShadow: `0 0 22px ${colorSecundario}55`,
            }}
          />

          <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Estamos aquí para responder tus preguntas y ayudarte a iniciar tu
            formación profesional en {nombreCarrera}.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10 items-start">
          
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-5 animate-pulse">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg"
                  >
                    <div className="h-5 w-2/3 bg-slate-200 rounded mb-3" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <>
               
                <article
                  className="group relative overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-500"
                  style={{ borderColor: `${colorPrimario}22` }}
                >
                  <div
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, ${colorSecundario}75, transparent 70%)`,
                    }}
                  />

                  <div className="relative flex gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                      style={{
                        background: `${colorPrimario}12`,
                        color: colorPrimario,
                      }}
                    >
                      📍
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950 mb-1">
                        Ubicación
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {cleanValue(contactInfo?.institucion_direccion) ||
                          'Dirección no disponible'}
                      </p>
                    </div>
                  </div>
                </article>
 
                <article
                  className="group relative overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-500"
                  style={{ borderColor: `${colorPrimario}22` }}
                >
                  <div className="relative flex gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                      style={{
                        background: `${colorPrimario}12`,
                        color: colorPrimario,
                      }}
                    >
                      📞
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950 mb-1">
                        Teléfonos
                      </h3>

                      {getPhones().length > 0 ? (
                        <div className="space-y-1">
                          {getPhones().map((phone, index) => (
                            <a
                              key={index}
                              href={`tel:${phone}`}
                              className="block text-slate-600 hover:underline font-medium"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600 font-medium">
                          No disponible
                        </p>
                      )}

                      <p className="text-sm text-slate-500 mt-2">
                        Lun - Vie: 8:00 - 18:00
                      </p>
                    </div>
                  </div>
                </article>
 
                <article
                  className="group relative overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-500"
                  style={{ borderColor: `${colorPrimario}22` }}
                >
                  <div className="relative flex gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                      style={{
                        background: `${colorPrimario}12`,
                        color: colorPrimario,
                      }}
                    >
                      ✉️
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950 mb-1">
                        Correo electrónico
                      </h3>

                      {getEmails().length > 0 ? (
                        <div className="space-y-1">
                          {getEmails().map((email, index) => (
                            <a
                              key={index}
                              href={`mailto:${email}`}
                              className="block font-bold hover:underline"
                              style={{ color: colorPrimario }}
                            >
                              {email}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600 font-medium">
                          No disponible
                        </p>
                      )}
                    </div>
                  </div>
                </article>
 
                {socialLinks.length > 0 && (
                  <article
                    className="group relative overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-500"
                    style={{ borderColor: `${colorSecundario}33` }}
                  >
                    <div
                      className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${colorSecundario}75, transparent 70%)`,
                      }}
                    />

                    <div className="relative flex gap-4 mb-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                        style={{
                          background: `${colorPrimario}12`,
                          color: colorPrimario,
                        }}
                      >
                        🌐
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-950 mb-1">
                          Redes sociales
                        </h3>

                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          Mantente informado sobre comunicados, eventos y
                          actividades oficiales de la carrera.
                        </p>
                      </div>
                    </div>

                    <div className="relative grid gap-3">
                      {socialLinks.map((item) => (
                        <a
                          key={item.label}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-4 rounded-2xl border bg-slate-50 px-4 py-3.5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                          style={{
                            borderColor: `${colorSecundario}45`,
                          }}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
                              style={{
                                background: `${colorPrimario}12`,
                                color: colorPrimario,
                              }}
                            >
                              {item.icon}
                            </span>

                            <span>
                              <span className="block text-slate-950 font-black">
                                {item.label}
                              </span>
                              <span className="block text-slate-500 text-xs font-semibold">
                                {item.description}
                              </span>
                            </span>
                          </span>

                          <span
                            className="font-black text-lg"
                            style={{ color: colorPrimario }}
                          >
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </article>
                )}
              </>
            )}
          </div>
 
          <div
            className="relative overflow-hidden rounded-[2rem] border bg-white p-6 md:p-8 shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
            style={{ borderColor: `${colorPrimario}24` }}
          >
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-35 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${colorSecundario}75, transparent 70%)`,
              }}
            />

            <div
              className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${colorPrimario}55, transparent 72%)`,
              }}
            />

            <div className="relative">
              <span
                className="text-xs font-extrabold uppercase tracking-[0.22em]"
                style={{ color: colorPrimario }}
              >
                Escríbenos
              </span>

              <h3 className="text-3xl md:text-4xl font-black text-slate-950 mt-2 mb-3">
                Envíanos un mensaje
              </h3>

              <p className="text-slate-600 font-medium mb-8">
                Completa el formulario y nos comunicaremos contigo lo antes
                posible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-black text-slate-900 mb-2"
                  >
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 focus:outline-none focus:ring-4 transition-all"
                    style={
                      {
                        '--tw-ring-color': `${colorSecundario}35`,
                      } as React.CSSProperties
                    }
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-black text-slate-900 mb-2"
                    >
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 focus:outline-none focus:ring-4 transition-all"
                      style={
                        {
                          '--tw-ring-color': `${colorSecundario}35`,
                        } as React.CSSProperties
                      }
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-black text-slate-900 mb-2"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 focus:outline-none focus:ring-4 transition-all"
                      style={
                        {
                          '--tw-ring-color': `${colorSecundario}35`,
                        } as React.CSSProperties
                      }
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-black text-slate-900 mb-2"
                  >
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 focus:outline-none focus:ring-4 transition-all resize-none"
                    style={
                      {
                        '--tw-ring-color': `${colorSecundario}35`,
                      } as React.CSSProperties
                    }
                    placeholder="Escribe tu mensaje..."
                  />
                </div>

                {formStatus === 'success' && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 font-bold">
                    Mensaje enviado correctamente. Pronto nos comunicaremos
                    contigo.
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-bold">
                    No se pudo enviar el mensaje. Inténtalo nuevamente.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 rounded-2xl text-white font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                    boxShadow: `0 18px 34px ${colorPrimario}24`,
                  }}
                >
                  {formStatus === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </div>
          </div>
        </div>
 
        <div className="mt-12">
          <div
            className="relative overflow-hidden rounded-[2rem] border bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
            style={{
              borderColor: `${colorPrimario}24`,
            }}
          >
            <div className="relative overflow-hidden rounded-[1.5rem] h-[360px] md:h-[470px] bg-slate-100">
              {contactInfo?.googleMapUrl ? (
                <iframe
                  src={contactInfo.googleMapUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa ${nombreCarrera}`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-2xl font-black text-slate-950 mb-2">
                    Mapa no disponible
                  </h3>
                  <p className="text-slate-600 font-medium">
                    La ubicación se mostrará aquí cuando esté registrada en el
                    servicio.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}