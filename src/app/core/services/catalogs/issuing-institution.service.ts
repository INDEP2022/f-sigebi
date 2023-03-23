import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IssuuingInstitutionEndpoints } from 'src/app/common/constants/endpoints/issuing-institution-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IIssuingInstitution,
  IOTClaveEntityFederativeByAsuntoSAT,
} from '../../models/catalogs/issuing-institution.model';
import { ITransferente } from '../../models/catalogs/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class IssuingInstitutionService
  extends HttpService
  implements ICrudMethods<IIssuingInstitution>
{
  private readonly route: string = ENDPOINT_LINKS.IssuingInstitution;
  private readonly cityRoute: string = ENDPOINT_LINKS.City;
  private readonly transferRoute: string = ENDPOINT_LINKS.Transferente;
  constructor(
    private issuingInstitutionRepository: Repository<IIssuingInstitution>,
    private cityRepository: Repository<ICity>,
    private transferenteRepository: Repository<ITransferente>
  ) {
    super();
    this.microservice = IssuuingInstitutionEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<IIssuingInstitution>> {
    return this.issuingInstitutionRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getAllFiltered(
    params?: string
  ): Observable<IListResponse<IIssuingInstitution>> {
    const segments = this.route.split('/');
    return this.get<IListResponse<IIssuingInstitution>>(segments[1], params);
  }

  getById(id: string | number): Observable<IIssuingInstitution> {
    const segments = this.route.split('/');
    const route = `${segments[1]}/id/${id}`;
    return this.get(route);
    // return this.issuingInstitutionRepository.getById(this.route, id);
  }

  create(model: IIssuingInstitution): Observable<IIssuingInstitution> {
    return this.issuingInstitutionRepository.create(this.route, model);
  }

  update(id: string | number, model: IIssuingInstitution): Observable<Object> {
    return this.issuingInstitutionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.issuingInstitutionRepository.remove(this.route, id);
  }

  getCities(params?: ListParams): Observable<IListResponse<ICity>> {
    return this.cityRepository.getAllPaginated(this.cityRoute, params);
  }

  getTransfers(params?: ListParams): Observable<IListResponse<ITransferente>> {
    return this.transferenteRepository.getAllPaginated(
      this.transferRoute,
      params
    );
  }
  getOTClaveEntityFederativeByAsuntoSat(
    id: string | number
  ): Observable<IOTClaveEntityFederativeByAsuntoSAT> {
    const route = `catalog/api/v1/state-of-republic/otclave/`;
    return this.issuingInstitutionRepository.getOTClaveEntityFederativeByAsuntoSat(
      this.route,
      id
    );
  }
  getOTClaveEntityFederativeByAvePrevia(
    id: string | number
  ): Observable<IOTClaveEntityFederativeByAsuntoSAT> {
    const route = `catalog/api/v1/state-of-republic/otclave/`;
    return this.issuingInstitutionRepository.getOTClaveEntityFederativeByAvePrevia(
      this.route,
      id
    );
  }

  update2(id: string | number, model: IIssuingInstitution) {
    const route = `${IssuuingInstitutionEndpoints.InstitutionClasification}/id/${id}`;
    return this.put(route, model);
  }

  getInstitutionByClasif(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IIssuingInstitution>> {
    const route = `${IssuuingInstitutionEndpoints.InstitutionClasification}?filter.numClasif=${id}`;
    return this.get(route, params);
  }

  remove2(id: string | number) {
    const route = `${IssuuingInstitutionEndpoints.InstitutionClasification}/id/${id}`;
    return this.delete(route);
  }
}
