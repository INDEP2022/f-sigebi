import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIssuingInstitution } from '../../models/catalogs/issuing-institution.model';
import { ITransferente } from '../../models/catalogs/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class IssuingInstitutionService
  implements ICrudMethods<IIssuingInstitution>
{
  private readonly route: string = ENDPOINT_LINKS.IssuingInstitution;
  private readonly cityRoute: string = ENDPOINT_LINKS.City;
  private readonly transferRoute: string = ENDPOINT_LINKS.Transferente;
  constructor(
    private issuingInstitutionRepository: Repository<IIssuingInstitution>,
    private cityRepository: Repository<ICity>,
    private transferenteRepository: Repository<ITransferente>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IIssuingInstitution>> {
    return this.issuingInstitutionRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IIssuingInstitution> {
    return this.issuingInstitutionRepository.getById(this.route, id);
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
}
