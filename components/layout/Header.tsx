'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const [logoUrl, setLogoUrl] = useState('https://ui-avatars.com/api/?name=UPEA&background=DC0E10&color=fff&size=128')
  const [nombreInstitucion, setNombreInstitucion] = useState('Carrera de Derecho')
  const [colores, setColores] = useState({ primario: '#DC0E10', secundario: '#E9C202' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const res = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = res.data?.Descripcion

        if (data?.institucion_logo) {
          const logo = data.institucion_logo
          setLogoUrl(logo.startsWith('http') ? logo : `${baseUrl}${logo}`)
        }
        if (data?.institucion_nombre) setNombreInstitucion(`Carrera de ${data.institucion_nombre}`)
        
        const cols = data?.colorinstitucion?.[0]
        if (cols) {
          setColores({
            primario: cols.color_primario || '#DC0E10',
            secundario: cols.color_secundario || '#E9C202'
          })
        }
      } catch (error) { console.warn('Error Header:', error) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', colores.primario)
    document.documentElement.style.setProperty('--accent', colores.secundario)
  }, [colores])

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null)
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeDropdown])

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(prev => prev === menu ? null : menu)
  }

  return (
    <header className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: colores.primario, color: '#fff' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          
          <Link href="/" className="flex items-center space-x-3 group" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 border border-white/20">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
            <span className="font-bold text-lg hidden sm:block">{nombreInstitucion}</span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition">Inicio</Link>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => toggleDropdown('carrera')} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 flex items-center gap-1 transition">
                Carrera
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'carrera' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeDropdown === 'carrera' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link href="/carrera/nosotros" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Nosotros</Link>
                  <Link href="/carrera/autoridades" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Autoridades</Link>
                </div>
              )}
            </div>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => toggleDropdown('academico')} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 flex items-center gap-1 transition">
                Académico
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'academico' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeDropdown === 'academico' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link href="/academico/cursos" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Cursos</Link>
                  <Link href="/academico/seminarios" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Seminarios</Link>
                  <Link href="/academico/convocatorias" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Convocatorias</Link>
                  <Link href="/academico/ofertas-academicas" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Ofertas Académicas</Link>
                  <Link href="/academico/gacetas" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Gacetas</Link>
                </div>
              )}
            </div>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => toggleDropdown('comunicados')} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 flex items-center gap-1 transition">
                Comunicados
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'comunicados' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeDropdown === 'comunicados' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link href="/comunicados/avisos" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Avisos</Link>
                  <Link href="/comunicados/comunicados" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Comunicados</Link>
                  <Link href="/comunicados/servicios" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>Servicios</Link>
                </div>
              )}
            </div>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => toggleDropdown('eventos')} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 flex items-center gap-1 transition">
                Eventos
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'eventos' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'eventos' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link href="/eventos/eventos" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>📅 Eventos</Link>
                  <Link href="/eventos/talleres" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition" onClick={() => setActiveDropdown(null)}>🎯 Talleres</Link>
                </div>
              )}
            </div>
            <Link href="/enlaces" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition">Enlaces</Link>
            <Link href="/contacto" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition">Contacto</Link>
          </div>
          <a
            href="https://servicioadministrador.upea.bo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition hover:opacity-90 border border-white/30 hover:border-white/60"
            style={{ backgroundColor: colores.secundario, color: '#000' }}
          >
            Iniciar Sesión
          </a>

          {/* Mobile Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-white/10 pt-4">
            <Link href="/" className="block px-4 py-2 hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
            
            <div className="px-4 py-1 text-xs font-bold text-white/60 uppercase">Carrera</div>
            <Link href="/carrera/nosotros" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Nosotros</Link>
            <Link href="/carrera/autoridades" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Autoridades</Link>
            
            <div className="px-4 py-1 text-xs font-bold text-white/60 uppercase mt-2">Académico</div>
            <Link href="/academico/cursos" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Cursos</Link>
            <Link href="/academico/seminarios" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Seminarios</Link>
            <Link href="/academico/convocatorias" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Convocatorias</Link>
            <Link href="/academico/ofertas-academicas" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Ofertas</Link>
            <Link href="/academico/gacetas" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Gacetas</Link>

            <div className="px-4 py-1 text-xs font-bold text-white/60 uppercase mt-2">Comunicados</div>
            <Link href="/comunicados/avisos" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Avisos</Link>
            <Link href="/comunicados/comunicados" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Comunicados</Link>
            <Link href="/comunicados/servicios" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Servicios</Link>

            <div className="px-4 py-1 text-xs font-bold text-white/60 uppercase mt-2">Eventos</div>
            <Link href="/eventos/eventos" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Eventos</Link>
            <Link href="/eventos/talleres" className="block ml-4 px-4 py-2 text-sm hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Talleres</Link>

            {/* Enlaces y Contacto en móvil */}
            <Link href="/enlaces" className="block px-4 py-2 hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Enlaces</Link>
            <Link href="/contacto" className="block px-4 py-2 hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>

            <div className="border-t border-white/10 pt-2 mt-2">
              <a
                href="https://servicioadministrador.upea.bo"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: colores.secundario, color: '#000' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}