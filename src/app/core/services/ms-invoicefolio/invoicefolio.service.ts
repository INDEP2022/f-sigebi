import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { InvoiceFolioEndPoint } from 'src/app/common/constants/endpoints/invoicefolio-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  InvoiceFolio,
  InvoiceFolioSeparate,
} from '../../models/ms-invoicefolio/invoicefolio.model';

@Injectable({
  providedIn: 'root',
})
export class InvoicefolioService extends HttpService {
  constructor() {
    super();
    this.microservice = InvoiceFolioEndPoint.BasePage;
  }

  getAll(params: Params | string): Observable<IListResponse<InvoiceFolio>> {
    return this.get(InvoiceFolioEndPoint.Folio, params);
  }

  createFolio(data: InvoiceFolio) {
    return this.post(InvoiceFolioEndPoint.Folio, data);
  }

  updateFolio(data: InvoiceFolio) {
    return this.put(
      `${InvoiceFolioEndPoint.Folio}/${data.folioinvoiceId}`,
      data
    );
  }

  deleteFolio(id: number) {
    return this.delete(`${InvoiceFolioEndPoint.Folio}/${id}`);
  }

  getAllFolioSepate(
    params: Params | string
  ): Observable<IListResponse<InvoiceFolioSeparate>> {
    return this.get(InvoiceFolioEndPoint.FolioSeparte, params);
  }

  createFolioSeparate(data: InvoiceFolioSeparate) {
    return this.post(InvoiceFolioEndPoint.FolioSeparte, data);
  }

  updateFolioSeparate(data: InvoiceFolioSeparate) {
    return this.put(`${InvoiceFolioEndPoint.FolioSeparte}`, data);
  }

  deleteFolioSeparate(data: any) {
    return this.delete(InvoiceFolioEndPoint.FolioSeparte, data);
  }

  getAuxFolio(data: {
    pSerie: string;
    pFolioIni: number;
    pFolioFin: number;
    pRegion: number;
    idFolioFact: any;
  }) {
    return this.post(InvoiceFolioEndPoint.GetAuxFolio, data);
  }

  validateSerieInUse(folio: number) {
    return this.get(`${InvoiceFolioEndPoint.ValidateSerieInUse}/${folio}`);
  }

  validateSerieFolio(serie: string) {
    return this.get(`${InvoiceFolioEndPoint.ValidateSerieFolio}/${serie}`);
  }

  getMaxFolio(folio: number) {
    return this.get(`${InvoiceFolioEndPoint.GetMaxFolio}/${folio}`);
  }

  validateFolioAvailable(event: number, tpEvent: number) {
    return this.get(
      `${InvoiceFolioEndPoint.ValidateFoliosAvailable}/${event}/${tpEvent}`
    );
  }
}
