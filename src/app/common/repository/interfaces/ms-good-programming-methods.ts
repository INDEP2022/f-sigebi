import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ListParams } from './list-params';

export interface IRead<T> {
  getAllPaginated(
    route: string,
    params?: ListParams
  ): Observable<IListResponse<T>>;
}

export interface IGoodProgramming<T> extends IRead<T> {}
