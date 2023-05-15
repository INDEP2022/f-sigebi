import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { PhotographyFormComponent } from '../../shared-request/photography-form/photography-form.component';
import { ChargeDocumentsFormComponent } from '../components/charge-documents-form/charge-documents-form.component';
import { EntryOrderFormComponent } from '../components/entry-order-form/entry-order-form.component';
import { FormatReclamationFormComponent } from '../components/format-reclamation-form/format-reclamation-form.component';
import { ReportShowComponent } from '../components/report-show/report-show.component';

@Component({
  selector: 'app-restitution-goods-form',
  templateUrl: './restitution-goods-form.component.html',
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
export class RestitutionGoodsFormComponent extends BasePage implements OnInit {
  showSearchForm: boolean = true;
  form: FormGroup = new FormGroup({});

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      radio: [null],
      check: [false],
      repositionDate: [false],
    });
  }

  send() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea enviar la aprobación de bienes en especie para la programación con folio 54569?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Bienes mandados a aprobación correctamente',
          ''
        );
      }
    });
  }

  save() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea guardar la aprobación de bienes en especie para la programación con folio 54569?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Bienes guardados correctamente', '');
      }
    });
  }

  photographs() {
    const photographs = this.modalService.show(PhotographyFormComponent, {
      class: 'modal-lg modal-content-centered',
      ignoreBackdropClick: true,
    });
  }

  warehouse() {}

  submitApproval() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea enviar los bienes seleccionados a aprobación?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Bienes enviados a aprobación correctamente',
          ''
        );
      }
    });
  }

  formatReclamation() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        this.reportShow();
      },
    };
    const formatReclamation = this.modalService.show(
      FormatReclamationFormComponent,
      config
    );
  }

  reportShow() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        this.chargeDocument();
      },
    };
    const reportShow = this.modalService.show(ReportShowComponent, config);
  }

  numerary() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea restituir numerariamente?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Bienes restituidos correctamente', '');
      }
    });
  }

  chargeDocument() {
    const chargeDocument = this.modalService.show(
      ChargeDocumentsFormComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  entryOrder() {
    const entryOrder = this.modalService.show(EntryOrderFormComponent, {
      class: 'modal-lg modal.dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
