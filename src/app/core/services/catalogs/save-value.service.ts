import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SaveValuesEndpoints } from 'src/app/common/constants/endpoints/save-values-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISaveValue } from '../../models/catalogs/save-value.model';
@Injectable({
  providedIn: 'root',
})
export class SaveValueService
  extends HttpService
  implements ICrudMethods<ISaveValue>
{
  private readonly route: string = ENDPOINT_LINKS.SaveValue;
  constructor(private saveValueRepository: Repository<ISaveValue>) {
    super();
    this.microservice = SaveValuesEndpoints.BaseaPath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ISaveValue>> {
    return this.saveValueRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISaveValue> {
    return this.saveValueRepository.getById(this.route, id);
  }

  create(model: ISaveValue): Observable<ISaveValue> {
    return this.saveValueRepository.create(this.route, model);
  }

  update(id: string | number, model: ISaveValue): Observable<Object> {
    return this.saveValueRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.saveValueRepository.remove(this.route, id);
  }

  getCveSaveValues(params: ListParams) {
    return this.saveValueRepository.getAllPaginated(this.route, params);
  }

  remove2(model: ISaveValue) {
    const route = `${SaveValuesEndpoints.SaveValue}`;
    return this.delete(route, model);
  }
}
