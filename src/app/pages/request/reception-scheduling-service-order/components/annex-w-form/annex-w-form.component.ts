import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';

@Component({
  selector: 'app-annex-w-form',
  templateUrl: './annex-w-form.component.html',
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
export class AnnexWFormComponent extends BasePage implements OnInit {
  showInformationW: boolean = true;
  showSigner: boolean = true;
  form: FormGroup = new FormGroup({});
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      presentationDate: [null],
      presentationPlace: [null],
      testerName: [null],
      renderingProcess: [null],
      descriptionService: [null],
      regionalRepresent: [null],
      dateRepresentRep: [null],
      dateNotification: [null],
      dateElaboration: [null],
      descriptionCumpliment: [null],
      nameSignerSae: [null],
      chargeSae: [null],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas crear el anexo W'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Anexo W creado correctamente', '');
        this.modalRef.content.callback(this.form.value);
        this.close();
        this.ShowReport();
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

  close() {
    this.modalRef.hide();
  }
}
