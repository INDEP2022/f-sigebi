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

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  liberateRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas liberar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
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
      '¿Deseas enviar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
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
      '¿Deseas guardar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
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
      '¿Deseas aprobar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
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
      '¿Deseas rechazar la justificacion con el folio METROPOLITANA-SAT-1340-OS?'
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
