'use client'
import Link from 'next/link'

export default function MenuCarrera() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/carrera/nosotros" className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-red-500 transition-all duration-300 text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-red-600">Nosotros</h2>
            <p className="text-gray-500">Historia, Misión, Visión y Objetivos</p>
          </Link>
          <Link href="/carrera/autoridades" className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-600 transition-all duration-300 text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👔</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">Autoridades</h2>
            <p className="text-gray-500">Director, Docentes y Centro de Estudiantes</p>
          </Link>
        </div>
      </div>
    </section>
  )
}