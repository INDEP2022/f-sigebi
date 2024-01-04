import { Injectable } from '@angular/core';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { INotifyDTO, IValidGood } from '../models/expense-good-process';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGoodProcessService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
  }

  PROCESA_EVENTO_CHATARRA(
    id_concepto: number,
    pEvento: number,
    pRetenido: number
  ) {
    return this.put('application/put-process-scrap-event', {
      id_concepto,
      pEvento,
      pRetenido,
    });
  }

  replyFolio(body: INotifyDTO) {
    return this.post('application/fcomer084', body);
  }

  updateStatus(idLot: number, status: string) {
    return this.post('application/updateStatus', {
      idLot,
      status,
    });
  }

  CARGA_BIENES_EXCEL(file: File) {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(
      `${this._url}massivegood/${this._prefix}application/load-good-excel`,
      formData
    );
  }

  getValidGoods(
    lotId: number,
    pevent: number,
    pDevPartialGood: string,
    conceptId: number,
    PVALIDADET: string
  ) {
    return this.post<{ data: IValidGood[] }>(
      'application/query-pro-list-good',
      {
        lotId,
        pevent,
        pDevPartialGood,
        conceptId,
        PVALIDADET,
      }
    );
  }
}
