import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocCompensationSatXml } from '../../models/catalogs/doc-compensation-sat-xml.model';
import { IDocCompensation } from '../../models/catalogs/doc-compensation.model';
import { IDocCompesationSat } from '../../models/catalogs/doc-compesation-sat.model';
@Injectable({
  providedIn: 'root',
})
export class DocCompensationService implements ICrudMethods<IDocCompensation> {
  private readonly route: string = ENDPOINT_LINKS.DocCompensation;
  private readonly docCompensationSATRoute = ENDPOINT_LINKS.DocCompensationSAT;
  private readonly docCompensationSATXMLRoute =
    ENDPOINT_LINKS.DocCompensationSatXML;
  constructor(
    private docCompensationRepository: Repository<IDocCompensation>,
    private docCompensationSatRepository: Repository<IDocCompesationSat>,
    private docCompensationSatXmlRepository: Repository<IDocCompensationSatXml>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDocCompensation>> {
    return this.docCompensationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDocCompensation> {
    return this.docCompensationRepository.getById(this.route, id);
  }

  create(model: IDocCompensation): Observable<IDocCompensation> {
    return this.docCompensationRepository.create(this.route, model);
  }

  update(id: string | number, model: IDocCompensation): Observable<Object> {
    return this.docCompensationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.docCompensationRepository.remove(this.route, id);
  }

  getDocCompensationSat(params: ListParams) {
    return this.docCompensationSatRepository.getAllPaginated(
      this.docCompensationSATRoute,
      params
    );
  }

  getDocCompensationSatXml(params: ListParams) {
    return this.docCompensationSatXmlRepository.getAllPaginated(
      this.docCompensationSATXMLRoute,
      params
    );
  }
}
