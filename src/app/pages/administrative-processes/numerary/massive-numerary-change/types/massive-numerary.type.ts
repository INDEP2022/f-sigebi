export interface IMassiveNumeraryChangeSpent {
  noGood: number; // NO_BIEN // good.id
  npNUm: number; // NO_BIEN_NUME // good.id
  description: string; // DESCRIPCION
  cveEvent: string; // CVE_PROCESO
  status: string; // ESTATUS
  entry: number; // INGRESO
  costs: number; // GASTO
  tax: number; // IVA
  impNumerary: number; // VALOR_AVALUO
  noExpAssociated: any; // NO_EXP_ASOCIADO
  noExpedient: string; // NO_EXPEDIENTE
  quantity: number; // CANTIDAD
  noDelegation: string; // NO_DELEGACION
  noSubDelegation: string; // NO_SUBDELEGACION
  identifier: string; // IDENTIFICADOR
  noFlier: any; // NO_VOLANTE
  indNume: number; // IND_NUME
  color?:
    | 'bg-custom-red'
    | 'bg-custom-green'
    | 'bg-custom-cyan'
    | 'bg-custom-orange'
    | 'bg-custom-yellow';
}

export interface IMassiveNumeraryTableSmall {
  noGood: number; // NO_BIEN
  cveie: number; // NO_CONCEPTO_GASTO
  amount: number; // IMPORTE
  description?: string; // DESCRIPCION
  status?: string; // ESTATUS
  type?: string; // TIPO
}
