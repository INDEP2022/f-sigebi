import { Injectable } from '@angular/core';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

export interface IGoodFractionDTO {
  goodNumber?: number;
  fractionCod?: string;
}

export interface IFraction {
  nivel: string;
  codigo: string;
  descripcion_fraccion: string;
  clasificador_siab: string;
}

@Injectable({
  providedIn: 'root',
})
export class GoodFractionService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params: _Params) {
    return this.get<IListResponseMessage<IFraction>>(
      GoodEndpoints.GoodFraction,
      params
    );
  }
}
