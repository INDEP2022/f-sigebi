import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DocReceptionRegisterService extends HttpService {
  microsevice: string = '';
  constructor() {
    super();
  }

  // getDepartments(params?: string): Observable<IListResponse<IDepartment>> {
  //   let partials = ENDPOINT_LINKS.Departament.split('/');
  //   this.microservice = partials[0];
  //   return this.get<IListResponse<IDepartment>>(partials[1], params).pipe(
  //     tap(() => (this.microservice = ''))
  //   );
  // }
}
