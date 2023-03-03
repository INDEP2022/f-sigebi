import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IWarehouse } from '../../models/catalogs/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class WarehouseFilterService extends HttpService {
  microsevice: string = '';
  constructor() {
    super();
  }

  getWarehouseFilter(params?: string): Observable<IListResponse<IWarehouse>> {
    let partials = ENDPOINT_LINKS.Warehouse.split('/');
    this.microservice = partials[0];
    console.log(
      this.get<IListResponse<IWarehouse>>(partials[1], params).pipe(
        tap(() => (this.microservice = ''))
      )
    );
    return this.get<IListResponse<IWarehouse>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }
}
