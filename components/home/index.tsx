// components/home/index.tsx
'use client'

import Hero from './Hero'
import About from './About'
import Programs from './Programs'
import Team from './Team'
import Contact from './Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <About />
      <Programs />
      <Team />
      <Contact />
    </main>
  )
}
export { Hero, About, Programs, Team, Contact }