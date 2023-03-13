export interface IRequestInformation {
  date?: string; // Fecha
  requestNo: number; // Numero Solicitud
  fileNo?: number; // Numero Expediente
  memorandumNo?: number; // Numero Oficio
  regionalDelegation?: string; //Delegacion Regional
  state?: string; // Estado
  transferee?: string; // Transferente
  emitter?: string; // Emisora
  authority?: string; // Autoridad
  similarGoodsRequest?: number; // Numero Solicitud Bienes Similares
  rejectionComment?: string; // Comentario de Rechazo
}
