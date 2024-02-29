import { Injectable } from '@angular/core';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IGoodsBySeg, IGoodsByVig } from '../models/numerary';

@Injectable({
  providedIn: 'root',
})
export class ExpenseNumeraryService extends HttpService {
  constructor() {
    super();
    this.microservice = NumeraryEndpoints.Numerary;
  }

  PUP_CARGA_BIENES_VIG(mes: number, contract: string) {
    return this.post<IListResponseMessage<IGoodsByVig>>(
      NumeraryEndpoints.loadGoodsVig,
      { mes, contract }
    );
  }

  PUP_CARGA_BIENES_SEG(policy: string) {
    return this.post<IListResponseMessage<IGoodsBySeg>>(
      NumeraryEndpoints.loadGoodsSeg,
      { policy }
    );
  }

  PUP_GUARDA_BIENES_SEG(policy: string, spentId: number) {
    return this.post('application/load-goods-update-seg', { policy, spentId });
  }
}
