import { IStation } from './station.model';
import { ITransferente } from './transferente.model';

export interface IAuthority {
  idAuthority?: number;
  idTransferer?: number;
  authorityName?: string;
  Station?: IStation;
  Transferente?: ITransferente;
  idCity?: number;
  codeStatus?: string;
  creationUser?: string;
  creationDate?: string;
  editionUser?: string;
  modificationDate?: string;
  version?: number;
  cveStatus?: number;
  cveUnique?: number;
  status?: null;
  idAuthorityIssuerTransferor?: number;
  idStation?: number;
}
