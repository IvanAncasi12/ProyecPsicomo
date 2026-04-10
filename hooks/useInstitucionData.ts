import { useEffect } from 'react';
import { useInstitucionStore } from '@/store/useInstitucionStore';

export const useInstitucionData = () => {
  const {
    principal,
    contenido,
    recursos,
    eventos,
    loading,
    error,
    fetchAllData,
    clearError,
  } = useInstitucionStore();

  useEffect(() => {
    // Solo fetch si no hay datos
    if (!principal && !contenido && !recursos && !eventos) {
      fetchAllData();
    }
  }, []);

  return {
    // Datos
    principal,
    contenido,
    recursos,
    eventos,
    
    // Estados
    loading,
    error,
    
    // Acciones
    refetch: fetchAllData,
    clearError,
    
    // Helpers útiles
    getLogo: () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      return principal?.Descripcion.institucion_logo 
        ? `${baseUrl}${principal.Descripcion.institucion_logo}`
        : '/logo-default.png';
    },
    
    getColores: () => {
      const colores = principal?.Descripcion.colorinstitucion?.[0];
      return {
        primario: colores?.color_primario || '#DC0E10',
        secundario: colores?.color_secundario || '#E9C202',
        terciario: colores?.color_terciario || '#060705',
      };
    },
    
    getAutoridades: () => contenido?.autoridad || [],
    getPortadas: () => contenido?.portada || [],
    getEventos: () => eventos?.upea_evento || [],
    getCursos: () => eventos?.cursos || [],
    getConvocatorias: () => eventos?.convocatorias || [],
  };
};