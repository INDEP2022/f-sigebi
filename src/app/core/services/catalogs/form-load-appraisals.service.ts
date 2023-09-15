import { Injectable } from '@angular/core';
import { formLoadAppraisalService } from 'src/app/common/constants/endpoints/form-load-appraisals';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class FormLoadAppraisalsService extends HttpService {
  private readonly route: string = formLoadAppraisalService.obtenerEvento;
  private readonly route2: string =
    formLoadAppraisalService.obtenerEstatusLotes;
  private readonly route3: string = formLoadAppraisalService.validarEvento;
  private readonly route4: string = formLoadAppraisalService.generarOficio;

  constructor() {
    super();
    this.microservice = formLoadAppraisalService.BasePage;
  }
  obtenerEvento(body: any) {
    console.log(body);
    return this.post(this.route, body);
  }
  obtenerEstatusLotes(body: any) {
    console.log(body);
    return this.post(this.route2, body);
  }
  validarEvento(body: any) {
    console.log(body);
    return this.post(this.route3, body);
  }
  generarOficio(body: any) {
    console.log(body);
    return this.post(this.route4, body);
  }
}
