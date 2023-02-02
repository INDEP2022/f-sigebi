import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CostCatalogService {
  constructor(private htpp: HttpClient) {}

  getCostCatalog() {
    const url = `${environment.API_URL}catalog/api/v1/service-cat`;
    return this.htpp.get(url);
  }

  getCostCatalogForSearch(search: string) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat/${search}`;
    return this.htpp.get(url);
  }

  putCostCatalog(code: string, body: any) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat/${code}`;
    return this.htpp.put(url, body);
  }

  postCostCatalog(body: any) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat`;
    return this.htpp.post(url, body);
  }

  deleteCostCatalog(code: string) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat/${code}`;
    return this.htpp.delete(url);
  }
}
