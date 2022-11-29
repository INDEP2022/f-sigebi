import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { ShowProgrammingComponent } from '../show-programming/show-programming.component';
import { UploadFilesFormComponent } from '../upload-files-form/upload-files-form.component';

@Component({
  selector: 'app-sign-report',
  templateUrl: './sign-report.component.html',
  styles: [],
})
export class SignReportComponent extends BasePage implements OnInit {
  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false };
  }

  ngOnInit(): void {}

  send() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro que deseas mandar el documento a firmar?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento enviado correctamente', '');
      }
    });
  }

  upload() {
    const uploadFile = this.modalService.show(UploadFilesFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  next() {
    /*this.modalRef.content.callback(true);
    this.modalRef.hide();*/
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          //this.electronicSign();
        }
      },
    };
    const showProg = this.modalService.show(ShowProgrammingComponent, config);
  }

  close() {
    this.modalRef.hide();
  }
}
