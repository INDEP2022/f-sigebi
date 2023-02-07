import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICatMotiveRev } from '../../models/catalogs/cat-motive-rev';

@Injectable({
  providedIn: 'root',
})
export class CatMotiveRevService implements ICrudMethods<ICatMotiveRev> {
  private readonly route: string = ''; //ENDPOINT_LINKS.parametergoodCat;
  constructor(private catMotiveRevRepository: Repository<ICatMotiveRev>) {}

  getAll(params?: ListParams): Observable<IListResponse<ICatMotiveRev>> {
    return this.catMotiveRevRepository.getAllPaginated(this.route, params);
  }
}
