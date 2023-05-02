import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { GenerateReportFormComponent } from '../../reception-scheduling-service-order/components/generate-report-form/generate-report-form.component';
import { RejectionCommentFormComponent } from '../../reception-scheduling-service-order/components/rejection-comment-form/rejection-comment-form.component';
import { RejectionJustifyFormComponent } from '../../reception-scheduling-service-order/components/rejection-justify-form/rejection-justify-form.component';
import { ElectronicSignatureListComponent } from '../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../shared-request/show-signature-programming/show-signature-programming.component';

@Component({
  selector: 'app-order-service-delivery-form',
  templateUrl: './order-service-delivery-form.component.html',
  styles: [],
})
export class OrderServiceDeliveryFormComponent
  extends BasePage
  implements OnInit
{
  @Input() task: number;
  showForm: boolean = false;
  aprobateService: boolean = false;
  rejected: boolean = false;
  title: string = '';
  buttonClaim: boolean = false;
  buttonLiberate: boolean = false;
  buttonSend: boolean = false;
  buttonSendFalse: boolean = false;
  buttonGenerateReport: boolean = false;
  buttonGenerateReportFalse: boolean = false;
  buttonAprobate: boolean = false;
  buttonAprobateFalse: boolean = false;
  buttonAprobateView2: boolean = false;
  buttonAprobateView3: boolean = false;
  buttonAprobateView4: boolean = false;
  buttonAprobateView5: boolean = false;
  buttonReject: boolean = false;
  buttonRejectFalse: boolean = false;
  sendNotification: boolean = false;
  sendNotifications: boolean = false;
  buttonSave: boolean = false;
  buttonSaveFalse: boolean = false;
  buttonAnnexedW: boolean = false;
  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.processTitle();
  }

  processTitle() {
    if (this.task == 1) {
      this.title =
        'Captura de orden de servicio (Programación de entrega: E-METROPOLITANA-335) con folio: METROPOLITANA-1340-OS';
      this.buttonClaim = true;
      this.buttonSend = true;
    } else if (this.task == 2) {
      this.title =
        'Validación de servicios (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';
      this.buttonClaim = true;
      this.buttonGenerateReport = true;
      this.buttonAprobateView2 = true;
      this.buttonReject = true;
    } else if (this.task == 3 || this.task == 6) {
      this.title =
        'Aprobración de servicios (Programación de recepción: Programación de entrega E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';

      if (this.task == 6) {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateFalse = true;
      } else {
        this.buttonClaim = true;
        this.buttonGenerateReport = true;
        this.buttonAprobate = true;
      }
    } else if (this.task == 4) {
      this.title =
        'Reporte de implementación (Programación de entrega E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';
      this.buttonSendFalse = true;
      this.buttonSaveFalse = true;
    } else if (this.task == 5 || this.task == 11) {
      this.title =
        'Validación de reporte de implementación (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';
      if (this.task == 5) {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateView2 = true;
        this.buttonRejectFalse = true;
        this.buttonSaveFalse = true;
        this.buttonAnnexedW = true;
      } else {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateView4 = true;
        this.buttonRejectFalse = true;
        this.buttonSaveFalse = true;
        this.buttonAnnexedW = true;
      }
    } else if (this.task == 7) {
      this.title =
        'Reporte de implementación aprobado (Programación de entrega E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';
      this.buttonGenerateReportFalse = true;
      this.buttonAprobateView3 = true;
      this.buttonAnnexedW = true;
    } else if (this.task == 8 || this.task == 10) {
      this.title =
        'Validación de servicios (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';
      if (this.task == 10) {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateView5 = true;
        this.buttonSaveFalse = true;
      } else {
        this.buttonClaim = true;
        this.buttonLiberate = true;
        this.buttonGenerateReport = true;
        this.buttonReject = true;
        this.buttonSave = true;
      }
    } else if (this.task == 9 || this.task == 13) {
      this.title =
        'Rechazo de orden de servicios (Programación de entrega: E-METROPOLITANA-335) con folio: METROPOLITANA-1545-OS';
      this.buttonSendFalse = true;
      this.sendNotification = true;
      this.buttonSaveFalse = true;
    } else if (this.task == 12 || this.task == 14) {
      this.title =
        'Rechazo de reporte de implementación (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: METROPOLITANA-1545-OS';
      if (this.task == 14) {
        this.sendNotification = true;
        this.buttonSaveFalse = true;
      }
      this.buttonSendFalse = true;
      this.buttonSaveFalse = true;
    }
  }

  liberateRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea liberar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio liberada correctamente',
          ''
        );
      }
    });
  }

  sendRequest() {
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

  saveRequest() {
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

  aprobeRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea aprobar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio aprobada correctamente',
          ''
        );
      }
    });
  }

  validateJustification() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea rechazar la justificacion con el folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Justificación rechazada correctamente',
          ''
        );
        this.rejected = true;
      }
    });
  }

  declineOrderService() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
        }
      },
    };

    const rejectionComment = this.modalService.show(
      RejectionCommentFormComponent,
      config
    );
  }

  generateReport() {
    if (this.task != 5 && this.task != 6) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

      config.initialState = {
        callback: (data: any) => {
          if (data) {
            console.log(data);
            this.showReport();
          }
        },
      };

      const createService = this.modalService.show(
        GenerateReportFormComponent,
        config
      );
    } else {
      this.showReport();
    }
  }

  showReport() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
          this.electronicSignture();
        }
      },
    };

    const showReport = this.modalService.show(ShowProgrammingComponent, config);
  }

  electronicSignture() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
          this.showSignProg();
        }
      },
    };

    const showReport = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
          this.aprobateService = true;
        }
      },
    };

    const showReport = this.modalService.show(
      ShowSignatureProgrammingComponent,
      config
    );
  }

  createAnnexedW() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
          this.showReport();
        }
      },
    };

    const showReport = this.modalService.show(
      GenerateReportFormComponent,
      config
    );
  }

  sendJustify() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
        }
      },
    };

    const showReport = this.modalService.show(
      RejectionJustifyFormComponent,
      config
    );
  }
}
