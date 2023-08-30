import { Injectable } from '@angular/core';
import { InterfaceSirsaeEndpoints } from 'src/app/common/constants/endpoints/ms-interfacesirsae';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISirsaeStateAccountDetail } from '../../models/ms-interfacesirsae/interfacesirsae';
import {
  ISendSirsae,
  ISendSirsaeLot,
  IValidPaymentsDTO,
} from './interfacesirsae-model';

@Injectable({
  providedIn: 'root',
})
export class InterfacesirsaeService extends HttpService {
  private readonly route = InterfaceSirsaeEndpoints;
  constructor() {
    super();
    this.microservice = this.route.InterfaceSirsae;
  }

  getStatusesMov(params?: _Params) {
    return this.get<IListResponse<{ id: number; statusDescription: string }>>(
      this.route.StatusesMov,
      params
    );
  }

  getAccountDetail(params?: _Params) {
    return this.get<IListResponse<ISirsaeStateAccountDetail>>(
      this.route.AccountDetail,
      params
    );
  }

  updateEventDomicile(body: { iIdEvento: string | number; cveActa: string }) {
    return this.post('update-invitations/update-event-domicile', body);
  }

  updateInvitations(body: { sRunCommand: string; cveCertificate: string }) {
    return this.post('update-invitations/program-cs-main', body);
  }

  sendSirsae(body: ISendSirsae) {
    return this.post('sirsae/send-sirsae', body);
  }

  sendSirsaeLot(body: ISendSirsaeLot) {
    return this.post('sirsae/pup-send-sirsae-lots', body);
  }

  sendReadSirsae(body: any) {
    return this.post('sirsae/sendReadSirsae', body);
  }

  validPayments(body: IValidPaymentsDTO) {
    return this.post(InterfaceSirsaeEndpoints.ValidPayments, body);
  }

  validatePaymentsXcli(evento: any) {
    return this.get(`sirsae/validatePaymentsXcli/${evento}`);
  }

  actEstEve(evento: any) {
    return this.get(`sirsae/actEstEve/${evento}`);
  }

  postPubBusqueda(params: any) {
    return this.post(InterfaceSirsaeEndpoints.PupBusqueda, params);
  }
}
