import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-upload-electronic-signature',
  templateUrl: './upload-electronic-signature.component.html',
  styles: [],
})
export class UploadElectronicSignatureComponent
  extends BasePage
  implements OnInit
{
  uploadFileForm: FormGroup = new FormGroup({});

  status: string = 'Captura';
  edit: boolean = false;
  signatory: any;

  @Output() newSignatory = new EventEmitter<{}>();

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
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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

    if (this.edit) {
      this.status = 'Actualizar';
      //this.uploadFileForm.patchValue(this.signatory);
    }
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro de guardar los archivos?'
    )
      .then(question => {
        if (question.isConfirmed) {
          //Ejecutar el servicio
          this.onLoadToast('success', 'Clave de Firma Agregada', '');
          this.create();
        } else {
          this.close();
        }
      })
      .catch(() => {
        this.close();
      });
  }

  create() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    /**
     * CALL SERVICE SAVESIGNATORY
     * */
    let signatory = this.uploadFileForm.value;
    this.loading = false;
    this.newSignatory.emit(signatory);
    this.modalRef.hide();
  }

  close() {
    this.loading = false;
    this.newSignatory.emit(false);
    this.modalRef.hide();
  }
}
