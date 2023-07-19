export interface IMassiveNumeraryGood {
  noGood: number; // NO_BIEN // good.id
  /**@description NO_BIEN_NUME || numeGoodNumber */
  npNUm: number; //  // good.id
  /**@description DESCRIPCION || description */
  description: string;
  cveEvent: string; // CVE_PROCESO
  /**@description ESTATUS || status */
  status: string; //
  entry: number; // INGRESO
  /**@description GASTO || spent */
  costs: number; // GASTO
  tax: number; // IVA
  /**@description VALOR_AVALUO || appraisalValue*/
  impNumerary: number; //
  /**@description NO_EXP_ASOCIADO || expAssocNumber */
  noExpAssociated: any;
  /**@description NO_EXPEDIENTE || fileNumber */
  noExpedient: string;
  quantity: number; // CANTIDAD
  /**@description NO_DELEGACION || delegationNumber */
  noDelegation: string;
  /**@description NO_SUBDELEGACION || subdelegationNumber */
  noSubDelegation: string;
  /**@description IDENTIFICADOR | identifier */
  identifier: string;
  /**@description NO_VOLANTE | flyerNumber */
  noFlier: any;
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

export interface IFMasInsNumerarioGood {
  associatedExpNum: string;
  delegationNumber: string;
  description: string;
  fileNumber: string;
  flyerNumber: string;
  goodNumber: number;
  goodNumberNum: string;
  identifier: string;
  income: number;
  indNume: number;
  iva: string;
  processKey: string;
  quantity: string;
  spent: number;
  status: string;
  subdelegationNumber: string;
  vColor: string;
  valueAppraisalm: number;
}

export interface IFMasInsNumerarioSpent {
  amount: string;
  description: string;
  goodNumber: number;
  spentConceptNumber: number;
  status: string;
  type: string;
}

export interface IResponseFMasInsNumerarioSpent {
  T_REG: any;
  BLK_BIENES: IFMasInsNumerarioGood[];
  BLK_GASTOS: IFMasInsNumerarioSpent[];
}
