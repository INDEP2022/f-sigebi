import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITables } from '../../models/catalogs/dinamic-tables.model';
import { ITvalTable5 } from '../../models/catalogs/tval-Table5.model';

@Injectable({
  providedIn: 'root',
})
export class TvalTable5Service
  extends HttpService
  implements ICrudMethods<ITvalTable5>
{
  private readonly route: string = ENDPOINT_LINKS.DinamicTablesTable;
  private readonly route1: string = ENDPOINT_LINKS.DinamicTables;
  private readonly routeFilter: string = ENDPOINT_LINKS.DinamicTable;
  constructor(
    private Tvaltablas1Repository: Repository<ITvalTable5>,
    private TvaltablasRepository: Repository<ITables>
  ) {
    super();
    this.microservice = 'dynamiccatalog';
  }

  getById2(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ITables>> {
    return this.TvaltablasRepository.getById4(
      `${this.route1}/type-table`,
      id,
      params
    );
  }
  getById4(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ITvalTable5>> {
    return this.Tvaltablas1Repository.getById4(`${this.route}`, id, params);
  }
  create2(id: string | number, model: ITvalTable5): Observable<ITvalTable5> {
    return this.Tvaltablas1Repository.create2(
      `${this.route1}/tval-table5/${id}`,
      model
    );
  }

  getById4WidthFilters(
    id: string | number,
    params?: string
  ): Observable<IListResponse<ITvalTable5>> {
    return this.get(`${this.routeFilter}/${id}`, params);
  }

  update2(
    id: string | number,
    type: string | number,
    model: ITvalTable5
  ): Observable<Object> {
    return this.Tvaltablas1Repository.update2(
      `${this.route1}/tval-table5/id/${id}/typeTable`,
      type,
      model
    );
  }
}
