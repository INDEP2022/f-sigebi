import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProficient } from '../../models/catalogs/proficient.model';
@Injectable({
  providedIn: 'root',
})
export class ProeficientService
  extends HttpService
  implements ICrudMethods<IProficient>
{
  private readonly route: string = ENDPOINT_LINKS.Proeficient;
  constructor(private proeficientRepository: Repository<IProficient>) {
    super();
  }

  getAll(params?: ListParams): Observable<IListResponse<IProficient>> {
    return this.proeficientRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IProficient> {
    return this.proeficientRepository.getById(this.route, id);
  }

  create(model: IProficient): Observable<IProficient> {
    return this.proeficientRepository.create(this.route, model);
  }

  update(id: string | number, model: IProficient): Observable<Object> {
    return this.proeficientRepository.update(this.route, id, model);
  }

  updateProficient(model: IProficient): Observable<Object> {
    return this.httpClient.put(
      `${environment.API_URL}catalog/api/v1/proficient`,
      model
    );
  }

  remove(id: string | number): Observable<Object> {
    return this.proeficientRepository.remove(this.route, id);
  }

  searchText(params?: ListParams) {
    return this.proeficientRepository.getAllPaginated(this.route, params);
  }
}
