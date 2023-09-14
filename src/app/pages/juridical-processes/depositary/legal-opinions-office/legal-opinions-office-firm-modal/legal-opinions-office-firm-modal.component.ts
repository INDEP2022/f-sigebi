import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-legal-opinions-office-firm-modal',
  templateUrl: './legal-opinions-office-firm-modal.component.html',
  styles: [],
})
export class LegalOpinionsOfficeFirmModalComponent
  extends BasePage
  implements OnInit
{
  fileForm: FormGroup;
  @Input() nameFileDictation: string = ''; // NOMBRE DEL DICTAMEN APARTIR DE LA CLAVE ARMADA
  @Input() natureDocumentDictation: string = ''; // TIPO DE DICTAMEN
  @Input() numberDictation: number = null; // NUMERO DEL DICTAMEN
  @Input() typeDocumentDictation: string = ''; // ESTATUS DEL OFICIO
  @Input() fileDocumentDictation: any = null; // ARCHIVO XML PARA FIRMAR

  hide: boolean = true;
  certiFile: File | null = null;
  keyCertiFile: File | null = null;

  // CER
  @ViewChild('FileInputCert', { static: true })
  cert: ElementRef<HTMLInputElement>;
  // KEY
  @ViewChild('FileInputKey', { static: true })
  keyI: ElementRef<HTMLInputElement>;

  // @ViewChild('FileInputTEST', { static: true })
  // test: ElementRef<HTMLInputElement>;
  // testFile: File | null = null;

  @Output() responseFirm = new EventEmitter<any>();
  @Output() errorFirm = new EventEmitter<boolean>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private msSignatoriesService: SignatoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log(
      this.nameFileDictation,
      this.natureDocumentDictation,
      this.numberDictation,
      this.typeDocumentDictation,
      this.fileDocumentDictation
    );
  }

  initForm() {
    this.fileForm = this.fb.group({
      // test: [null, [Validators.required]],
      certificate: [null, [Validators.required]],
      keycertificate: [null, [Validators.required]],
      secpwd: [null, [Validators.required, Validators.maxLength(40)]],
      signature: [null],
      fileDataBase64: [null],
      DICTAMEN: [this.nameFileDictation],
      NATURALEZ_DOC: [this.natureDocumentDictation],
      NO_DOCUMENTO: [this.numberDictation],
      TIPO_DOCUMENTO: [this.typeDocumentDictation],
    });
  }

  // chargeTEST(event: any) {
  //   let testFile = event.target.files[0];
  //   console.log(testFile);
  //   if (testFile.name.toLocaleLowerCase().includes('.xml')) {
  //     console.log(event.target.files[0]);
  //     event.target.files[0];
  //     this.testFile = testFile;
  //   } else {
  //     this.onLoadToast(
  //       'error',
  //       'No es un archivo con formato valido.',
  //       'Favor de verificar'
  //     );
  //     this.testFile = null;
  //     this.test.nativeElement.value = '';
  //     this.fileForm.get('test').patchValue('');
  //   }
  // }

  chargeCertifications(event: any) {
    let certiToUpload = event.target.files[0];

    if (certiToUpload.name.includes('.cer')) {
      console.log(event.target.files[0]);
      event.target.files[0];
      this.certiFile = certiToUpload;
    } else {
      this.onLoadToast(
        'error',
        'No es un archivo con formato valido.',
        'Favor de verificar'
      );
      this.certiFile = null;
      this.cert.nativeElement.value = '';
      this.fileForm.get('certificate').patchValue('');
    }
  }

  chargeKeyCertifications(event: any) {
    let keyCertiToUpload = event.target.files[0];

    if (keyCertiToUpload.name.includes('.key')) {
      console.log(event.target.files[0]);
      event.target.files[0];
      this.keyCertiFile = keyCertiToUpload;
    } else {
      this.onLoadToast(
        'error',
        'No es un archivo con formato valido.',
        'Favor de verificar'
      );
      this.keyCertiFile = null;
      this.keyI.nativeElement.value = '';
      this.fileForm.get('keycertificate').patchValue('');
    }
  }

  close(closeEmit: boolean = false, data: any = null) {
    if (closeEmit) {
      this.responseFirm.emit(data); // Emmit response
    } else {
      this.errorFirm.emit(true);
    }
    this.modalRef.hide();
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Se va a comenzar el proceso del firmado electrónico.',
      '¿Desea Continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.sendFormAndFilesToFirm();
      }
    });
  }

  sendFormAndFilesToFirm() {
    console.log(this.fileForm);
    const formData = new FormData();
    // formData.append('files', this.testFile);
    formData.append('files', this.fileDocumentDictation);
    formData.append('files', this.certiFile);
    formData.append('files', this.keyCertiFile);
    formData.append('secpwd', this.fileForm.controls['secpwd'].value);
    formData.append('DICTAMEN', this.fileForm.controls['DICTAMEN'].value);
    formData.append(
      'NATURALEZ_DOC',
      this.fileForm.controls['NATURALEZ_DOC'].value
    );
    formData.append(
      'NO_DOCUMENTO',
      this.fileForm.controls['NO_DOCUMENTO'].value
    );
    formData.append(
      'TIPO_DOCUMENTO',
      this.fileForm.controls['TIPO_DOCUMENTO'].value
    );
    this.msSignatoriesService
      .signerServiceForOfficeDictation(formData)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.alertInfo(
            'success',
            'Archivo Firmado',
            'Se Realizó el Proceso de Firmar del Dictamen Correctamente'
            // data.message
          ).then(() => {
            this.fileForm.controls['signature'] = data.signature;
            this.fileForm.controls['fileData'] = data.fileData;
            this.downloadFile(data.fileData, this.nameFileDictation);
            this.close(true, data);
          });
        },
        error: error => {
          console.log(error);
          // this.errorFirm.emit(true);
          this.alert(
            'error',
            'Ocurrió un Error al Firmar el Dictamen ',
            error.error.message
          ),
            console.log('Error en el Firmante', error.error);
        },
      });
  }

  downloadFile(base64: any, fileName: any) {
    const linkSource = `data:application/xml;charset=UTF-8;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName + '.xml';
    downloadLink.target = '_blank';
    downloadLink.click();
    downloadLink.remove();
  }
}
