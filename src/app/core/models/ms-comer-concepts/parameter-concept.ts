export interface IParameterConcept {
  conceptId: string;
  parameter: string;
  value: string;
  address: string;
  creationDate: string;
  creationUser: string;
  conceptFk: ConceptFk;
  parameterFk: ParameterFk;
}

export interface IParameterConceptCreate extends IParameterConceptUpdate {
  creationDate: string;
  creationUser: string;
}

export interface IParameterConceptUpdate {
  conceptId: string;
  parameter: string;
  value: string;
  address: string;
}

export interface ParameterFk {
  parameter: string;
  value: string;
  description: string;
  address: string;
  tpEventId?: any;
}

export interface ConceptFk {
  id: string;
  description: string;
  routineCalculation?: any;
  automatic?: any;
  address: string;
  numerary: string;
}
