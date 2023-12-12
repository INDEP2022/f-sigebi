import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IPreviewDatosCSV } from '../models/massive-good';

@Injectable({
  providedIn: 'root',
})
export class ExpenseMassiveGoodService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
  constructor() {
    super();
    this.microservice = 'massivegood';
  }

  PUP_EXPOR_ARCHIVO_BASE(idGasto: number) {
    return this.get<string>('application/pup-export-file-base/' + idGasto);
  }

  ABRE_ARCHIVO_CSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<{
      data: {
        tmpGasp: IPreviewDatosCSV[];
        tmpError: { tmpErrorDescription: string }[];
      };
    }>(
      `${this._url}${this.microservice}/${this._prefix}application/pup-preview-datos-csv`,
      formData
    );

    // return this.httpClient.post(request).pipe(
    //   catchError(error => {
    //     console.log(error);
    //     return throwError(() => error);
    //   })
    // );
  }
}
