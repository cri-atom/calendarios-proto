export interface Calendario {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  cargo?: string;
  grupos: number;
  tiposEvento: number;
  estado: "Activo" | "Inactivo";
}

export const calendariosIniciales: Calendario[] = [
  { id: "1", nombre: "Tom", apellido: "Chatt", telefono: "+52 211 111 111", correo: "tom@chatt.com", grupos: 2, tiposEvento: 1, estado: "Activo" },
  { id: "2", nombre: "Valentina", apellido: "Rojas", telefono: "+56 9 8123 4455", correo: "valentina.rojas@atomchat.io", grupos: 1, tiposEvento: 2, estado: "Activo" },
  { id: "3", nombre: "Marco", apellido: "Fuentes", telefono: "+56 9 7654 3210", correo: "marco.fuentes@atomchat.io", grupos: 3, tiposEvento: 1, estado: "Activo" },
  { id: "4", nombre: "Camila", apellido: "Soto", telefono: "+57 300 456 7890", correo: "camila.soto@atomchat.io", grupos: 1, tiposEvento: 1, estado: "Inactivo" },
  { id: "5", nombre: "Diego", apellido: "Vargas", telefono: "+52 55 1234 5678", correo: "diego.vargas@atomchat.io", grupos: 2, tiposEvento: 3, estado: "Activo" },
  { id: "6", nombre: "Sofía", apellido: "Ibáñez", telefono: "+56 9 5544 3322", correo: "sofia.ibanez@atomchat.io", grupos: 1, tiposEvento: 1, estado: "Activo" },
  { id: "7", nombre: "Andrés", apellido: "Molina", telefono: "+57 310 222 1144", correo: "andres.molina@atomchat.io", grupos: 2, tiposEvento: 2, estado: "Activo" },
  { id: "8", nombre: "Isidora", apellido: "Pérez", telefono: "+56 9 4433 2211", correo: "isidora.perez@atomchat.io", grupos: 1, tiposEvento: 1, estado: "Inactivo" },
];

export const gruposDisponibles = ["Ventas", "Soporte", "Onboarding", "Postventa"];
export const zonasHorarias = [
  "America/Santiago (GMT-3)",
  "America/Bogota (GMT-5)",
  "America/Mexico_City (GMT-6)",
  "America/Lima (GMT-5)",
];
