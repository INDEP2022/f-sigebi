import { Component, Input, OnInit } from '@angular/core';
import { IRequestInformation } from '../../../../core/models/requests/requestInformation.model';

@Component({
  selector: 'app-request-information',
  templateUrl: './request-information.component.html',
  styleUrls: ['./request-information.component.scss'],
})
export class RequestInformationComponent implements OnInit {
  toggleInfo: boolean = true;
  requestInfo: IRequestInformation;
  @Input() request: number | IRequestInformation;

  requestDataExample: IRequestInformation = {
    date: '17-abr-2018',
    requestNo: 1896,
    fileNo: 15499,
    memorandumNo: 54543,
    regionalDelegation: 'BAJA CALIFORNIA',
    state: 'BAJA CALIFORNIA',
    transferee: 'SAT - COMERCIO EXTERIOR',
    emitter: 'ALAF',
    authority: 'ADMINISTRACIÓN LOCAL DE AUDITORÍA FISCAL DE MEXICALI',
  };
  constructor() {}

  ngOnInit(): void {
    // console.log(this.request);
    this.getRequestInfo();
  }

  getRequestInfo() {
    if (typeof this.request === 'number') {
      // Llamar servicio para obtener info de la solicitud
      this.requestInfo = {
        ...this.requestDataExample,
        requestNo: this.request,
      };
    } else {
      this.requestInfo = this.request;
      console.log(this.requestInfo);
    }
  }
}
