import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-upload-files-form',
  templateUrl: './upload-files-form.component.html',
  styles: [],
})
export class UploadFilesFormComponent extends BasePage implements OnInit {
  uploadFileForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.uploadFileForm = this.fb.group({
      name: ['David Baez', [Validators.pattern(STRING_PATTERN)]],
      charge: ['Delegado', [Validators.pattern(STRING_PATTERN)]],
      password: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      rfc: [null, [Validators.required, Validators.pattern(RFC_PATTERN)]],
      certificate: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      keyCertificate: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro de guardar los archivos?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Firma cargada correctamente', '');
        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
