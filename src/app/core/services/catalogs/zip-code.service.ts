import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZipCode } from '../../models/catalogs/zip-code.model';
@Injectable({
  providedIn: 'root',
})
export class ZipCodeService implements ICrudMethods<IZipCode> {
  private readonly route: string = ENDPOINT_LINKS.ZipCode;
  constructor(private zipCodeRepository: Repository<IZipCode>) {}

  getAll(params?: ListParams): Observable<IListResponse<IZipCode>> {
    return this.zipCodeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IZipCode> {
    return this.zipCodeRepository.getById(this.route, id);
  }

  create(model: IZipCode): Observable<IZipCode> {
    return this.zipCodeRepository.create(this.route, model);
  }

  update(id: string | number, model: IZipCode): Observable<Object> {
    return this.zipCodeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.zipCodeRepository.remove(this.route, id);
  }
}
