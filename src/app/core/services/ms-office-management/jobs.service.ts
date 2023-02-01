import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class JobsService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return;
  }

  getById(id: number | string) {
    return this.httpClient.get(
      `${environment.API_URL}officemanagement/api/v1/jobs/${id}`
    );
  }

  create(job: any) {
    const route = `${environment.API_URL}officemanagement/api/v1/jobs`;
    return this.httpClient.post(route, job);
  }
}
