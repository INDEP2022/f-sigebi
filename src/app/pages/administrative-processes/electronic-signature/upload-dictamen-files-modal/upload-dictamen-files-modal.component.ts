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
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-upload-dictamen-electronic-modal',
  templateUrl: './upload-dictamen-files-modal.component.html',
  styles: [],
})
export class UploadDictamenElectronicModalComponent
  extends BasePage
  implements OnInit
{
  fileForm: FormGroup;
  @Input() nameFileDictation: string = ''; // NOMBRE DEL DICTAMEN APARTIR DE LA CLAVE ARMADA
  @Input() fileDocumentDictation: any = null; // ARCHIVO XML PARA FIRMAR
  @Input() nameReportDictation: any = null; // NOMBRE DEL REPORTE PARA CARGAR PARAMETROS
  @Input() reportParamsDictation: any = null; // PARAMETROS PARA EL REPORTE
  @Input() natureDocumentDictation: string = ''; // TIPO DE DICTAMEN
  @Input() numberDictation: string = null; // NUMERO DEL DICTAMEN
  @Input() typeDocumentDictation: string = ''; // ESTATUS DEL OFICIO
  @Input() dictamenNumber: number = 0; // Dictamen número
  @Input() sender: string = ''; // Quien elabora
  @Input() typeruling: string = ''; //departamento
  @Input() armedtradekey: string = ''; //clave armada

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
    private msSignatoriesService: SignatoriesService,
    private sanitizer: DomSanitizer,
    private siabService: SiabService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log('no Dictamen', this.dictamenNumber);
    console.log('no crea', this.sender);
    console.log('no deparment', this.typeruling);
    console.log('Clave armanda', this.armedtradekey);
  }

  initForm() {
    this.fileForm = this.fb.group({
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
    // Recorrer los parametros
    for (const key in this.reportParamsDictation) {
      if (
        Object.prototype.hasOwnProperty.call(this.reportParamsDictation, key)
      ) {
        const element = this.reportParamsDictation;
        if (key) {
          this.fileForm.addControl(key, element);
        }
      }
    }
  }

  chargeCertifications(event: any) {
    let certiToUpload = event.target.files[0];

    if (certiToUpload.name.includes('.cer')) {
      console.log(event.target.files[0]);
      event.target.files[0];
      this.certiFile = certiToUpload;
    } else {
      this.alert(
        'error',
        'Ha ocurrido un error',
        'No es un archivo con formato valido. Favor de verificar',
        ''
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
      this.alert(
        'error',
        'Ha ocurrido un error',
        'No es un archivo con formato valido. Favor de verificar',
        ''
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
    // if (this.reportParamsDictation) {
    //   // Recorrer los parametros
    //   for (const key in this.reportParamsDictation) {
    //     if (
    //       Object.prototype.hasOwnProperty.call(this.reportParamsDictation, key)
    //     ) {
    //       const element = this.reportParamsDictation;
    //       if (key) {
    //         // this.fileForm.addControl(key, element);
    //         formData.append(key, element);
    //       }
    //     }
    //   }
    // } //GUARDAR LA FIRMA EN LA TABLA CORRESPONDIENTE
    console.log('formData: ', formData);
    this.msSignatoriesService
      .signerServiceForOfficeDictation(formData)
      .subscribe({
        next: (data: any) => {
          console.log(
            'respuestamsSignatoriesService.signerServiceForOfficeDictation',
            data
          );
          this.alertInfo(
            'success',
            'Se realizó el proceso de firmar el dictamen correctamente',
            'Archivo firmado correctamente'
          ).then(() => {
            this.fileForm.controls['signature'] = data.signature;
            this.fileForm.controls['fileData'] = data.fileData;
            this.downloadFile(data.fileData, this.nameFileDictation);

            //Convertir base64 a xml
            this.converterToXml(data, formData);
          });
        },
        error: error => {
          console.log(error);
          this.alert(
            'error',
            'Ocurrió un erro al Firmar el Dictamen ',
            error.message
          );
        },
      });
  }

  xmlData: string = '';

  converterToXml(data: any, formData: any) {
    console.log('base64 del xml', data.fileData);
    const binaryData = atob(data.fileData);

    // Convertir datos binarios a cadena de texto
    const textData = new TextDecoder().decode(
      new Uint8Array([...binaryData].map(char => char.charCodeAt(0)))
    );

    // Parsear cadena de texto como XML
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(textData, 'application/xml');

    // Serializar el objeto XML nuevamente a cadena de texto
    const serializer = new XMLSerializer();
    this.xmlData = serializer.serializeToString(xmlDocument);
    console.log('XML Convertido', this.xmlData);

    // Esto es opcional, pero se puede utilizar para mostrar el contenido XML en un iframe seguro
    //this.sanitizedXmlData = this.sanitizer.bypassSecurityTrustResourceUrl(`data:text/xml;charset=utf-8,${encodeURIComponent(this.xmlData)}`);
    this.createElectdoc(data, this.xmlData, formData);
  }

  createElectdoc(data: any, xml: string, formData: any) {
    console.log('Para mandar a crear: ', data);
    console.log('XML: ', xml);

    const obj: object = {
      natureDocument: 'PROCEDENCIA',
      documentNumber: this.dictamenNumber,
      documentType: this.fileForm.controls['TIPO_DOCUMENTO'].value,
      xml: null,
      signature: data.signature,
      recordNumber: null,
      nbOrigin: null,
    };

    console.log('Objeto que se enviará: ', obj);

    this.msSignatoriesService.ssf3FirmaEelecDocs(obj).subscribe({
      next: resp => {
        console.log('Se creo el registro: ', resp);

        this.callReport();
        this.close(true);
      },
      error: error => {
        console.log('Error: ', error);
      },
    });
  }

  loadingText: string = 'Reporte';
  //loading: boolean = false;
  callReport() {
    let params: any = {
      // PARAMFORM: 'NO',
      PELABORO_DICTA: this.sender, // PENDIENTE DE RESOLVER
      PDEPARTAMENTO: 'PROCEDENCIAS',
      POFICIO: this.dictamenNumber,
      PDICTAMEN: 'PROCEDENCIA',
      PESTADODICT: this.typeDocumentDictation,
    };

    this.siabService.fetchReport('RGENADBDICTAMASIV', params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
    this.onLoadToast('success', 'Reporte Generado', '');
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
