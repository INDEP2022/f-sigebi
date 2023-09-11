import { Injectable } from '@angular/core';
import { outsideTrades } from 'src/app/common/constants/endpoints/outside-trades';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class OutsideTradesService extends HttpService {
  private readonly route: string = outsideTrades.getBasicBody;
  private readonly route2: string = outsideTrades.getPreliminaryInvestigation;
  private readonly route3: string = outsideTrades.getNameOTValue;
  private readonly route4: string = outsideTrades.getCPP;
  private readonly route5: string = outsideTrades.getTipoOficio;

  constructor() {
    super();
    this.microservice = outsideTrades.BasePage;
  }

  getBasicBody(id: number) {
    this.microservice = 'catalog';
    return this.get(`${this.route}/${id}`);
  }
  getPreliminaryInvestigation(id: number) {
    this.microservice = 'notification';
    return this.get(`${this.route2}/${id}`);
  }
  getNameOTValue(id: number) {
    this.microservice = 'security';
    return this.get(`${this.route3}/${id}`);
  }
  getCPP(id: number) {
    this.microservice = 'security';
    return this.get(`${this.route4}/${id}`);
  }
  getTipoOficio(id: number) {
    this.microservice = 'officemanagement';
    return this.get(`${this.route5}${id}`);
  }
}
