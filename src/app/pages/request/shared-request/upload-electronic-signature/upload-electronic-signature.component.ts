import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

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
      name: [null, [Validators.required]],
      charge: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      certificate: [null, [Validators.required]],
      keyCertificate: [null, [Validators.required]],
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
      '¿Estas seguro de guardar los archivos?'
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
