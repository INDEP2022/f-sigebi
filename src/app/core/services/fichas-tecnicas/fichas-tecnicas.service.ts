import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FichasTecnicasService extends HttpService {
  private readonly getFichas: string = ENDPOINT_LINKS.FichaTecnica;
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.GoodsQuery;
  }

  getFichasTecnicas(params?: ListParams): Observable<IListResponse<any>> {
    console.log(this.getFichas);
    let url = ``;
    return this.get<IListResponse<any>>(this.getFichas, params);
  }
}
