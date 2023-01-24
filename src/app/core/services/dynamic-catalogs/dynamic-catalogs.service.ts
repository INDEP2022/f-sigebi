import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IExpedient } from '../../models/expedient/expedient.model';
@Injectable({
  providedIn: 'root',
})
export class DynamicCatalogService {
  private readonly route: string = 'dynamiccatalog/dinamic-tables';
  constructor(private expedientRepository: Repository<IExpedient>) {}
  getDynamicData(id: string | number, params: ListParams) {
    return this.expedientRepository.getAllPaginated(
      this.route + '/get-tvaltable1-by-name/' + id,
      params
    );
  }
}
