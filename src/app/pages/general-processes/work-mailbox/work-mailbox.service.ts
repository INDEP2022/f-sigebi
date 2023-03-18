import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkMailboxService {
  constructor(private htpp: HttpClient) {}

  getView() {
    const url = `${environment.API_URL}proceduremanagement/api/v1/views/management-process?filter.processNumber=786300`;
    return this.htpp.get(url);
  }
}
// proceduremanagement/api/v1/historical-procedure-management
