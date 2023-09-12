import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStrategyProcess } from '../../models/ms-strategy-process/strategy-process.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyProcess>> {
    return this.get<IListResponse<IStrategyProcess>>(
      StrategyEndpoints.StrategyProcess,
      params
    );
  }

  create(model: IStrategyProcess) {
    return this.post(StrategyEndpoints.StrategyProcess, model);
  }

  update(model: IStrategyProcess, id: number | string) {
    const route = `${StrategyEndpoints.StrategyProcess}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyProcess}/${id}`;
    return this.delete(route);
  }

  getByDelegation(id: number, estado: string, params: any) {
    const route = `${StrategyEndpoints.getbyStatus}?filter.delegationNumber=${id}&filter.status=${estado}`;
    return this.get(route, params);
  }

  getByNoReport(id: number) {
    const route = `${StrategyEndpoints.StrategySum}/${id}`;
    return this.get(route);
  }

  getByMonthYear(month: number, year: number, delegation: number, params: any) {
    const route = `${StrategyEndpoints.strategyInd}?filter.monthNumber=$eq:${month}&filter.yearNumber=$eq:${year}&filter.delegation1Number=$eq:${delegation}`;
    return this.get(route, params);
  }

  getByMonthYearTotal(month: number, year: number, delegation: number) {
    const route = `${StrategyEndpoints.strategyInd}?filter.monthNumber=$eq:${month}&filter.yearNumber=$eq:${year}&filter.delegation1Number=$eq:${delegation}&filter.estTime=$eq:1`;
    return this.get(route);
  }

  ByFormatNumber(params: any) {
    const route = `${StrategyEndpoints.PaEstGood}`;
    return this.post(route, params);
  }
}
