import axios from 'axios';

// Instancia base de axios configurada
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_V2,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    
    // Manejo de errores específico
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      switch (error.response.status) {
        case 401:
          console.error('No autorizado - Verifica el token');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error del servidor');
          break;
        default:
          console.error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
    } else if (error.request) {
      // La solicitud se hizo pero no hubo respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Algo pasó al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Función helper para obtener el ID de institución
export const getInstitucionId = (): string => {
  return process.env.NEXT_PUBLIC_INSTITUCION_ID || '22';
};

// URLs específicas de la API
export const apiEndpoints = {
  institucionPrincipal: (id: string = getInstitucionId()) => 
    `/institucionesPrincipal/${id}`,
  
  institucionContenido: (id: string = getInstitucionId()) => 
    `/institucion/${id}/contenido`,
  
  institucionRecursos: (id: string = getInstitucionId()) => 
    `/institucion/${id}/recursos`,
  
  institucionEventos: (id: string = getInstitucionId()) => 
    `/institucion/${id}/gacetaEventos`,
};