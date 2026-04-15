'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'
import styles from './Header.module.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [nombreInstitucion, setNombreInstitucion] = useState('Carrera')
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
    const root = document.documentElement
    root.style.setProperty('--header-bg', colores.primario)
    root.style.setProperty('--header-accent', colores.secundario)
  }, [colores])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(prev => prev === menu ? null : menu)
  }

  const menus = [
    { key: 'carrera', label: 'Carrera', items: [
      { label: 'Nosotros', href: '/carrera/nosotros' },
      { label: 'Autoridades', href: '/carrera/autoridades' }
    ]},
    { key: 'academico', label: 'Académico', items: [
      { label: 'Cursos', href: '/academico/cursos' },
      { label: 'Seminarios', href: '/academico/seminarios' },
      { label: 'Convocatorias', href: '/academico/convocatorias' },
      { label: 'Ofertas Académicas', href: '/academico/ofertas-academicas' },
      { label: 'Gacetas', href: '/academico/gacetas' }
    ]},
    { key: 'comunicados', label: 'Comunicados', items: [
      { label: 'Avisos', href: '/comunicados/avisos' },
      { label: 'Comunicados', href: '/comunicados/comunicados' },
      { label: 'Servicios', href: '/comunicados/servicios' }
    ]},
    { key: 'eventos', label: 'Eventos', items: [
      { label: 'Eventos', href: '/eventos/eventos' },
      { label: 'Talleres', href: '/eventos/talleres' }
    ]}
  ]

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        
        <Link href="/" className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoContainer}>
              <img 
                src={logoUrl || 'https://ui-avatars.com/api/?name=UPEA&background=DC0E10&color=fff&size=128'} 
                alt="Logo" 
              />
            </div>
          </div>
          <span className={styles.institutionName}>{nombreInstitucion}</span>
        </Link>

        <div className={styles.desktopNav}>
          <Link href="/" className={styles.navLink}>Inicio</Link>
          
          {menus.map((menu) => (
            <div key={menu.key} className={styles.dropdownWrapper}>
              <button 
                onClick={() => toggleDropdown(menu.key)} 
                className={`${styles.dropdownButton} ${activeDropdown === menu.key ? 'active' : ''}`}
                type="button"
              >
                {menu.label}
                <svg className={styles.dropdownArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === menu.key && (
                <div className={styles.dropdownMenu}>
                  {menu.items.map((item, idx) => (
                    <Link key={idx} href={item.href} className={styles.dropdownItem}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/enlaces" className={styles.navLink}>Enlaces</Link>
          <Link href="/contacto" className={styles.navLink}>Contacto</Link>
        </div>

        <div className={styles.loginSection}>
          <a
            href="https://servicioadministrador.upea.bo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.loginBtn}
          >
            Iniciar Sesión
          </a>
        </div>

        <button 
          type="button"
          className={styles.mobileMenuBtn} 
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </nav>

      <div 
        className={styles.mobileMenu}
        style={{
          display: mobileMenuOpen ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          zIndex: 40,
          padding: '1rem 0',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Link 
          href="/" 
          className={styles.mobileLink}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: 'block',
            padding: '1rem 1.5rem',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          Inicio
        </Link>

        {menus.map((menu) => (
          <div key={menu.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={() => toggleDropdown(menu.key)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {menu.label}
              <svg 
                className={`transition-transform ${activeDropdown === menu.key ? 'rotate-180' : ''}`}
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {activeDropdown === menu.key && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {menu.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.875rem 1.5rem 0.875rem 2.5rem',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.9rem',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <Link 
          href="/enlaces" 
          className={styles.mobileLink}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: 'block',
            padding: '1rem 1.5rem',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          Enlaces
        </Link>
        
        <Link 
          href="/contacto" 
          className={styles.mobileLink}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: 'block',
            padding: '1rem 1.5rem',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          Contacto
        </Link>

        <div style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <a
            href="https://servicioadministrador.upea.bo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '1rem',
              background: `linear-gradient(135deg, ${colores.secundario}, ${colores.secundario}cc)`,
              color: '#000',
              textAlign: 'center',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </header>
  )
}