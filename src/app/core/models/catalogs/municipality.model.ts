export interface IMunicipality {
  idMunicipality?: string;
  stateKey?: string;
  nameMunicipality?: string;
  description?: string;
  codMarginality?: number;
  noRegister?: number;
  risk?: string;
  version?: number;
}

export interface IMunicipalityGetAll {
  idMunicipality?: string;
  nameMunicipality?: string;
}
