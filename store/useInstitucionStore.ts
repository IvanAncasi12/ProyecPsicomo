import { create } from 'zustand';
import { apiClient, apiEndpoints } from '@/lib/axios';
import { 
  InstitucionData,
  InstitucionPrincipal,
  InstitucionContenido,
  InstitucionRecursos,
  InstitucionEventos
} from '@/types/api';

interface InstitucionStore extends InstitucionData {
  // Actions
  fetchInstitucionPrincipal: () => Promise<void>;
  fetchInstitucionContenido: () => Promise<void>;
  fetchInstitucionRecursos: () => Promise<void>;
  fetchInstitucionEventos: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
}

const initialState: InstitucionData = {
  principal: null,
  contenido: null,
  recursos: null,
  eventos: null,
  loading: false,
  error: null,
};

export const useInstitucionStore = create<InstitucionStore>((set, get) => ({
  ...initialState,

  fetchInstitucionPrincipal: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<InstitucionPrincipal>(
        apiEndpoints.institucionPrincipal()
      );
      set({ principal: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cargar datos principales',
        loading: false 
      });
    }
  },

  fetchInstitucionContenido: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<InstitucionContenido>(
        apiEndpoints.institucionContenido()
      );
      set({ contenido: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cargar contenido',
        loading: false 
      });
    }
  },

  fetchInstitucionRecursos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<InstitucionRecursos>(
        apiEndpoints.institucionRecursos()
      );
      set({ recursos: response.data, loading: false });
    } catch (error: any) {
      // Manejo de error específico - si no hay recursos, no es crítico
      console.warn('No se pudieron cargar los recursos:', error.message);
      set({ 
        recursos: {
          upea_publicaciones: [],
          linksExternoInterno: [],
          links: []
        },
        loading: false 
      });
    }
  },

  fetchInstitucionEventos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<InstitucionEventos>(
        apiEndpoints.institucionEventos()
      );
      set({ eventos: response.data, loading: false });
    } catch (error: any) {
      // Manejo de error - si no hay eventos, inicializamos con arrays vacíos
      console.warn('No se pudieron cargar los eventos:', error.message);
      set({ 
        eventos: {
          upea_gaceta_universitaria: [],
          upea_evento: [],
          cursos: [],
          convocatorias: [],
          serviciosCarrera: [],
          ofertasAcademicas: []
        },
        loading: false 
      });
    }
  },

  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      // Ejecutamos todas las peticiones en paralelo
      const [principal, contenido, recursos, eventos] = await Promise.all([
        apiClient.get<InstitucionPrincipal>(apiEndpoints.institucionPrincipal()).catch(() => null),
        apiClient.get<InstitucionContenido>(apiEndpoints.institucionContenido()).catch(() => null),
        apiClient.get<InstitucionRecursos>(apiEndpoints.institucionRecursos()).catch(() => null),
        apiClient.get<InstitucionEventos>(apiEndpoints.institucionEventos()).catch(() => null),
      ]);

      set({
        principal: principal?.data || null,
        contenido: contenido?.data || null,
        recursos: recursos?.data || {
          upea_publicaciones: [],
          linksExternoInterno: [],
          links: []
        },
        eventos: eventos?.data || {
          upea_gaceta_universitaria: [],
          upea_evento: [],
          cursos: [],
          convocatorias: [],
          serviciosCarrera: [],
          ofertasAcademicas: []
        },
        loading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cargar todos los datos',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),

  resetStore: () => set(initialState),
}));