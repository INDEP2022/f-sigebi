export interface IDictumInformation {
  dictumNo: string; // Numero del Dictamen
  dictumDate?: string; // Fecha del Dictamen
  courtroom?: string; // Juzgado / Sala
  judgementNullity?: string; // Juicio Nulidad
  adminiResolutionNo?: string; // Numero Resolucion Administrativa
  paymentOrderNo?: string; // Numero Orde de Pago
  paymentAmount?: number; // Cantidad a Pagar
  contributor?: string; // Contribuyente
  address1?: string; // Domicilio 1
  address2?: string; // Domicilio 2
  legalRepresentative?: string; // Representante Legal
  requiredSatCopy?: string; // Rquiere Copia SAT
}
