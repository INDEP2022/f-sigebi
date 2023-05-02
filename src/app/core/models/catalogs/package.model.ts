//Interface Provisional sin Validar
export interface IPackage {
  id?: number;
  description: string;
  packageType: number;
  amount: number;
  elaborationDate: Date;
  captureDate: Date;
  capturehcDate: Date;
  packageStatus: string;
  classificationNumber: number;
  targetNumber: number;
  unit: string;
  warehouseNumber: number;
  registryNumber: number;
  status: string;
  tranEmiAutNumber: number;
  validationDate: Date;
  authorizationDate: Date;
  closingDate: Date;
  applicationDate: Date;
  packageCVE: string;
  cancellationDate: Date;
  universalFolio: number;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  delegationNumber: number;
  elaborationUSU: string;
  validationUSU: string;
  authorizationUSU: string;
  closingUSU: string;
  applicationUSU: string;
  cancellationUSU: string;
  goodNumberF: number;
  trial785: string;
}
