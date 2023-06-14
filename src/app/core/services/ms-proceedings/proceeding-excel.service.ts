import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsExcelService extends HttpService {
  // private readonly endpoint = 'exportproceedings';
  constructor() {
    super();
    this.microservice = 'exportproceedings';
  }

  getExcel(body: any) {
    return this.post('export-excel/proceeding', body);
  }
}
