import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { Confiscatedpoints } from '../../../common/constants/endpoints/ms-confiscated-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ConfiscatedProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = Confiscatedpoints.basepath;
  }
}
