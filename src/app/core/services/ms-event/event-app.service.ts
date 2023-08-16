import { Injectable } from '@angular/core';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class EventAppService extends HttpService {
  private readonly endpoint: string = EventEndpoints.Application;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  verifyRejectedGoods(eventId: string | number) {
    return this.get<{ data: number }>(
      `${this.endpoint}/verifyrejected/${eventId}`
    );
  }

  removeGoods(body: {
    tpeventId: string | number;
    remittanceEventId: string | number;
    statusvtaId: string;
    eventEeatId: string | number;
    statusBefore: string;
    goodNo: string | number;
    toolbarUser: string;
    eventId: string | number;
    statusEat: string;
    remittanceLotId: string | number;
    remittanceGoodxGoodId: string | number;
    lotId: string | number;
  }) {
    return this.post(`${this.endpoint}/deleteof-goods`, body);
  }

  rgEventsI(user: string) {
    return this.get<
      IListResponse<{ id_tpevento: string; descripcion: string }>
    >(`${this.endpoint}/rg-event/user/${user}`);
  }

  postDetResumer(params: any) {
    return this.post(`EventEndpoints.DetResumen`, params);
  }

  postDetRemesa(params: any) {
    return this.post(`EventEndpoints.DetRemesa`, params);
  }

  postResumen(params: any) {
    return this.post(`Eventendpoints.Resumen`, params);
  }

  postResumenRemesa(params: any) {
    return this.post(`Eventendpoints.ResumenRemesa`, params);
  }
}
