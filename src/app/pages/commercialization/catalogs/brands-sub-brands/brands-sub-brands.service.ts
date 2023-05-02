import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsSubBrandsService {
  constructor(private htpp: HttpClient) {}

  getBrands() {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-brands`;
    return this.htpp.get(url);
  }

  getBrandsForId(idBrand: string) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-brands/id/${idBrand}`;
    return this.htpp.get(url);
  }

  getSubBrands() {
    const url = `${environment.API_URL}parametercomer/api/v1/sub-brands`;
    return this.htpp.get(url);
  }

  PutBrand(idBrand: string, body: any) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-brands/id/${idBrand}`;
    return this.htpp.put(url, body);
  }

  postBrands(body: any) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-brands`;
    return this.htpp.post(url, body);
  }

  postSubBrands(body: any) {
    const url = `${environment.API_URL}parametercomer/api/v1/sub-brands`;
    return this.htpp.post(url, body);
  }

  putSubBrands(body: any) {
    const url = `${environment.API_URL}parametercomer/api/v1/sub-brands`;
    return this.htpp.post(url, body);
  }

  deleteBrandsForId(idBrand: string) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-brands/id/${idBrand}`;
    return this.htpp.delete(url);
  }
}
