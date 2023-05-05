import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ExpedientRepository } from 'src/app/common/repository/repositories/ms-expedient-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IExpedient } from '../../models/ms-expedient/expedient';
import { IIntegratedExpedient } from '../../models/ms-expedient/integrated-expedient.model';

@Injectable({
  providedIn: 'root',
})
export class ExpedientService extends HttpService {
  private readonly route = ExpedientEndpoints;
  private readonly endpoint: string = ExpedientEndpoints.BasePath;
  private readonly find: string = ExpedientEndpoints.FindExpedient;
  constructor(private expedientRepository: ExpedientRepository<IExpedient>) {
    super();
    this.microservice = this.route.Base;
  }

  getById(id: string | number): Observable<IExpedient> {
    return this.expedientRepository.getById(this.route.FindIdentificator, id);
  }
  getAll(params?: _Params): Observable<IListResponse<IExpedient>> {
    return this.get<IListResponse<IExpedient>>(this.route.BasePath, params);
  }

  findExpedient(search: any) {
    const route = `${this.route.BasePath}${this.find}${search}`;
    return this.get(route);
  }

  getAllFilter(search: any) {
    return this.get<IListResponse<IExpedient>>('expedient', search);
  }

  getNextVal(): Observable<{ nextval: string }> {
    return this.get(this.route.GetNextVal);
  }

  create(body: IExpedient): Observable<IExpedient> {
    return this.post(this.route.CreateExpedient, body);
  }

  update(id: number | string, body: Partial<IExpedient>) {
    return this.put(`${this.route.BasePath}/${id}`, body);
  }

  getItegratedExpedients(params: _Params) {
    return this.get<IListResponse<IIntegratedExpedient>>(
      this.route.GetIntegratedExpedients,
      params
    );
  }

  getExpedientList(params?: string): Observable<IListResponse<IExpedient>> {
    let partials = ExpedientEndpoints.SelectExpedient.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IExpedient>>(partials[1], params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(m => {
            return {
              ...m,
              name: `${m.id}: ${m.preliminaryInquiry}`,
            };
          }),
        };
      }),
      tap(() => (this.microservice = ''))
    );
  }
}
