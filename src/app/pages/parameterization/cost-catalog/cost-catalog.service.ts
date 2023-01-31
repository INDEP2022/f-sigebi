import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CostCatalogService {
  constructor(private htpp: HttpClient) {}

  getCostCatalog() {
    const url = `${environment.API_URL}catalog/api/v1/service-cat?inicio=1&pageSize=10`;
    return this.htpp.get(url);
  }
}
