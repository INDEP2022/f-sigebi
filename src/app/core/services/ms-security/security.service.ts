import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPupUser } from '../../models/ms-security/pup-user.model';

@Injectable({
  providedIn: 'root',
})
export class SecurityService extends HttpService {
  constructor() {
    super();
    this.microservice = 'security';
  }

  pupUser(user: string) {
    const route = `security/pup-user/${user}`;
    return this.get<IListResponse<IPupUser>>(route);
  }
}
