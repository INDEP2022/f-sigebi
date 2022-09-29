import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IQuestion } from '../../models/catalogs/question.model';
@Injectable({
  providedIn: 'root',
})
export class QuestionService implements ICrudMethods<IQuestion> {
  private readonly route: string = ENDPOINT_LINKS.Question;
  constructor(private questionRepository: Repository<IQuestion>) {}

  getAll(params?: ListParams): Observable<IListResponse<IQuestion>> {
    return this.questionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IQuestion> {
    return this.questionRepository.getById(this.route, id);
  }

  create(model: IQuestion): Observable<IQuestion> {
    return this.questionRepository.create(this.route, model);
  }

  update(id: string | number, model: IQuestion): Observable<Object> {
    return this.questionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.questionRepository.remove(this.route, id);
  }
}
