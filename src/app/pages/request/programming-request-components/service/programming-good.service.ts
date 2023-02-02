import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProgrammingGoodRepository } from 'src/app/common/repository/repositories/ms-goods-programming.repository';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';

@Injectable({ providedIn: 'root' })
export class ProgrammingGoodService implements ICrudMethods<IGoodProgramming> {
  private readonly route: string = ENDPOINT_LINKS.ProgrammingGood;
  constructor(
    private progGoodRepository: ProgrammingGoodRepository<IGoodProgramming>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodProgramming>> {
    return this.progGoodRepository.getAllPaginated(this.route, params);
  }
}
