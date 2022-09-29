import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocCompensationSatXml } from '../../models/catalogs/doc-compensation-sat-xml.model';
@Injectable({
  providedIn: 'root',
})
export class DocCompensationSatXmlService
  implements ICrudMethods<IDocCompensationSatXml>
{
  private readonly route: string = ENDPOINT_LINKS.DocCompensationSatXML;
  constructor(
    private docCompensationSatXMLRepository: Repository<IDocCompensationSatXml>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IDocCompensationSatXml>> {
    return this.docCompensationSatXMLRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IDocCompensationSatXml> {
    return this.docCompensationSatXMLRepository.getById(this.route, id);
  }

  create(model: IDocCompensationSatXml): Observable<IDocCompensationSatXml> {
    return this.docCompensationSatXMLRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: IDocCompensationSatXml
  ): Observable<Object> {
    return this.docCompensationSatXMLRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.docCompensationSatXMLRepository.remove(this.route, id);
  }
}
