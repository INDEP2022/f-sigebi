import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IExternalFirm } from 'src/app/core/models/ms-externalfirm/external-firm';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { ExternalFirmService } from 'src/app/core/services/ms-externalfirm/externalfirm.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFC_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

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
  base64Cer: string;
  base64Key: string;
  encrypResult: string;
  idReportAclara: any;

  @ViewChild('FileInputCert', { static: true })
  cert: ElementRef<HTMLInputElement>;
  @ViewChild('FileInputKey', { static: true })
  keyI: ElementRef<HTMLInputElement>;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    //private http: HttpClient,
    private signatoriesService: SignatoriesService,
    private externalFirmService: ExternalFirmService //private encrypService: EncrypService
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
      pass: [null, [Validators.required, Validators.maxLength(10)]],
      rfcUser: [
        null,
        [
          Validators.required,
          Validators.pattern(RFC_PATTERN),
          Validators.maxLength(13),
        ],
      ],
      signatoryId: [null],
      signature: [null],
    });
    if (this.signatories != null) {
      this.edit = true;
      this.fileForm.controls['name'].setValue(this.signatories.name);
      this.fileForm.controls['post'].setValue(this.signatories.post);
      this.fileForm.controls['signature'].setValue(this.signatories.signature);
      //this.fileForm.patchValue(this.signatories); //Llenar todo el formulario
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

    if (certiToUpload.name.includes('.cer')) {
      this.loader.load = true;
      //Convierte archivo seleccionado a base 64 y lo guarda
      this.convertFile(event.target.files[0]).subscribe({
        next: base64 => {
          this.base64Cer = base64;
          this.loader.load = false;
        },
        error: () => {
          this.loader.load = false;
        },
      });
    } else {
      this.onLoadToast(
        'error',
        'No es un archivo con formato valido.',
        'Favor de verificar'
      );
      this.cert.nativeElement.value = '';
      this.fileForm.get('certificate').patchValue('');
    }
  }

  chargeKeyCertifications(event: any) {
    let keyCertiToUpload = event.target.files[0];
    this.keyCertiFile = keyCertiToUpload;
    if (keyCertiToUpload.name.includes('.key')) {
      this.loader.load = true;
      //Convierte archivo seleccionado a base 64 y lo guarda
      this.convertFile(event.target.files[0]).subscribe({
        next: base64 => {
          this.base64Key = base64;
          this.loader.load = false;
        },
        error: () => {
          this.loader.load = false;
        },
      });
    } else {
      this.onLoadToast(
        'error',
        'No es un archivo con formato valido.',
        'Favor de verificar'
      );
      this.keyI.nativeElement.value = '';
      this.fileForm.get('keycertificate').patchValue('');
    }
  }

  //Convierte archivo a base64
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = event => result.next(btoa(event.target.result.toString()));
    return result;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let pass = this.fileForm.controls['pass'].value;

    if (pass.length <= 10) {
      console.log(
        'pass: ' + pass + ' Longitud de pass es correcto, proceder a encriptar'
      );
      const obj: Object = {
        cadena: pass,
      };

      this.externalFirmService.encrypt(obj).subscribe(
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
    formData.append(
      'pass',
      this.password.encriptarResult || this.fileForm.controls['pass'].value
    );
    //formData.append('pass', this.encrypResult);
    formData.append('post', this.fileForm.controls['post'].value);
    formData.append('rfcUser', this.fileForm.controls['rfcUser'].value);
    formData.append('validationocsp', 'true');
    formData.append('identifierSystem', '1');
    formData.append('identifierSignatory', '1');
    //formData.append('certificatebase64', this.base64Cer); La conversión ya lo hace el endpoint
    console.log('FormData que se envia para guardar firmante', formData);

    this.signatoriesService
      .update(this.signatories.signatoryId, formData)
      .subscribe(
        data => this.handleSuccess(),
        error => (
          this.alert('info', 'No se pudo actualizar', error.error),
          console.log('No se actualizó el firmante', error.error)
        )
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
