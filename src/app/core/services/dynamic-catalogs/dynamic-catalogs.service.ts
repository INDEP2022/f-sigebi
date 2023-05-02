import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IExpedient } from '../../models/expedient/expedient.model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class DynamicCatalogService extends HttpService {
  private readonly route: string = 'dynamiccatalog/dinamic-tables';
  constructor(private expedientRepository: Repository<IExpedient>) {
    super();
    this.microservice = 'dynamiccatalog';
  }
  getDynamicData(id: string | number, params: ListParams) {
    return this.expedientRepository.getAllPaginated(
      this.route + '/get-tvaltable1-by-name/' + id,
      params
    );
  }
  getCurrency(id: string | number, params: ListParams) {
    return this.expedientRepository.getAllPaginated(
      this.route + '/get-tvaltable5-by-table/' + id,
      params
    );
  }

  getTable1Table5(body: any, params: _Params) {
    return this.post('dinamic-tables/get-otkey-otvalue', body, params);
  }
}
