import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgrammingGoodEndpoints } from 'src/app/common/constants/endpoints/ms-programming-good-enpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProgrammingGoodService implements ICrudMethods<IGoodProgramming> {
  private readonly route: string = ProgrammingGoodEndpoints.ProgrammingGood;
  constructor(private httpClient: HttpClient) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodProgramming>> {
    return this.httpClient.get<IListResponse<IGoodProgramming>>(
      `${environment.API_URL}${this.route}api/v1/programming`
    );
  }
}
