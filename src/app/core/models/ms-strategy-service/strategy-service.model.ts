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

export interface IStrategyTurn {
  pProcessNumber: number;
  pServiceNumber: number;
  pServiceTypeNumber: number;
}

export interface IStrateyCost {
  pProcessNumber: number;
  pServiceNumber: number;
  pServiceTypeNumber: number;
  pTurnNumber: number;
}
