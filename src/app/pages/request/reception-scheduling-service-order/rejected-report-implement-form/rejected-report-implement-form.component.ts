import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { ElectronicSignatureListComponent } from '../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../shared-request/show-signature-programming/show-signature-programming.component';
import { CreateServiceFormComponent } from '../components/create-service-form/create-service-form.component';
import { GenerateReportFormComponent } from '../components/generate-report-form/generate-report-form.component';
import { RejectionJustifyFormComponent } from '../components/rejection-justify-form/rejection-justify-form.component';

@Component({
  selector: 'app-rejected-report-implement-form',
  templateUrl: './rejected-report-implement-form.component.html',
  styleUrls: ['./rejected-report-implement.scss'],
})
export class RejectedReportImplementFormComponent
  extends BasePage
  implements OnInit
{
  showComments: boolean = true;
  showOrderservice: boolean = true;
  rejectedJustification: boolean = false;
  aprobateService: boolean = false;
  commentsForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.commentsForm = this.fb.group({
      observations: ['Ninguna'],
      note: ['Ninguna nota'],
      CommentRejected: ['Validar procesos'],
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
        }
      },
    };

    const showReport = this.modalService.show(
      ShowSignatureProgrammingComponent,
      config
    );
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

  newService() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-content-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
        }
      },
    };
    const createService = this.modalService.show(
      CreateServiceFormComponent,
      config
    );
  }

  deleteService() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea eliminar el servicio?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Servicio eliminado correctamente', '');
      }
    });
  }
}
