export interface IDictumInformation {
  dictumNo: number; // Numero del Dictamen
  dictumDate?: string; // Fecha del Dictamen
  courtroom?: number; // Juzgado / Sala
  judgementNullity?: number; // Juicio Nulidad
  adminiResolutionNo?: number; // Numero Resolucion Administrativa
  paymentOrderNo?: number; // Numero Orde de Pago
  paymentAmount?: number; // Cantidad a Pagar
  contributor?: string; // Contribuyente
  address1?: string; // Domicilio 1
  address2?: string; // Domicilio 2
  legalRepresentative?: string; // Representante Legal
  requiredSatCopy?: string; // Rquiere Copia SAT
}
