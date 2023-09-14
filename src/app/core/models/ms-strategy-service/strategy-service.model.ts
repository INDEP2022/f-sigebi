export interface IStrategyService {
  serviceNumber?: number;
  description: string;
  registryNumber?: number;
  nbOrigin?: string;
}

export interface IStrategyTypeService {
  serviceTypeNumber?: number;
  description: string;
  registryNumber?: number;
  nbOrigin?: string;
}
export interface IStrategyType {
  pProcessNumber?: number;
  pServiceNumber: string;
}

export interface IStrategyLovSer {
  pProcessNumber?: number;
}

export interface IStrategyProcess {
  processNumber: number;
  desShort: string;
  description: string;
}
