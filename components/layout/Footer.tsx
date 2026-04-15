'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion
        const socialLinks = {
          facebook: data?.institucion_facebook !== '_' ? data?.institucion_facebook : null,
          youtube: data?.institucion_youtube !== '_' ? data?.institucion_youtube : null,
          twitter: data?.institucion_twitter !== '_' ? data?.institucion_twitter : null,
        }

        setFooterData({
          ...data,
          socialLinks,
          baseUrl
        })
      } catch (error) {
        console.warn('⚠️ Error cargando datos del footer')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = footerData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#DC0E10'
  const colorSecundario = colores?.color_secundario || '#E9C202'
  const nombreCarrera = footerData?.institucion_nombre || 'Derecho'
  const nombreInstitucion = `Universidad Pública de El Alto - Carrera de ${nombreCarrera}`

  return (
    <footer 
      className="relative bg-primary text-primary-foreground"
      style={{ backgroundColor: colorPrimario }}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg"
                style={{ backgroundColor: colorSecundario, color: colorPrimario }}
              >
                ⚖️
              </div>
              <span className="font-bold text-lg">Carrera de {nombreCarrera}</span>
            </div>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              {footerData?.institucion_mision 
                ? footerData.institucion_mision.replace(/<[^>]*>/g, '').slice(0, 150) + '...'
                : 'Formando profesionales del derecho con excelencia académica y compromiso social.'}
            </p>
            {!loading && footerData?.socialLinks && (
              <div className="flex gap-3 mt-4">
                {footerData.socialLinks.facebook && (
                  <a
                    href={footerData.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Facebook"
                  >
                    📘
                  </a>
                )}
                {footerData.socialLinks.youtube && (
                  <a
                    href={footerData.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="YouTube"
                  >
                    📺
                  </a>
                )}
                {footerData.socialLinks.twitter && (
                  <a
                    href={footerData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Twitter"
                  >
                    🐦
                  </a>
                )}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#acerca', label: 'Nosotros' },
                { href: '#programas', label: 'Ofertas Académicas' },
                { href: '#equipo', label: 'Autoridades' },
                { href: '#contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-primary-foreground/90 hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Recursos</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Campus Virtual', url: 'https://virtualeconomia.upea.bo/' },
                { label: 'Inscripciones', url: 'https://inscripcioneseconomia.upea.bo/' },
                { label: 'Biblioteca Digital', url: '#' },
                { label: 'Plataforma de Cursos', url: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.url}
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-primary-foreground/90 hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-accent">📍</span>
                <p className="text-primary-foreground/90 leading-relaxed">
                  {footerData?.institucion_direccion || 'Av. Sucre Z. Villa Esperanza, Campus UPEA'}
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">📞</span>
                <div className="text-primary-foreground/90">
                  {footerData?.institucion_celular1 && <p>{footerData.institucion_celular1}</p>}
                  {footerData?.institucion_telefono1 && <p className="text-xs opacity-80">{footerData.institucion_telefono1}</p>}
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">✉️</span>
                <a 
                  href={`mailto:${footerData?.institucion_correo1}`}
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  {footerData?.institucion_correo1 || 'contacto@upea.bo'}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p className="text-center lg:text-left">
              &copy; {new Date().getFullYear()} {nombreInstitucion}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-accent transition">Privacidad</Link>
              <Link href="#" className="hover:text-accent transition">Términos</Link>
              <Link href="#" className="hover:text-accent transition">Cookies</Link>
              <a
              href="https://www.linkedin.com/in/ivan-ancasi-tumiri-a58764393?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              title="Perfil de LinkedIn del desarrollador"
            >
              <span className="font-bold text-accent group-hover:text-white transition-colors">
                I.A.T.
              </span>
              <span className="text-primary-foreground/80 group-hover:text-white transition-colors">
                Desarrollador
              </span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">
              </span>
            </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}