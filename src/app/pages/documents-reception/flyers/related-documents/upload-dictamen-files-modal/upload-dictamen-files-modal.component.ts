import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ProcessgoodreportService } from 'src/app/core/services/ms-processgoodreport/ms-processgoodreport.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFC_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-upload-dictamen-files-modal',
  templateUrl: './upload-dictamen-files-modal.component.html',
  styles: [],
})
export class UploadDictamenFilesModalComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('FileInputCert', { static: true })
  cert: ElementRef<HTMLInputElement>;
  @ViewChild('FileInputKey', { static: true })
  keyI: ElementRef<HTMLInputElement>;
  fileForm: ModelForm<ISignatories>;
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

  /* injections */
  private modalRef = inject(BsModalRef);
  private fb = inject(FormBuilder);
  private processGoodReport = inject(ProcessgoodreportService);
  private authService = inject(AuthService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initForm();
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
    /*if (this.signatories != null) {
      this.edit = true;
      this.fileForm.controls['name'].setValue(this.signatories.name);
      this.fileForm.controls['post'].setValue(this.signatories.post);
      this.fileForm.controls['signature'].setValue(this.signatories.signature);
      //this.fileForm.patchValue(this.signatories); //Llenar todo el formulario
    }

    this.passForm = this.fb.group({
      cadena: [this.fileForm.controls['pass'].value],
    });*/
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
    const params = new ListParams();
    const user = this.authService.decodeToken();
    params['nombreReporte'] = 'RGENADBDICTAMASIV.jasper';
    params['nombreReporte'] = user.username;
    params['PDEPARTAMENTO'] = user.delegacionreg;
    params['PDEPARTAMENTO'] = user.delegacionreg;

    this.processGoodReport.getReportXMLToFirm(params).subscribe({});
  }
}
