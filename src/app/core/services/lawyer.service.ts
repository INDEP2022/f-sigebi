import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { ILawyer } from '../models/lawyer.model';
@Injectable({
  providedIn: 'root',
})
export class LawyerService implements ICrudMethods<ILawyer> {
  private readonly route: string = ENDPOINT_LINKS.Lawyer;
  constructor(private lawyerRepository: Repository<ILawyer>) {}

  getAll(params?: ListParams): Observable<IListResponse<ILawyer>> {
    return this.lawyerRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ILawyer> {
    return this.lawyerRepository.getById(this.route, id);
  }

  create(model: ILawyer): Observable<ILawyer> {
    return this.lawyerRepository.create(this.route, model);
  }

  update(id: string | number, model: ILawyer): Observable<Object> {
    return this.lawyerRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.lawyerRepository.remove(this.route, id);
  }
}
