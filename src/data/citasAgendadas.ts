export interface CitaAgendada {
  id: string;
  contacto: string;
  telefono: string;
  tipoCita: string;
  fechaHora: string;
  calendario: string;
  estado: "Confirmada" | "Pendiente" | "Completada" | "Cancelada";
}

export const citasAgendadasIniciales: CitaAgendada[] = [
  { id: "1", contacto: "Fernanda Rivas", telefono: "+56 9 8123 4455", tipoCita: "Test drive · 30 min", fechaHora: "01 oct, 10:00", calendario: "Tom Chatt", estado: "Confirmada" },
  { id: "2", contacto: "Ignacio Peña", telefono: "+56 9 7654 3210", tipoCita: "Visita terreno", fechaHora: "01 oct, 12:30", calendario: "Valentina Rojas", estado: "Pendiente" },
  { id: "3", contacto: "Josefina Aliaga", telefono: "+57 300 456 7890", tipoCita: "Entrega de vehículo", fechaHora: "02 oct, 09:00", calendario: "Marco Fuentes", estado: "Confirmada" },
  { id: "4", contacto: "Rodrigo Salas", telefono: "+52 55 1234 5678", tipoCita: "Tasación de tu auto", fechaHora: "02 oct, 16:00", calendario: "Diego Vargas", estado: "Completada" },
  { id: "5", contacto: "Camila Toledo", telefono: "+56 9 5544 3322", tipoCita: "Llamada rápida", fechaHora: "03 oct, 11:15", calendario: "Sofía Ibáñez", estado: "Cancelada" },
  { id: "6", contacto: "Bastián Cortés", telefono: "+57 310 222 1144", tipoCita: "Videollamada con asesor", fechaHora: "03 oct, 15:45", calendario: "Andrés Molina", estado: "Confirmada" },
  { id: "7", contacto: "Antonia Reyes", telefono: "+56 9 4433 2211", tipoCita: "Revisión de financiamiento", fechaHora: "04 oct, 10:30", calendario: "Tom Chatt", estado: "Pendiente" },
];
