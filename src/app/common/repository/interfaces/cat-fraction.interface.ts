import { Observable } from 'rxjs';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { IListResponse } from '../../../core/interfaces/list-response.interface';

export interface IRead {
  getByParendId(
    route: string,
    id: number | string
  ): Observable<IListResponse<IFraction>>;
}

export interface IWrite {}

export interface ICatFraction extends IWrite, IRead {}
