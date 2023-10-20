import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MsInvoiceService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_INVOICE.BasePath;
  }

  getByNoInvoice(invoice: string | number) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.straInvoice}?filter.billId=$eq:${invoice}`
    );
  }

  getComerHeadboard(params?: string) {
    return this.get(`comer-headboard`, params);
  }

  getGetGegrafica(body: any, params?: ListParams) {
    return this.post(ENDPOINT_INVOICE.GetGegraficaFacturas, body, params);
  }

  getGetGegraficaDetailExcel(body: any) {
    return this.post(ENDPOINT_INVOICE.DetailGetGeograficaExcel, body);
  }

  getDetailGetGegrafica(body: any, params?: ListParams) {
    return this.post(ENDPOINT_INVOICE.DetailGetGegraficaFacturas, body, params);
  }

  VALIDA_PAGOSREF_OBT_PARAMETROS(id: any) {
    // VALIDA_PAGOSREF.OBT_PARAMETROS
    return this.get(`ctrl-invoice/obt-parameters/${id}`);
  }

  lotifyExcelCount(eventId: string | number) {
    const url = `application/lotifica-excel-count/event/${eventId}`;
    return this.get<{ totlot: string; catlot: number }>(url);
  }

  getAllBillings(params: _Params) {
    return this.get<IListResponse>(`${ENDPOINT_INVOICE.ComerInovice}`, params);
  }

  getComerCetinvoices(params: _Params) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.ComerCetinvoices}`,
      params
    );
  }

  getInconsistencies_(params: _Params) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.ComerInconsistencies_}`,
      params
    );
  }

  getApplicationLotCounter(body: any) {
    return this.post<IListResponse>(
      ENDPOINT_INVOICE.ApplicationLotCounter,
      body
    );
  }

  getApplicationBugInfoCounter(body: any) {
    return this.post<IListResponse>(
      ENDPOINT_INVOICE.ApplicationBugInfoCounter,
      body
    );
  }

  getApplicationNofactCounter(body: any) {
    return this.post<IListResponse>(
      ENDPOINT_INVOICE.ApplicationNofactCounter,
      body
    );
  }

  getApplicationCounter1(body: any) {
    return this.post<IListResponse>(ENDPOINT_INVOICE.ApplicationCounter1, body);
  }

  getPaNvoFacturaPag(body: any) {
    return this.post<IListResponse>(ENDPOINT_INVOICE.PaNvoFacturaPag, body);
  }

  getPupActstatusLot(event: any) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.PupActstatusLot}/${event}`
    );
  }

  getFValidateUser(body: any) {
    return this.post<IListResponse>(`${ENDPOINT_INVOICE.FValidateUser}`, body);
  }

  getPaNvoDeleteInvoice(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.PaNvoDeleteInvoice}`,
      body
    );
  }

  getCtrlInvoiceRegLot(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.CtrlInvoiceRegLot}`,
      body
    );
  }

  getApplicationLovsCanbacEvent(params: _Params) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationLovsCanbacEvent}`,
      params
    );
  }
  getApplicationLovsCanbaccTransfer(body: any, params: _Params) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationLovsCanbaccTransfer}`,
      body,
      params
    );
  }
  getApplicationlovsCanbaccDelegation(body: any, params: _Params) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationlovsCanbaccDelegation}`,
      body,
      params
    );
  }

  getCursor1(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationValidSelectionFact}`,
      body
    );
  }
  getCursor2(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationvalidSelectionFactSat}`,
      body
    );
  }

  getApplicationValidSelectionCountfact(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationValidSelectionCountfact}`,
      body
    );
  }

  getApplicationValidSelectionCountfactFol(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationValidSelectionCountfactFol}`,
      body
    );
  }

  getPaNvoGenerarPag(body: any) {
    return this.post<IListResponse>(ENDPOINT_INVOICE.PaNvoGenerarPag, body);
  }

  getProcFailed(body: any) {
    return this.post<IListResponse>(
      ENDPOINT_INVOICE.ApplicationProcFailed,
      body
    );
  }

  getConsFailed(body: any) {
    return this.post<IListResponse>(
      ENDPOINT_INVOICE.ApplicationConsFailed,
      body
    );
  }

  updateBillings(body: any) {
    return this.put<IListResponse>(`${ENDPOINT_INVOICE.ComerInovice}`, body);
  }

  getApplicationConsPupEminFact(body: any) {
    return this.put<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationConsPupEminFact}`,
      body
    );
  }

  getComerTpinvoices(params: _Params) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.ComerTpinvoices}`,
      params
    );
  }

  getApplicationFaValidCurpRfc(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationFaValidCurpRfc}`,
      body
    );
  }
  // ==================================================== //
  getApplicationComerBillsTotal(body: any) {
    return this.put<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationComerBillsTotal}`,
      body
    );
  }
  getApplicationComerBillsIva(body: any) {
    return this.put<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationComerBillsIva}`,
      body
    );
  }
  getApplicationComerBillsPrice(body: any) {
    return this.put<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationComerBillsPrice}`,
      body
    );
  }
  getApplicationComerBillsAmount(body: any) {
    return this.put<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationComerBillsAmount}`,
      body
    );
  }
  getApplicationGenerateFolio(body: any) {
    return this.post<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationGenerateFolio}`,
      body
    );
  }

  getApplicationGetCountSumbyTypes(params: any) {
    return this.get(
      `${ENDPOINT_INVOICE.GetCountSumbyTypes}?eventId=${params.eventId}&batchId=${params.batchId}&types=${params.types}`
    );
  }

  updateDetBillings(body: any) {
    return this.put(`${ENDPOINT_INVOICE.ComerCetinvoices}`, body);
  }

  getCountBatch(event: number, batch: number) {
    return this.get(
      `${ENDPOINT_INVOICE.CountBatch}?eventId=${event}&batch=${batch}&screen=FCOMER086_I`
    );
  }

  getApplicationGetCountbyMandatoin(event: number, batch: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationGetCountbyMandatoin}?eventId=${event}&batch=${batch}`
    );
  }

  getValidBatch(event: number, batch: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ValidBatch}?eventId=${event}&batch=${batch}`
    );
  }

  getApplicationGetCountbyMandatoNotin(event: number, batch: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationGetCountbyMandatoNotin}?eventId=${event}&batch=${batch}`
    );
  }

  getApplicationGetCount1GenXpago(event: number, batch: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationGetCount1GenXpago}?eventId=${event}&batch=${batch}`
    );
  }

  deleteApplicationDeleteIfExists(body: any) {
    return this.delete<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationDeleteIfExists}`,
      body
    );
  }

  putApplicationComerBillsAmount(body: any) {
    return this.put<IListResponse>(
      `${ENDPOINT_INVOICE.ApplicationUpdateTotalIvaMonto}`,
      body
    );
  }
}
