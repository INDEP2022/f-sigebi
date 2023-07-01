import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentsRequestPerGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  create(data: any): Observable<any> {
    return this.post<any>(DocumentsEndpoints.DocumentsDictuXState, data);
  }

  remove(goodId: number): Observable<any> {
    return this.delete<any>(
      `${DocumentsEndpoints.DocumentsDictuXState}/${goodId}`
    );
  }
}
