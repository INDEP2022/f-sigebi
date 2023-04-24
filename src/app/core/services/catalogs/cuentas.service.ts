import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICuenta } from '../../models/catalogs/cuenta.model';
@Injectable({
  providedIn: 'root',
})
export class CuentaService implements ICrudMethods<ICuenta> {
  private readonly route: string = ENDPOINT_LINKS.Bank;
  constructor(private cuentaRepository: Repository<ICuenta>) {}

  getAll(params?: ListParams): Observable<IListResponse<ICuenta>> {
    return this.cuentaRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ICuenta> {
    return this.cuentaRepository.getById(this.route, id);
  }

  create(model: ICuenta): Observable<ICuenta> {
    return this.cuentaRepository.create(this.route, model);
  }

  update(id: string | number, model: ICuenta): Observable<Object> {
    return this.cuentaRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.cuentaRepository.remove(this.route, id);
  }
}
