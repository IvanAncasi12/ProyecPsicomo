'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'

export default function Team() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const autoridades = contenidoRes.data?.autoridad || []
        const teamFormateado = autoridades.map((member: any) => ({
          ...member,
          foto_url: member.foto_autoridad?.startsWith('http') 
            ? member.foto_autoridad 
            : `${baseUrl}${member.foto_autoridad}`
        }))
        setTeam(teamFormateado)

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)
      } catch (error) {
        console.warn('Error cargando equipo/autoridades')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#DC0E10'
  const colorSecundario = colores?.color_secundario || '#E9C202'
  const defaultAvatar = "https://ui-avatars.com/api/?background=DC0E10&color=fff&size=128&font-size=0.4&name=UPEA"

  return (
    <section id="equipo" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Autoridades y Docentes
          </h2>
          <div 
            className="w-24 h-1 mx-auto rounded-full mb-4"
            style={{ backgroundColor: colorSecundario }}
          />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Profesionales con experiencia y compromiso con la educación de excelencia
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">
            Cargando equipo directivo...
          </div>
        ) : team.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.id_autoridad || index}
                className="group bg-background rounded-2xl border border-border p-8 text-center hover:shadow-2xl hover:border-accent/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 transition-colors duration-300 group-hover:border-accent"
                     style={{ borderColor: colorPrimario }}>
                  <img
                    src={member.foto_url || defaultAvatar}
                    alt={member.nombre_autoridad}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultAvatar
                    }}
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.nombre_autoridad}
                </h3>
                
                <p 
                  className="font-semibold mb-3 text-sm uppercase tracking-wider"
                  style={{ color: colorSecundario }}
                >
                  {member.cargo_autoridad}
                </p>
                {member.celular_autoridad && member.celular_autoridad !== '_' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                    📞 <span className="font-medium">{member.celular_autoridad}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-background/50 rounded-xl border border-dashed border-border">
            No hay autoridades registradas en este momento.
          </div>
        )}
      </div>
    </section>
  )
}