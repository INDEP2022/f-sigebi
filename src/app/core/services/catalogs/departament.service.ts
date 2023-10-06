import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartamentEndpoints } from 'src/app/common/constants/endpoints/departament-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDelegation } from '../../models/catalogs/delegation.model';
import { IDepartment } from '../../models/catalogs/department.model';
import { ISubdelegation } from '../../models/catalogs/subdelegation.model';
@Injectable({
  providedIn: 'root',
})
export class DepartamentService
  extends HttpService
  implements ICrudMethods<IDepartment>
{
  private readonly route: string = ENDPOINT_LINKS.Departament;
  private readonly delegationsRoute: string = ENDPOINT_LINKS.Delegation;
  private readonly subdelegationsRoute: string = ENDPOINT_LINKS.Subdelegation;
  constructor(
    private departamentRepository: Repository<IDepartment>,
    private delegationRepository: Repository<IDelegation>,
    private subdelegationRepository: Repository<ISubdelegation>
  ) {
    super();
    this.microservice = DepartamentEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<IDepartment>> {
    return this.departamentRepository.getAllPaginated(this.route, params);
  }

  getDepartments(id: number) {
    return this.get(`${ENDPOINT_LINKS.Departments}/${id}`);
  }

  getById(id: string | number): Observable<IDepartment> {
    return this.departamentRepository.getById(this.route, id);
  }

  create(model: IDepartment): Observable<IDepartment> {
    return this.departamentRepository.create(this.route, model);
  }

  update4(model: IDepartment): Observable<Object> {
    return this.departamentRepository.update4(this.route, model);
  }

  remove3(model: any): Observable<Object> {
    return this.departamentRepository.remove3(this.route, model);
  }

  getDelegations(params: ListParams) {
    return this.delegationRepository.getAllPaginated(
      this.delegationsRoute,
      params
    );
  }
  getDelegationsCatalog(params: ListParams) {
    return this.delegationRepository.getAllPaginated(
      this.delegationsRoute + '/get-all',
      params
    );
  }
  getSubdelegations(params: ListParams) {
    return this.subdelegationRepository.getAllPaginated(
      this.subdelegationsRoute + '/get-all',
      params
    );
  }

  getByDelegationsSubdelegation(
    idDelegation: string | number,
    idSubdelegation: string | number
  ): Observable<IListResponse<IDepartment>> {
    return this.departamentRepository.getByIdDelegationSubdelegation(
      idDelegation,
      idSubdelegation
    );
  }

  removeByBody(obj: Object): Observable<Object> {
    return this.departamentRepository.remove3(this.route, obj);
  }

  update2(model: IDepartment): Observable<Object> {
    return this.departamentRepository.update3(
      'catalog/api/v1/departament',
      model
    );
  }

  getByDelIds(model: Partial<IDepartment>): Observable<IDepartment> {
    return this.departamentRepository.create(this.route + '/id', model);
  }

  getByDelegationsSubdelegation2(
    idDelegation: string | number,
    idSubdelegation: string | number,
    params?: ListParams
  ): Observable<IListResponse<IDepartment>> {
    const route = `${DepartamentEndpoints.Departament}?filter.numDelegation=${idDelegation}&filter.numSubDelegation=${idSubdelegation}`;
    return this.get(route, params);
  }

  getInCatDepartaments(body: any) {
    const route = `${DepartamentEndpoints.GetInCatDepartaments}`;
    return this.post(route, body);
  }

  getbyDelegation(id: any, descripcion: any) {
    const route = `${DepartamentEndpoints.Departament}?filter.numDelegation=$eq:${id}&filter.description=$ilike:${descripcion}`;
    return this.get(route);
  }

  getDeparmentById(model: any): Observable<IDepartment> {
    return this.departamentRepository.create(this.route + '/id', model);
  }

  getAllDepartament(params: any, name: any) {
    const route = `${DepartamentEndpoints.Departament}?filter.dsarea=$ilike:${name}`;
    return this.get(route, params);
  }

  getAllDepartamentByparams(
    id: any,
    numDelegation: any,
    numSubDelegation: any,
    phaseEdo: any
  ) {
    const route = `${DepartamentEndpoints.Departament}?filter.id=$eq:${id}&filter.numDelegation=$eq:${numDelegation}&filter.numSubDelegation.id=$eq:${numSubDelegation}&filter.phaseEdo=$eq:${phaseEdo}`;
    return this.get(route);
  }

  getDepartamentBycve(id: any) {
    const route = `${DepartamentEndpoints.Departament}?filter.dsarea=$eq:${id}`;
    return this.get(route);
  }

  getAllDepartamentByname(params: any, name: any) {
    const route = `${DepartamentEndpoints.Departament}?filter.description=$ilike:${name}`;
    return this.get(route, params);
  }

  getDepartamentById(id: any) {
    const route = `${DepartamentEndpoints.Departament}?filter.id=$eq:${id}`;
    return this.get(route);
  }
}
