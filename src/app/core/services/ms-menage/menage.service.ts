import { Injectable } from '@angular/core';
import { MenageEndpoints } from 'src/app/common/constants/endpoints/ms-menage';
import { HttpService } from 'src/app/common/services/http.service';
import { IMenageWrite } from '../../models/ms-menage/menage.model';

@Injectable({
  providedIn: 'root',
})
export class MenageService extends HttpService {
  constructor() {
    super();
    this.microservice = MenageEndpoints.Menage;
  }

  create(menage: IMenageWrite) {
    return this.post(MenageEndpoints.MenageManagement, menage);
  }
}
