import { Injectable } from '@angular/core';
import { MassiveAppraiseEndPoints } from 'src/app/common/constants/endpoints/ms-massiveappraise-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class MsMassiveappraiseService extends HttpService {
  private readonly route = MassiveAppraiseEndPoints;
  constructor() {
    super();
    this.microservice = MassiveAppraiseEndPoints.BasePath;
  }
  pupValidFile(body: any) {
    return this.post(this.route.pupValidFile, body);
  }
}
