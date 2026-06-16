'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null)

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'

  function cleanValue(value?: string | null) {
    if (!value) return ''
    const clean = String(value).trim()
    return clean === '_' ? '' : clean
  }

  function cleanHtml(text?: string | null) {
    if (!text) return ''

    return String(text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

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

    return `${cleanBase}/InstitucionUpea/${imageClean}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion

        const logoRaw =
          data?.institucion_logo ||
          data?.institucion_imagen ||
          data?.institucion_logo_url ||
          data?.institucion_escudo ||
          ''

        const socialLinks = [
          {
            label: 'Facebook',
            icon: 'f',
            url: cleanValue(data?.institucion_facebook),
          },
          {
            label: 'YouTube',
            icon: '▶',
            url: cleanValue(data?.institucion_youtube),
          },
          {
            label: 'Twitter / X',
            icon: '𝕏',
            url: cleanValue(data?.institucion_twitter),
          },
        ].filter((item) => item.url)

        setFooterData({
          ...data,
          logoUrl: buildImageUrl(logoRaw),
          socialLinks,
        })
      } catch (error) {
        console.warn('Error cargando datos del footer', error)
      }
    }

    fetchData()
  }, [])

  const colores = footerData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  const nombreCarrera = footerData?.institucion_nombre || 'Derecho'
  const nombreInstitucion = `Universidad Pública de El Alto - ${nombreCarrera}`

  const mision =
    cleanHtml(footerData?.institucion_mision).slice(0, 120) ||
    'Formando profesionales con excelencia académica y compromiso social.'

  const direccion =
    cleanValue(footerData?.institucion_direccion) ||
    'Av. Sucre Z. Villa Esperanza, Campus UPEA'

  const telefonoPrincipal =
    cleanValue(footerData?.institucion_celular1) ||
    cleanValue(footerData?.institucion_telefono1)

  const correo =
    cleanValue(footerData?.institucion_correo1) ||
    cleanValue(footerData?.institucion_correo2) ||
    'contacto@upea.bo'

  const quickLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/carrera', label: 'Nosotros' },
    { href: '/academico/ofertas-academicas', label: 'Ofertas Académicas' },
    { href: '/carrera/autoridades', label: 'Autoridades' },
    { href: '/contacto', label: 'Contacto' },
  ]

  const resources = [
    {
      label: 'Campus Virtual',
      url: 'https://virtual.upea.bo/',
    },
    {
      label: 'Inscripciones',
      url: '#',
    },
    {
      label: 'Biblioteca Digital',
      url: '#',
    },
    {
      label: 'Plataforma de Cursos',
      url: '#',
    },
  ]

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{
        background: `
          radial-gradient(circle at 12% 10%, ${colorSecundario}18, transparent 23%),
          radial-gradient(circle at 90% 82%, ${colorPrimario}45, transparent 30%),
          linear-gradient(135deg, ${colorPrimario} 0%, #300414 42%, #020617 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorSecundario}, transparent)`,
        }}
      />

      <div className="absolute inset-0 opacity-[0.045] pointer-events-none bg-[linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(180deg,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">
        <div className="grid lg:grid-cols-[1.05fr_0.75fr_0.75fr_1fr] md:grid-cols-2 gap-7 lg:gap-9 mb-8">
       
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 backdrop-blur-md p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-13 h-13 shrink-0">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-70"
                  style={{
                    background: `radial-gradient(circle, ${colorSecundario}, transparent 70%)`,
                  }}
                />

                <div className="relative w-13 h-13 rounded-full bg-white p-2 shadow-lg flex items-center justify-center">
                  {footerData?.logoUrl ? (
                    <img
                      src={footerData.logoUrl}
                      alt={`Logo ${nombreCarrera}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <span
                      className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    >
                      D
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-white/55 text-[0.65rem] font-black uppercase tracking-[0.18em] mb-0.5">
                  Carrera
                </span>
                <h3 className="text-xl md:text-2xl font-black leading-tight">
                  {nombreCarrera}
                </h3>
              </div>
            </div>

            <p className="text-white/72 text-sm leading-relaxed font-medium">
              {mision}
              {mision.length >= 120 ? '...' : ''}
            </p>

            {footerData?.socialLinks?.length > 0 && (
              <div className="mt-4">
                <span className="block text-white/50 text-[0.65rem] font-black uppercase tracking-[0.16em] mb-2">
                  Redes oficiales
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {footerData.socialLinks.map((item: any) => (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-9 h-9 rounded-full bg-white/10 border border-white/12 flex items-center justify-center font-black text-base hover:bg-white hover:-translate-y-1 transition-all duration-300"
                      style={{ color: colorSecundario }}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <span className="group-hover:text-slate-950 transition-colors">
                        {item.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
 
          <div>
            <h4 className="font-black mb-4 text-base text-white">
              Enlaces Rápidos
            </h4>

            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-white/72 hover:text-white transition-colors"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: colorSecundario }}
                    />
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h4 className="font-black mb-4 text-base text-white">
              Recursos
            </h4>

            <ul className="space-y-2.5 text-sm">
              {resources.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel={
                      item.url.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group flex items-center gap-3 text-white/72 hover:text-white transition-colors"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: colorSecundario }}
                    />
                    <span className="font-semibold">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h4 className="font-black mb-4 text-base text-white">
              Contacto
            </h4>

            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span
                  className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-sm"
                  style={{ color: colorSecundario }}
                >
                  📍
                </span>
                <p className="text-white/72 leading-relaxed font-medium">
                  {direccion}
                </p>
              </li>

              <li className="flex gap-3">
                <span
                  className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-sm"
                  style={{ color: colorSecundario }}
                >
                  📞
                </span>

                {telefonoPrincipal ? (
                  <a
                    href={`tel:${telefonoPrincipal}`}
                    className="text-white/72 hover:text-white transition-colors font-medium"
                  >
                    {telefonoPrincipal}
                  </a>
                ) : (
                  <p className="text-white/72 font-medium">No disponible</p>
                )}
              </li>

              <li className="flex gap-3">
                <span
                  className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-sm"
                  style={{ color: colorSecundario }}
                >
                  ✉️
                </span>

                <a
                  href={`mailto:${correo}`}
                  className="text-white/72 hover:text-white transition-colors font-medium break-all"
                >
                  {correo}
                </a>
              </li>
            </ul>
          </div>
        </div>
 
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-xs md:text-sm text-white/62">
            <p className="text-center lg:text-left font-medium">
              &copy; {new Date().getFullYear()} {nombreInstitucion}. Todos los
              derechos reservados.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://utic.upea.bo/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <img
                  src="/LOGOUTIC.png"
                  alt="U-TIC"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 hover:scale-110 transition-transform duration-300"
                />
              </a>

              <p className="flex items-center gap-1 text-slate-500">
                IAT U - TIC
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}