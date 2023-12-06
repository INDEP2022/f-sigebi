import { Injectable } from '@angular/core';
import { InterfaceSirsaeEndpoints } from 'src/app/common/constants/endpoints/ms-interfacesirsae';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { ISirsaeStateAccountDetail } from '../../models/ms-interfacesirsae/interfacesirsae';
import {
  ISendSirsae,
  ISendSirsaeLot,
  ISendSirsaeOIScrapDTO,
  ISirsaeDTO,
  ISirsaeDTOI,
  ISirsaeScrapDTO,
  IValidPaymentsDTO,
} from './interfacesirsae-model';

@Injectable({
  providedIn: 'root',
})
export class InterfacesirsaeService extends HttpService {
  private readonly route = InterfaceSirsaeEndpoints;
  private readonly route1 = InterfaceSirsaeEndpoints.Interfaceesirsae;
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

  sendSirsaeScrapSp(body: ISirsaeScrapDTO) {
    return this.post(`sirsae/sendSirsaeScrapSp`, body);
  }

  sendSirsaeScrapOi(body: ISendSirsaeOIScrapDTO) {
    return this.post<{ lst_order: any }>(`sirsae/send-sirsae-scrap-oi`, body);
  }

  loadPayments(params: ListParams) {
    return this.get(`application/selectReference/11998905403245735568`);
  }

  sendSirsae2(body: ISirsaeDTO) {
    return this.post<{
      COMER_GASTOS_ID_SOLICITUDPAGO: any;
      BLK_TEMP_CADENA: any;
      COMER_GASTOS_FECHA_SP: any;
    }>('sirsae/sendSirsae3', body);
  }

  sendSirsae4(body: ISirsaeDTOI) {
    return this.post<{
      COMER_GASTOS_ID_SOLICITUDPAGO: any;
      BLK_TEMP_CADENA: any;
      COMER_GASTOS_FECHA_SP: any;
    }>('sirsae/sendSirsae4', body);
  }

  getProviderId(id: string) {
    return this.get<IListResponseMessage<any>>(
      'supplier?filter.clkPv=$eq:' + id
    );
  }

  imprimeAny(idSolicitud: number, idGastos: number) {
    return this.post('sirsae/InsertSolService', { idSolicitud, idGastos });
  }

  viewPreview(pIdPay: number) {
    return this.post('sirsae/viewPreview', { pIdPay });
  }

  deleteSol(id: number) {
    return this.delete('sirsae/deleteSolService/' + id);
  }

  deleteSolServceGast(id: number) {
    return this.delete('sirsae/deleteSolServceGast/' + id);
  }

  deleteModuleCont(id: number) {
    return this.delete('deleteModuleCont/' + id);
  }

  insertModuleCont(id: number) {
    return this.get('sirsae/insertModuleCont/' + id);
  }
}
