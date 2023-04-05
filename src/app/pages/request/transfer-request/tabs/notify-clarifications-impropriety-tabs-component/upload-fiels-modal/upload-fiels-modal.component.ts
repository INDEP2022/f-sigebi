import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IExternalFirm } from 'src/app/core/models/ms-externalfirm/external-firm';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { ExternalFirmService } from 'src/app/core/services/ms-externalfirm/externalfirm.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFCCURP_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-upload-fiels-modal',
  templateUrl: './upload-fiels-modal.component.html',
  styles: [],
})
export class UploadFielsModalComponent extends BasePage implements OnInit {
  signatories: ISignatories;
  password: IExternalFirm;
  data: any = {};
  fileForm: ModelForm<ISignatories>;
  passForm: ModelForm<any>;
  hide = true;
  certiFile: File | null = null;
  keyCertiFile: File | null = null;
  typeReport: string = null;
  isRFCHided: boolean = true;
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private http: HttpClient,
    private signatoriesService: SignatoriesService,
    private externalFirmService: ExternalFirmService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.setRFCInput();
  }

  initForm() {
    this.fileForm = this.fb.group({
      learnedType: [null],
      learnedId: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      post: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      certificate: [null, [Validators.required]],
      keycertificate: [null, [Validators.required]],
      pass: [null, [Validators.required]],
      rfcUser: [
        null,
        [
          Validators.required,
          Validators.pattern(RFCCURP_PATTERN),
          Validators.maxLength(13),
        ],
      ],
      signatoryId: [null],
    });
    if (this.signatories != null) {
      this.edit = true;
      this.fileForm.patchValue(this.signatories);
    }

    this.passForm = this.fb.group({
      cadena: [this.fileForm.controls['pass'].value],
    });
  }

  setRFCInput(): void {
    //typeReport === 'annexK' || typeReport === 'annexJ'
    if (
      this.typeReport === 'annexJ-assets-classification' ||
      this.typeReport === 'annexK-assets-classification'
    ) {
      this.isRFCHided = false;
    } else if (
      this.typeReport === 'annexJ-verify-noncompliance' ||
      this.typeReport === 'annexJ-verify-noncompliance'
    ) {
      this.isRFCHided = false;
    }
  }

  chargeCertifications(event: any) {
    let certiToUpload = event.target.files[0];
    this.certiFile = certiToUpload;
    console.log('certificado: ', this.certiFile);
  }

  chargeKeyCertifications(event: any) {
    let keyCertiToUpload = event.target.files[0];
    this.keyCertiFile = keyCertiToUpload;
    console.log('Key: ', this.keyCertiFile);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let pass = this.fileForm.controls['pass'].value;

    if (pass.length <= 10) {
      console.log(
        'pass: ' + pass + ' Longitud de pass es correcto, proceder a encriptar'
      ); //Quitar

      this.externalFirmService.encrypt(this.passForm.value).subscribe(
        response => {
          if (response !== null) {
            this.password = response;
            console.log('Pass encriptada', this.password.encriptarResult); //Quitar
            this.fileForm.controls['pass'].setValue(
              this.password.encriptarResult
            );
            console.log('Carga de archivos', this.fileForm.value);
            this.update();
          } else {
            //TODO: CHECK MESSAGE
            this.alert('info', 'No se pudo encriptar', null);
          }

          this.loading = false;
        },
        error => (this.loading = false)
      );
    } else {
      this.update();
    }

    this.close();
  }

  update() {
    const formData = new FormData();
    formData.append('learnedType', this.signatories.learnedType);
    formData.append('signatoryId', String(this.signatories.signatoryId));
    formData.append('certificate', this.certiFile);
    formData.append('keycertificate', this.keyCertiFile);
    formData.append('learnedId', this.signatories.learnedId);
    formData.append('name', this.signatories.name);
    console.log('FormData', formData);

    const idSingnatorie = this.signatories.signatoryId;
    this.signatoriesService.update(idSingnatorie, formData).subscribe(
      data => this.handleSuccess(),
      error => this.alert('info', 'No se pudo actualizar', error.data)
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast(
      'success',
      'Carga de archivos',
      `${message} Correctamente`
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
