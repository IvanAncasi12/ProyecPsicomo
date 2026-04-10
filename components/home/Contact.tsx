'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        // Traer datos de contacto principales
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion
        
        // Formatear mapa de Google (si es relativo, agregar dominio)
        let googleMapUrl = data?.institucion_api_google_map || ''
        if (googleMapUrl && !googleMapUrl.startsWith('http')) {
          googleMapUrl = `${baseUrl}${googleMapUrl}`
        }

        setContactInfo({
          ...data,
          googleMapUrl
        })
      } catch (error) {
        console.warn('⚠️ Error cargando información de contacto')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Colores dinámicos
  const colores = contactInfo?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#DC0E10'
  const colorSecundario = colores?.color_secundario || '#E9C202'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    
    try {
      // Aquí puedes conectar con tu endpoint de envío de correos
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('📩 Formulario enviado:', formData)
      setFormStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      setTimeout(() => setFormStatus('idle'), 5000)
    } catch (error) {
      console.error('❌ Error enviando formulario:', error)
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 5000)
    }
  }

  // Helper para mostrar teléfonos
  const getPhones = () => {
    const phones = []
    if (contactInfo?.institucion_celular1) phones.push(`📱 ${contactInfo.institucion_celular1}`)
    if (contactInfo?.institucion_celular2 && contactInfo.institucion_celular2 !== contactInfo.institucion_celular1) {
      phones.push(`📱 ${contactInfo.institucion_celular2}`)
    }
    if (contactInfo?.institucion_telefono1) phones.push(`☎️ ${contactInfo.institucion_telefono1}`)
    if (contactInfo?.institucion_telefono2 && contactInfo.institucion_telefono2 !== contactInfo.institucion_telefono1) {
      phones.push(`☎️ ${contactInfo.institucion_telefono2}`)
    }
    return phones.length > 0 ? phones : ['No disponible']
  }

  // Helper para mostrar emails
  const getEmails = () => {
    const emails = []
    if (contactInfo?.institucion_correo1) emails.push(contactInfo.institucion_correo1)
    if (contactInfo?.institucion_correo2 && contactInfo.institucion_correo2 !== contactInfo.institucion_correo1) {
      emails.push(contactInfo.institucion_correo2)
    }
    return emails.length > 0 ? emails : ['No disponible']
  }

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* 📍 Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Ponte en contacto
              </h2>
              <div 
                className="w-24 h-1 rounded-full mb-4"
                style={{ backgroundColor: colorSecundario }}
              />
              <p className="text-xl text-muted-foreground">
                Estamos aquí para responder tus preguntas y ayudarte a iniciar tu formación profesional
              </p>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dirección */}
                <div className="flex gap-4 group">
                  <div 
                    className="text-3xl p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: `${colorPrimario}15`, color: colorPrimario }}
                  >
                    📍
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Ubicación</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactInfo?.institucion_direccion || 'Dirección no disponible'}
                    </p>
                  </div>
                </div>

                {/* Teléfonos */}
                <div className="flex gap-4 group">
                  <div 
                    className="text-3xl p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: `${colorPrimario}15`, color: colorPrimario }}
                  >
                    📞
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Teléfonos</h3>
                    <div className="space-y-1">
                      {getPhones().map((phone, i) => (
                        <p key={i} className="text-muted-foreground">{phone}</p>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Lun - Vie: 8:00 - 18:00
                    </p>
                  </div>
                </div>

                {/* Emails */}
                <div className="flex gap-4 group">
                  <div 
                    className="text-3xl p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: `${colorPrimario}15`, color: colorPrimario }}
                  >
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <div className="space-y-1">
                      {getEmails().map((email, i) => (
                        <a 
                          key={i}
                          href={`mailto:${email}`}
                          className="text-muted-foreground hover:underline transition-colors block"
                          style={{ color: colorPrimario }}
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Redes Sociales */}
                {(contactInfo?.institucion_facebook || contactInfo?.institucion_youtube || contactInfo?.institucion_twitter) && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-3">Síguenos</h3>
                    <div className="flex gap-3">
                      {contactInfo.institucion_facebook && contactInfo.institucion_facebook !== '_' && (
                        <a
                          href={contactInfo.institucion_facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-110"
                          style={{ backgroundColor: `${colorPrimario}20`, color: colorPrimario }}
                          aria-label="Facebook"
                        >
                          📘
                        </a>
                      )}
                      {contactInfo.institucion_youtube && contactInfo.institucion_youtube !== '_' && (
                        <a
                          href={contactInfo.institucion_youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-110"
                          style={{ backgroundColor: `${colorPrimario}20`, color: colorPrimario }}
                          aria-label="YouTube"
                        >
                          📺
                        </a>
                      )}
                      {contactInfo.institucion_twitter && contactInfo.institucion_twitter !== '_' && (
                        <a
                          href={contactInfo.institucion_twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-110"
                          style={{ backgroundColor: `${colorPrimario}20`, color: colorPrimario }}
                          aria-label="Twitter"
                        >
                          🐦
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 📝 Formulario de Contacto */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'transparent',
                  '--tw-ring-color': `${colorSecundario}40`,
                  '--tw-ring-opacity': '1'
                } as React.CSSProperties}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'transparent',
                  '--tw-ring-color': `${colorSecundario}40`,
                  '--tw-ring-opacity': '1'
                } as React.CSSProperties}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'transparent',
                  '--tw-ring-color': `${colorSecundario}40`,
                  '--tw-ring-opacity': '1'
                } as React.CSSProperties}
                placeholder="Tu teléfono (opcional)"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                Mensaje *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 transition-all resize-none"
                style={{ 
                  borderColor: 'transparent',
                  '--tw-ring-color': `${colorSecundario}40`,
                  '--tw-ring-opacity': '1'
                } as React.CSSProperties}
                placeholder="Tu consulta o mensaje..."
              />
            </div>

            {/* Estado del formulario */}
            {formStatus === 'success' && (
              <div className="p-4 rounded-lg bg-green-100 text-green-800 text-sm font-medium">
                ✅ ¡Mensaje enviado! Te responderemos pronto.
              </div>
            )}
            {formStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-100 text-red-800 text-sm font-medium">
                ❌ Ocurrió un error. Por favor intenta nuevamente.
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ 
                backgroundColor: colorPrimario,
                color: 'white'
              }}
            >
              {formStatus === 'sending' ? 'Enviando...' : 'Enviar Consulta'}
            </button>
          </form>
        </div>
        
        {contactInfo?.googleMapUrl && (
          <div className="mt-20 pt-12 border-t border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Nuestra Ubicación</h3>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border h-80 md:h-96">
              <iframe
                src={contactInfo.googleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la Facultad"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}