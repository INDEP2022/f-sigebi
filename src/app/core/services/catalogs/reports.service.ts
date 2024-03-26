import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
@Injectable({
  providedIn: 'root',
})
export class ReportService implements ICrudMethods<any> {
  constructor(private responseRepository: Repository<any>) {}

  getAll(params?: ListParams): Observable<any> {
    return this.responseRepository.getAllPaginated(
      ENDPOINT_LINKS.Reports,
      params
    );
  }
}
