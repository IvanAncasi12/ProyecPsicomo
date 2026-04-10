// Tipos para la respuesta de institucionesPrincipal
export interface InstitucionPrincipal {
  Descripcion: {
    institucion_id: number;
    institucion_nombre: string;
    institucion_iniciales: string;
    institucion_nombre_iniciales: string;
    institucion_logo: string;
    institucion_historia: string;
    institucion_mision: string;
    institucion_vision: string;
    institucion_facebook: string;
    institucion_youtube: string;
    institucion_twitter: string;
    institucion_direccion: string;
    institucion_celular1: number;
    institucion_celular2: number;
    institucion_telefono1: number;
    institucion_telefono2: number;
    institucion_correo1: string;
    institucion_correo2: string;
    institucion_api_google_map: string;
    institucion_objetivos: string;
    institucion_sobre_ins: string;
    institucion_link_video_vision: string;
    colorinstitucion: Array<{
      id_color: number;
      color_primario: string;
      color_secundario: string;
      color_terciario: string;
    }>;
  };
}

// Tipos para contenido (autoridades, portada, etc.)
export interface Autoridad {
  id_autoridad: number;
  foto_autoridad: string;
  nombre_autoridad: string;
  cargo_autoridad: string;
  facebook_autoridad: string;
  celular_autoridad: string;
  twiter_autoridad: string;
}

export interface Portada {
  portada_id: number;
  portada_imagen: string;
  portada_titulo: string;
  portada_subtitulo: string;
}

export interface Ubicacion {
  id_ubicacion: number;
  ubicacion_imagen: string;
  ubicacion_titulo: string;
  ubicacion_descripcion: string;
  ubicacion_latitud: string;
  ubicacion_longitud: string;
  ubicacion_estado: string;
}

export interface Video {
  video_id: number;
  video_enlace: string;
  video_titulo: string;
  video_breve_descripcion: string;
  video_estado: number;
  video_tipo: string;
}

export interface InstitucionContenido {
  autoridad: Autoridad[];
  portada: Portada[];
  ubicacion: Ubicacion[];
  upea_videos: Video[];
}

// Tipos para recursos
export interface Publicacion {
  publicaciones_id: number;
  publicaciones_titulo: string;
  publicaciones_imagen: string;
  publicaciones_descripcion: string;
  publicaciones_documento: string;
  publicaciones_fecha: string;
  publicaciones_autor: string;
  publicaciones_tipo: string;
}

export interface LinkExterno {
  id_link: number;
  imagen: string;
  nombre: string;
  url_link: string;
  estado: number;
  tipo: string;
}

export interface InstitucionRecursos {
  upea_publicaciones: Publicacion[];
  linksExternoInterno: LinkExterno[];
  links: any[];
}

// Tipos para eventos y convocatorias
export interface Gaceta {
  gaceta_id: number;
  gaceta_titulo: string;
  gaceta_fecha: string;
  gaceta_documento: string;
  gaceta_tipo: string;
}

export interface Evento {
  evento_id: number;
  evento_imagen: string;
  evento_titulo: string;
  evento_descripcion: string;
  evento_fecha: string;
  evento_hora: string;
  evento_lugar: string;
  tipo_evento: string;
  galeria: any[];
}

export interface Facilitador {
  // Agrega los campos según la estructura real
}

export interface Curso {
  iddetalle_cursos_academicos: number;
  det_img_portada: string;
  det_titulo: string;
  det_descripcion: string | null;
  det_costo: number | null;
  det_costo_ext: number | null;
  det_costo_profe: number | null;
  det_cupo_max: number | null;
  det_carga_horaria: number | null;
  det_lugar_curso: string | null;
  det_modalidad: string;
  det_fecha_ini: string | null;
  det_fecha_fin: string | null;
  det_codigo: string | null;
  det_hora_ini: string | null;
  det_grupo_whatssap: string | null;
  det_version: string | null;
  det_estado: string;
  idtipo_curso_otros: number;
  tipo_curso_otro: {
    tipo_conv_curso_nombre: string;
    tipo_conv_curso_estado: string;
  };
  facilitadores: Facilitador[];
}

export interface ConvocatoriaTipo {
  idtipo_conv_comun: number;
  tipo_conv_comun_titulo: string;
  tipo_conv_comun_estado: string;
}

export interface Convocatoria {
  idconvocatorias: number;
  con_foto_portada: string;
  con_titulo: string;
  con_descripcion: string | null;
  con_estado: string;
  con_fecha_inicio: string | null;
  con_fecha_fin: string | null;
  tipo_conv_comun: ConvocatoriaTipo;
}

export interface Servicio {
  serv_id: number;
  serv_imagen: string;
  serv_nombre: string;
  serv_descripcion: string;
  serv_nro_celular: number | null;
  serv_active: string | null;
  imagen: any[];
}

export interface OfertaAcademica {
  ofertas_id: number;
  ofertas_titulo: string;
  ofertas_descripcion: string;
  ofertas_inscripciones_ini: string;
  ofertas_inscripciones_fin: string;
  ofertas_fecha_examen: string;
  ofertas_imagen: string;
  ofertas_referencia: string | null;
  ofertas_estado: number;
}

export interface InstitucionEventos {
  upea_gaceta_universitaria: Gaceta[];
  upea_evento: Evento[];
  cursos: Curso[];
  convocatorias: Convocatoria[];
  serviciosCarrera: Servicio[];
  ofertasAcademicas: OfertaAcademica[];
}

// Tipo unificado para el estado global
export interface InstitucionData {
  principal: InstitucionPrincipal | null;
  contenido: InstitucionContenido | null;
  recursos: InstitucionRecursos | null;
  eventos: InstitucionEventos | null;
  loading: boolean;
  error: string | null;
}