import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MunicipalityEndpoints } from 'src/app/common/constants/endpoints/municipality';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMunicipality } from '../../models/catalogs/municipality.model';
import { IStateOfRepublic } from '../../models/catalogs/state-of-republic.model';
@Injectable({
  providedIn: 'root',
})
export class MunicipalityService
  extends HttpService
  implements ICrudMethods<IMunicipality>
{
  private readonly route: string = ENDPOINT_LINKS.Municipality;
  private readonly statesRoute = ENDPOINT_LINKS.StateOfRepublic;
  constructor(
    private municipalityRepository: Repository<IMunicipality>,
    private statesRepository: Repository<IStateOfRepublic>
  ) {
    super();
    this.microservice = MunicipalityEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<IMunicipality>> {
    return this.municipalityRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMunicipality> {
    return this.municipalityRepository.getById(this.route, id);
  }

  getStates(params: ListParams) {
    return this.statesRepository.getAllPaginated(this.statesRoute, params);
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

  update(model: any): Observable<Object> {
    return this.municipalityRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.municipalityRepository.remove(this.route, id);
  }

  remove2(model: any): Observable<Object> {
    console.log('model', model);
    return this.delete(this.route, model);
  }
}
