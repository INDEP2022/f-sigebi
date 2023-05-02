import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InterfacefgrEndPoints } from 'src/app/common/constants/endpoints/ms-interfacefgr-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IFaValAtributo1,
  IOTClaveByAsunto,
  IOTClaveByAsuntoResponse,
  IPgrTransfer,
} from '../../models/ms-interfacefgr/ms-interfacefgr.interface';

@Injectable({
  providedIn: 'root',
})
export class InterfacefgrService extends HttpService {
  constructor() {
    super();
    this.microservice = InterfacefgrEndPoints.Interfacefgr;
  }

  getPgrTransfer(params?: ListParams): Observable<IListResponse<IPgrTransfer>> {
    return this.get<IListResponse<IPgrTransfer>>(
      InterfacefgrEndPoints.PgrTransfer,
      params
    );
  }

  getPgrTransferFiltered(
    params?: string
  ): Observable<IListResponse<IPgrTransfer>> {
    return this.get<IListResponse<IPgrTransfer>>(
      InterfacefgrEndPoints.PgrTransferFiltered,
      params
    );
  }

  /**
   * Ya no va a funcionar
   * @deprecated
   */
  getById(id: string | number): Observable<IPgrTransfer> {
    const route = `${InterfacefgrEndPoints.PgrTransfer}/${id}`;
    return this.get(route);
  }

  create(body: IPgrTransfer) {
    return this.post(InterfacefgrEndPoints.PgrTransferFiltered, body);
  }

  update(body: IPgrTransfer) {
    const route = `${InterfacefgrEndPoints.PgrTransferFiltered}`;
    return this.put(route, body);
  }

  remove(body: Partial<IPgrTransfer>) {
    const route = `${InterfacefgrEndPoints.PgrTransferFiltered}`;
    return this.delete(route, body);
  }

  getCountAffair(office: string): Observable<{ count: number }> {
    return this.get<{ count: string }>(
      `${InterfacefgrEndPoints.CountAffair}/${office}`
    ).pipe(
      map(resp => {
        return { count: Number(resp.count) };
      })
    );
  }

  getCityByAsuntoSat(body: { pgrOffice: string }) {
    return this.post(InterfacefgrEndPoints.cityByAsuntoSat, body);
  }

  getFaValAtributo1(body: IFaValAtributo1) {
    return this.post<IListResponse<IFaValAtributo1>>(
      InterfacefgrEndPoints.PgrFaValAtrib1,
      body
    );
  }

  getOTClaveEntityFederativeByAvePrevia(body: IOTClaveByAsunto) {
    return this.post<IOTClaveByAsuntoResponse>(
      InterfacefgrEndPoints.OTkeyByAsunto,
      body
    );
  }
}
