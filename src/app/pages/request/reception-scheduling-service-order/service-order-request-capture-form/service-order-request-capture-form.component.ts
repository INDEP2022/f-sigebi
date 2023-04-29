import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-service-order-request-capture-form',
  templateUrl: './service-order-request-capture-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class ServiceOrderRequestCaptureFormComponent
  extends BasePage
  implements OnInit
{
  claimRequest: boolean = false;

  parentModal: BsModalRef;
  constructor() {
    super();
  }

  ngOnInit(): void {}

  showDocument() {}

  sendOrderService() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea enviar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio enviada correctamente',
          ''
        );
      }
    });
  }

  saveService() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea guardar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio guardada correctamente',
          ''
        );
      }
    });
  }
}
