// app/contacto/page.tsx
import Contact from '@/components/home/Contact'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function ContactoPage() {
  return (
    <>
      <PortadaSeccion titulo="Contacto" subtitulo="Estamos aquí para ayudarte" />
      <Contact />
    </>
  )
}