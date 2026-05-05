// app/contacto/page.tsx

import Contact from '@/components/home/Contact'
import PageHero from '@/components/shared/PageHero'

export default function ContactoPage() {
  return (
    <>
      <PageHero titulo="Contacto" />
      <Contact />
    </>
  )
}