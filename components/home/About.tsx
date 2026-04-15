'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'

export default function About() {
  const [mision, setMision] = useState('')
  const [vision, setVision] = useState('')
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion
        setInstitucionData(data)
        
        if (data) {
          setMision(data.institucion_mision || '')
          setVision(data.institucion_vision || '')
        }

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const videos = contenidoRes.data?.upea_videos || []
        if (videos.length > 0) {
          setVideo(videos[0])
        }
      } catch (error) {
        console.warn('Error cargando datos del About')
        setMision('<p>Formación integral de profesionales con excelencia académica</p>')
        setVision('<p>Ser líderes en educación superior con proyección internacional</p>')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#DC0E10'
  const colorSecundario = colores?.color_secundario || '#E9C202'

  const misionLimpia = mision.replace(/<[^>]*>/g, '').slice(0, 200) + '...'
  const visionLimpia = vision.replace(/<[^>]*>/g, '').slice(0, 200) + '...'

  return (
    <section id="acerca" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            NUESTRA CARRERA
          </h2>
          <div 
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: colorSecundario }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="group relative bg-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4"
               style={{ borderColor: colorPrimario }}>
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                 style={{ backgroundColor: colorPrimario, color: 'white' }}>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 mt-2">Misión</h3>
            <div 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: mision || '<p>Cargando...</p>' }}
            />
          </div>
          <div className="group relative bg-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4"
               style={{ borderColor: colorSecundario }}>
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                 style={{ backgroundColor: colorSecundario, color: 'white' }}>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 mt-2">Visión</h3>
            <div 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: vision || '<p>Cargando...</p>' }}
            />
          </div>
        </div>
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">CONOCE LA CARRERA</h3>
            <div 
              className="w-16 h-1 mx-auto rounded-full"
              style={{ backgroundColor: colorPrimario }}
            />
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
            {video ? (
              <iframe
                src={video.video_enlace || video.video_url}
                title={video.video_titulo || 'Video Institucional'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-xl">Video institucional próximamente</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 pt-16 border-t"
             style={{ borderColor: `${colorPrimario}30` }}>
        
          <div className="text-center group p-6 rounded-xl bg-card hover:shadow-xl transition-all duration-300">
           <div
                  className="text-6xl font-black mb-3 transition-transform group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
              25+
            </div>
            <p className="text-muted-foreground font-semibold text-lg">Años de Trayectoria</p>
            <p className="text-sm text-muted-foreground mt-1">Formando profesionales desde 1998</p>
          </div>
          <div className="text-center group p-6 rounded-xl bg-card hover:shadow-xl transition-all duration-300">
              <div
                className="text-6xl font-black mb-3 transition-transform group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
              3,500+
            </div>
            <p className="text-muted-foreground font-semibold text-lg">Egresados Exitosos</p>
            <p className="text-sm text-muted-foreground mt-1">Líderes en el ámbito profesional</p>
          </div>
         <div className="text-center group p-6 rounded-xl bg-card hover:shadow-xl transition-all duration-300">
            <div
              className="text-6xl font-black mb-3 transition-transform group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              1,200+
            </div>
            <p className="text-muted-foreground font-semibold text-lg">Estudiantes Activos</p>
            <p className="text-sm text-muted-foreground mt-1">Formándose actualmente</p>
          </div>
        </div>
      </div>
    </section>
  )
}