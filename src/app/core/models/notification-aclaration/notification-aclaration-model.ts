export interface Inappropriateness {
  id?: string;
  addresseeName?: string; //Nombre destinatario
  positionSender?: string;
  positionAddressee?: string;
  senderName?: string; //Nombre del remitente
  clarification?: string;
  consistentIn?: string;
  paragraphInitial?: string;
  paragraphFinal?: string;
  userAreaCaptures?: string; //Área usuario captura
  transmitterId?: string;
  webMail?: string; //Correo web
  applicationId?: string;
  jobClarificationKey?: string; //Clave oficio aclaración
}
