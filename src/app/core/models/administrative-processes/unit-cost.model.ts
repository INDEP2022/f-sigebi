export interface IUnitCost {
  costId: number;
  processNumber: number;
  serviceNumber: number;
  serviceTypeNumber: number;
  shiftNumber: number;
  varCostNumber: number;
  registryNumber: number;
  nbOrigin: string;
  strategyDetCostDetail: IStrategyDetCost;
  strategyProcess: IStrategyProcess | string;
  strategyService: IStrategyService | string;
  strategyServicetype: IStrategyServicetype | string;
  strategyShift: IStrategyShift | string;
  strategyVariableCost: IStrategyVariableCost | string;
}
export interface IStrategyDetCost {
  costId: number;
  cveZoneContract: number;
  startDate: string;
  finalDate: string;
  costUnitarian: string;
  porceInflation: string;
  validity: number;
  recordNumber: number;
}
export interface IStrategyProcess {
  processNumber: number;
  desShort: string;
  description: string;
  relayEstate: string;
  relayStrategy: string;
  programmingType: string;
  registryNumber: number;
  nbOrigin: string;
}
export interface IStrategyService {
  serviceNumber: number;
  description: string;
  registryNumber: string;
  nbOrigin: string;
}
export interface IStrategyServicetype {
  serviceTypeNumber: number;
  description: string;
  registryNumber: number;
  nbOrigin: string;
}
export interface IStrategyShift {
  shiftNumber: number;
  description: string;
  registryNumber: number;
  nbOrigin: number;
}
export interface IStrategyVariableCost {
  varCostNumber: number;
  description: string;
  registryNumber: number;
  nbOrigin: number;
}
