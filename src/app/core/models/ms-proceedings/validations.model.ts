export interface proceedingsType {
  descVal: string | null;
  numRegister: string | null;
  proceedingsType: number | null;
  scriptVal: string | null;
  secVal: number | null;
}

export interface IValidations {
  numProceedings: number | null;
  proceedingsType: proceedingsType;
  typeProceedings: string;
  resultValue: string | null;
  secVal: number | null;
  statusValue: number | null;
}

export interface TransferProceeding {
  numFile: any;
  typeProceedings: string;
}
