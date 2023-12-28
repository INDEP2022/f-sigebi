import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpService {
  constructor() {
    super();
    this.microservice = 'user';
  }

  getCantUsusAutxCanc(user: string) {
    return this.get<number>(
      'application/value-user/' + user.toUpperCase()
    ).pipe(catchError(x => of(0)));
  }
}
