import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';

@Injectable({
  providedIn: 'root',
})
export class PrintFlyersService extends HttpService {
  microsevice: string = '';
  constructor() {
    super();
  }

  getSubdelegations(
    params?: string
  ): Observable<IListResponse<ISubdelegation>> {
    let partials = ENDPOINT_LINKS.Subdelegation.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<ISubdelegation>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getDepartments(params?: string): Observable<IListResponse<IDepartment>> {
    let partials = ENDPOINT_LINKS.Departament.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IDepartment>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }
}
