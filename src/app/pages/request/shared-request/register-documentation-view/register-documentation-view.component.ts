import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRequestDocumentation } from '../../../../core/models/requests/requestDocumentation.model';

@Component({
  selector: 'app-register-documentation-view',
  templateUrl: './register-documentation-view.component.html',
  styleUrls: ['./register-documentation-view.component.scss'],
})
export class RegisterDocumentationViewComponent
  extends BasePage
  implements OnInit
{
  @Input() requestId: number;
  requestDoc: IRequestDocumentation;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getRequestInfo();
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion de la documentacion de la solicitud
    this.requestDoc = {
      subject: 'NUMERARIO DECOMISADO DEVUELTO',
      contributor: 'Carlos G0 PALMA',
      memorandumNo: 54543,
      memorandumDate: '11/04/2018',
      receptionMethod: 'FÍSICA',
      transferType: 'MANUAL',
    };
  }
}
