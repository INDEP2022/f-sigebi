import { Observable } from 'rxjs';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { IListResponse } from '../../../core/interfaces/list-response.interface';
import { ListParams } from './list-params';

export interface IRead {
  getGenericBySearch(
    route: string,
    _params: ListParams
  ): Observable<IListResponse<IGeneric>>;
}

export interface IWrite {}

export interface ICatGeneric extends IWrite, IRead {}
