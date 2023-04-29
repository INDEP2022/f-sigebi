import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
      presentationPlace: [null, [Validators.pattern(STRING_PATTERN)]],
      testerName: [null, [Validators.pattern(STRING_PATTERN)]],
      renderingProcess: [null, [Validators.pattern(STRING_PATTERN)]],
      descriptionService: [null, [Validators.pattern(STRING_PATTERN)]],
      regionalRepresent: [null, [Validators.pattern(STRING_PATTERN)]],
      dateRepresentRep: [null],
      dateNotification: [null],
      dateElaboration: [null],
      descriptionCumpliment: [null, [Validators.pattern(STRING_PATTERN)]],
      nameSignerSae: [null, [Validators.pattern(STRING_PATTERN)]],
      chargeSae: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea crear el anexo W'
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
