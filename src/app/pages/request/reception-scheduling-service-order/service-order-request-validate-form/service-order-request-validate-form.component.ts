import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { ElectronicSignatureListComponent } from '../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../shared-request/show-signature-programming/show-signature-programming.component';
import { GenerateReportFormComponent } from '../components/generate-report-form/generate-report-form.component';

@Component({
  selector: 'app-service-order-request-validate-form',
  templateUrl: './service-order-request-validate-form.component.html',
  styles: [],
})
export class ServiceOrderRequestValidateFormComponent
  extends BasePage
  implements OnInit
{
  request: any;
  claimRequest: boolean = false;
  aprobateService: boolean = false;
  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

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

  declineOrderService() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea rechazar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio rechazada correctamente',
          ''
        );
      }
    });
  }

  approbateOrderService() {
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

  generateReport() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
          this.ShowReport();
        }
      },
    };

    const createService = this.modalService.show(
      GenerateReportFormComponent,
      config
    );
  }

  ShowReport() {
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
}
