export interface TipoCita {
  id: string;
  nombre: string;
  duracion: string;
  grupos: number;
  estado: "Borrador" | "Publicado" | "Activa" | "Inactiva";
}

export const tiposCitaIniciales: TipoCita[] = [
  { id: "1", nombre: "Test drive · 30 min", duracion: "30 m", grupos: 3, estado: "Borrador" },
  { id: "2", nombre: "Visita terreno", duracion: "1 h", grupos: 6, estado: "Publicado" },
  { id: "3", nombre: "Entrega de vehículo", duracion: "1 h 30 m", grupos: 4, estado: "Publicado" },
  { id: "4", nombre: "Tasación de tu auto", duracion: "45 m", grupos: 4, estado: "Publicado" },
  { id: "5", nombre: "Llamada rápida", duracion: "15 m", grupos: 4, estado: "Publicado" },
  { id: "6", nombre: "Videollamada con asesor", duracion: "30 m", grupos: 4, estado: "Publicado" },
  { id: "7", nombre: "Revisión de financiamiento", duracion: "45 m", grupos: 2, estado: "Borrador" },
  { id: "8", nombre: "Reserva y documentación", duracion: "30 m", grupos: 1, estado: "Borrador" },
  { id: "9", nombre: "Presentación del modelo y sus versiones", duracion: "1 h", grupos: 3, estado: "Borrador" },
  { id: "10", nombre: "Prueba de manejo comparativa entre dos modelos", duracion: "1 h 30 m", grupos: 5, estado: "Publicado" },
  {
    id: "11",
    nombre: "Visita a domicilio para conocer, revisar y probar el vehículo de interés",
    duracion: "2 h",
    grupos: 2,
    estado: "Borrador",
  },
  {
    id: "12",
    nombre: "Asesoría completa de financiamiento, seguros, pie y alternativas de pago",
    duracion: "1 h 15 m",
    grupos: 3,
    estado: "Publicado",
  },
  {
    id: "13",
    nombre: "Entrega programada del vehículo con explicación de funciones, garantía y mantenciones",
    duracion: "1 h 30 m",
    grupos: 2,
    estado: "Borrador",
  },
  {
    id: "14",
    nombre: "Seguimiento después de la prueba de manejo para resolver dudas y acordar próximos pasos",
    duracion: "20 m",
    grupos: 1,
    estado: "Inactiva",
  },
  {
    id: "15",
    nombre: "Reunión con cliente y co-deudor para revisar antecedentes, alternativas de crédito y documentos pendientes",
    duracion: "1 h 15 m",
    grupos: 3,
    estado: "Activa",
  },
];
