import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ComerInvoiceService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_INVOICE.BasePath;
  }

  getAll(params: _Params | string) {
    return this.get<IListResponse<any>>(ENDPOINT_INVOICE.ComerInovice, params);
  }

  getAllInvoicePag(params: ListParams) {
    return this.get<IListResponse<any>>(ENDPOINT_INVOICE.GetInvoicePag, params);
  }

  create(data: any) {
    return this.post(ENDPOINT_INVOICE.ComerInovice, data);
  }

  update(data: any) {
    return this.put(ENDPOINT_INVOICE.ComerInovice, data);
  }

  getPenalizeData(idEvent: number, idLote: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationImpPenalize}?idEvent=${idEvent}&idLot=${idLote}`
    );
  }

  getMaxFacturaId(idEvent: number) {
    return this.get(`${ENDPOINT_INVOICE.ApplicationMaxFolio}/${idEvent}`);
  }

  deleteFolio(data: { eventId: string; invoiceId: string }) {
    return this.post(ENDPOINT_INVOICE.DeleteFolio, data);
  }

  updateStatusImg(data: {
    pStatus: string;
    pProcess: string;
    pEvent: number;
    idFact: number;
  }) {
    return this.put(ENDPOINT_INVOICE.UpdateStatusImg, data);
  }

  updateByEvent(eventId: number) {
    return this.get(`${ENDPOINT_INVOICE.UpdateByEvemt}/${eventId}`);
  }

  copyInvoice(data: Object) {
    return this.post(ENDPOINT_INVOICE.CopyInvoice, data);
  }

  getBill(body: any, params: ListParams) {
    return this.post(ENDPOINT_INVOICE.GetInvoice, body, params);
  }

  getValidPayments(params?: _Params) {
    return this.get(ENDPOINT_INVOICE.ComerHeadboard, params);
  }

  executeSQL(data: {
    invoiceField: string;
    table: string;
    eventId: number;
    invoiceId: number;
  }) {
    return this.post(ENDPOINT_INVOICE.ApplicationSQL, data);
  }

  regXLote(data: { eventId: string; lotId: string }) {
    return this.post(ENDPOINT_INVOICE.ComerLote, data);
  }

  dataCoord(data: { eventId: string; invoice: string }) {
    return this.post(ENDPOINT_INVOICE.ComerCoord, data);
  }

  factBases(data: {
    pEvent: string;
    pLot: string;
    pOption: number;
    pInvoiceId: string;
    genVat: number;
    pDelegationIssues: number;
  }) {
    return this.post(ENDPOINT_INVOICE.FactBases, data);
  }

  validateFolio(data: { tpEvento: string; id_evento: string }) {
    return this.post(ENDPOINT_INVOICE.ApplicationFolioDispo, data);
  }

  validateUSer(user: string) {
    return this.get(`${ENDPOINT_INVOICE.ValidateUser}/${user}`);
  }

  preInvoiceGenerate(data: {
    event: number;
    eventId: number;
    batch: number;
    batchId: number;
    ctrlEvent: number;
    ctrlGenIva: number;
    ctrlBatch: number;
    toolbarNoDelegation: number;
    toolbarUser: string;
  }) {
    return this.post(ENDPOINT_INVOICE.ControlProcedure, data);
  }

  VALIDA_PAGOS(params: any) {
    return this.post(ENDPOINT_INVOICE.Fcomer112ICountHeader, params);
  }

  generateFolio(data: { pEvent: string; ptpevento: string }) {
    return this.post(ENDPOINT_INVOICE.GenerateFolio, data);
  }

  comerPostQuery(data: {
    useCompSat: string;
    cveUnitSat: string;
    cveProdServSat: string;
    cveShapePayment: string;
    cveTypeRelationSat: string;
    type: number;
    idEventRelImg: number;
    typeVoucher: string;
    total: number;
    idEvent: number;
    idInvoice: number;
    iva: number;
    price: number;
    noDelegation: number;
    dateImpression: string;
  }) {
    return this.post(ENDPOINT_INVOICE.ComerPostQuery, data);
  }

  validUser2(user: string) {
    return this.get(`${ENDPOINT_INVOICE.ComerValidUser}/${user}`);
  }

  getCountDescription(event: number, factura: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ComerCount}?eventId${event}&invoiceId=${factura}`
    );
  }

  pufValidaInvoiceSP(event: number, folioSp: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationFolioSP}?eventId=${event}&invoiceSb=${folioSp}`
    );
  }

  getEats(event: number, expend: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationEats}?eventId=${event}&expenseId=${expend}`
    );
  }

  pkComerVnr(data: {
    pEvent: string;
    pLot: string;
    pInvoice: string;
    pLegend: string;
    pAuthorized: string;
    pStatus: string;
    pCauseA: string;
    pOption: string;
    pDelEmits: string;
    pOcionCan: string;
  }) {
    return this.post(ENDPOINT_INVOICE.PkComerVnr, data);
  }
}
