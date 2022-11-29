export interface IRequestDocumentation {
  priority?: string; // Prioridad
  infoOrigin?: string; // Procedencia Informacion
  fileType?: string; // Tipo Expediente
  memorandumNo: number; // Numero Oficio
  subject: string; // Asunto
  memorandumDate: string; // Fecha de Oficio
  transferFile?: number; // Expediente Transferente / PAMA
  felony?: string; // Delito
  receptionMethod: string; // Via de Recepcion
  transferType: string; // Tipo de Transferencia
  judgementType?: string; // Tipo Juicio
  judgement?: string; // Juicio
  senderName?: string; // Nombre del Remitente
  senderPosition?: string; // Cargo del Remitente
  senderPhone?: string; // Telefono del Remitente
  senderEmail?: string; // Email del Remitente
  contributor: string; // Contribuyente y/o Indicado
  observations?: string; // Observaciones
}
