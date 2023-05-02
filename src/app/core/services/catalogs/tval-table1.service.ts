import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ITables,
  TvalTable1Data,
} from '../../models/catalogs/dinamic-tables.model';
import { ITvaltable1 } from '../../models/catalogs/tvaltable-model';

@Injectable({
  providedIn: 'root',
})
export class TvalTable1Service implements ICrudMethods<ITvaltable1> {
  private readonly route: string = ENDPOINT_LINKS.DinamicTablesName;
  private readonly route1: string = ENDPOINT_LINKS.DinamicTables;
  private readonly route2: string = ENDPOINT_LINKS.DinamicTable1;
  private readonly route3: string = ENDPOINT_LINKS.DinamicTablesFind;
  constructor(
    private Tvaltablas1Repository: Repository<ITvaltable1>,
    private tavaltable1: Repository<TvalTable1Data>,
    private TvaltablasRepository: Repository<ITables>
  ) {}

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
  getById5(id: string | number): Observable<TvalTable1Data> {
    return this.tavaltable1.getById2(`${this.route2}/tableKey/422/value`, id);
  }
  getById6(id: string | number): Observable<TvalTable1Data> {
    return this.tavaltable1.getById2(`${this.route2}/tableKey/423/otKey`, id);
  }
  getByIdFind(id: string | number): Observable<any> {
    return this.tavaltable1.getById2(`${this.route3}`, id);
  }
  getById4(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ITvaltable1>> {
    return this.Tvaltablas1Repository.getById4(`${this.route}`, id, params);
  }
  create2(id: string | number, model: ITvaltable1): Observable<ITvaltable1> {
    return this.Tvaltablas1Repository.create2(
      `${this.route1}/tval-table1/${id}`,
      model
    );
  }

  update(id: string | number, model: ITvaltable1): Observable<Object> {
    return this.Tvaltablas1Repository.update2(
      `${this.route1}/tval-table1/typeTable`,
      id,
      model
    );
  }
}
