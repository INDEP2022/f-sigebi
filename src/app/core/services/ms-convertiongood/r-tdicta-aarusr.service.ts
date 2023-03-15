import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConvertiongoodEndpoints } from '../../../common/constants/endpoints/ms-convertiongood-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRtdictaAarusr } from '../../models/ms-convertiongood/r-tdicta-aarusr.model';

@Injectable({
  providedIn: 'root',
})
export class RTdictaAarusrService extends HttpService {
  private readonly route = ConvertiongoodEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Convertiongood;
  }

  getAll(params?: ListParams): Observable<IListResponse<IRtdictaAarusr>> {
    return this.get<IListResponse<IRtdictaAarusr>>(
      this.route.RtdictaAarusr,
      params
    );
  }

  getAllWithFilters(
    params?: string
  ): Observable<IListResponse<IRtdictaAarusr>> {
    return this.get<IListResponse<IRtdictaAarusr>>(
      this.route.RtdictaAarusr,
      params
    );
  }

  getById(id: string | number): Observable<IRtdictaAarusr> {
    const route = `${this.route.RtdictaAarusrId}/${id}`;
    return this.get(route);
  }

  create(body: IRtdictaAarusr): Observable<IRtdictaAarusr> {
    return this.post(this.route.RtdictaAarusr, body);
  }

  update(id: string | number, body: IRtdictaAarusr) {
    const route = `${this.route.RtdictaAarusr}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.RtdictaAarusr}/${id}`;
    return this.delete(route);
  }
}
