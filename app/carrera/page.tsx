import PortadaCarrera from '@/components/carrera/PortadaCarrera'
import MenuCarrera from '@/components/carrera/MenuCarrera'
import GaleriaCarrera from '@/components/carrera/GaleriaCarrera'

export default function CarreraPage() {
  return (
    <>
      <PortadaCarrera titulo="Facultad de Derecho" subtitulo="Excelencia Académica" />
      <MenuCarrera />
      <GaleriaCarrera />
    </>
  )
}