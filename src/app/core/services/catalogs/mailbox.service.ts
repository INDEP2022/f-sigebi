import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMailbox } from '../../models/catalogs/mailbox.model';
@Injectable({
  providedIn: 'root',
})
export class MailBoxService implements ICrudMethods<IMailbox> {
  private readonly route: string = ENDPOINT_LINKS.MailBox;
  constructor(private mailBoxRepository: Repository<IMailbox>) {}

  getAll(params?: ListParams): Observable<IListResponse<IMailbox>> {
    return this.mailBoxRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMailbox> {
    return this.mailBoxRepository.getById(this.route, id);
  }

  create(model: IMailbox): Observable<IMailbox> {
    return this.mailBoxRepository.create(this.route, model);
  }

  update(id: string | number, model: IMailbox): Observable<Object> {
    return this.mailBoxRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.mailBoxRepository.remove(this.route, id);
  }
}
