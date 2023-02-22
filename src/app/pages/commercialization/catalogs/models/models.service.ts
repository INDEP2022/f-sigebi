import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  constructor(private htpp: HttpClient) {}

  getModels() {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-models`;
    return this.htpp.get(url);
  }

  PutModel(idModel: string, body: any) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-models/id/${idModel}`;
    return this.htpp.put(url, body);
  }

  postModel(body: any) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-models`;
    return this.htpp.post(url, body);
  }

  getModelForId(idModel: string) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-models/id/${idModel}`;
    return this.htpp.get(url);
  }

  deleteModelForId(idModel: string) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-brands/id/${idModel}`;
    return this.htpp.delete(url);
  }
}
