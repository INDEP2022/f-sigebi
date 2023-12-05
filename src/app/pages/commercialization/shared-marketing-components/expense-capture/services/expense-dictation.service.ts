import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpenseDictationService extends HttpService {
  constructor() {
    super();
    this.microservice = 'dictation';
  }

  maxInCsv(user: string) {
    return this.get<IListResponseMessage<{ max: string }>>(
      'application/pbAbrirCsv/' + user
    ).pipe(
      catchError(x => {
        return of({ data: [] as { max: string }[] });
      }),
      map(x => {
        return x.data.length > 0 ? x.data[0].max : null;
      })
    );
  }
}
