import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IGenerateClave } from '../../models/ms-security/generate-clave-model';

@Injectable({
  providedIn: 'root',
})
export class GenerateCveService extends HttpService {
  constructor() {
    super();
    this.microservice = 'security';
  }

  generateCve(sender: IGenerateClave) {
    const route = `application/generateclave`;
    return this.post(route, sender);
  }
}
