import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMunicipality } from '../../models/catalogs/municipality.model';
import { HttpService } from 'src/app/common/services/http.service';
import { MunicipalityEndpoints } from 'src/app/common/constants/endpoints/municipality';
@Injectable({
  providedIn: 'root',
})
export class MunicipalityService
  extends HttpService
  implements ICrudMethods<IMunicipality>
{
  private readonly route: string = ENDPOINT_LINKS.Municipality;
  constructor(private municipalityRepository: Repository<IMunicipality>) {
    super();
    this.microservice = MunicipalityEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<IMunicipality>> {
    return this.municipalityRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMunicipality> {
    return this.municipalityRepository.getById(this.route, id);
  }

  create(model: IMunicipality): Observable<IMunicipality> {
    return this.municipalityRepository.create(this.route, model);
  }

  postById(model: Object): Observable<IMunicipality> {
    return this.municipalityRepository.create(
      'catalog/municipality-sera/id',
      model
    );
  }

  update(id: string | number, model: IMunicipality): Observable<Object> {
    return this.municipalityRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.municipalityRepository.remove(this.route, id);
  }

  remove2(model: any): Observable<Object> {
    console.log('model', model);
    return this.delete(this.route, model);
  }
}
