'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'

export default function Programs() {
  const [ofertas, setOfertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        // 1. Traer datos generales para colores
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        // 2. Traer ofertas académicas
        const recursosRes = await apiClient.get(`/institucion/${id}/gacetaEventos `)
        const ofertasData = recursosRes.data?.ofertasAcademicas?.filter((o: any) => o.ofertas_estado === 1) || []
        
        // Formatear imágenes (relativas -> absolutas)
        const ofertasFormateadas = ofertasData.map((oferta: any) => ({
          ...oferta,
          ofertas_imagen_url: oferta.ofertas_imagen?.startsWith('http') 
            ? oferta.ofertas_imagen 
            : `${baseUrl}${oferta.ofertas_imagen}`
        }))

        setOfertas(ofertasFormateadas)
      } catch (error) {
        console.warn('Error cargando ofertas académicas')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Colores dinámicos
  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#DC0E10'
  const colorSecundario = colores?.color_secundario || '#E9C202'
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section id="programas" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ofertas Académicas
          </h2>
          <div 
            className="w-24 h-1 mx-auto rounded-full mb-4"
            style={{ backgroundColor: colorSecundario }}
          />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oportunidades de estudio y capacitación para tu desarrollo profesional
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">
            Cargando ofertas académicas...
          </div>
        ) : ofertas.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {ofertas.map((program, index) => (
              <div
                key={program.ofertas_id}
                className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={program.ofertas_imagen_url || 'https://via.placeholder.com/800x400?text=Oferta+Académica'}
                    alt={program.ofertas_titulo}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Inscripciones Abiertas
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {program.ofertas_titulo}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3" 
                     dangerouslySetInnerHTML={{ __html: program.ofertas_descripcion || 'Sin descripción disponible.' }} 
                  />
                  <div className="grid grid-cols-1 gap-3 mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">📅 Inicio:</span>
                      <span className="text-muted-foreground">{formatDate(program.ofertas_inscripciones_ini)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">🏁 Fin Inscripciones:</span>
                      <span className="text-muted-foreground">{formatDate(program.ofertas_inscripciones_fin)}</span>
                    </div>
                    {program.ofertas_referencia && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-foreground">📞 Referencia:</span>
                        <span className="text-accent font-medium">{program.ofertas_referencia}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                    style={{ 
                      backgroundColor: colorPrimario,
                      color: 'white'
                    }}
                  >
                    Ver Requisitos
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No hay ofertas académicas disponibles en este momento.
          </div>
        )}
      </div>
    </section>
  )
}