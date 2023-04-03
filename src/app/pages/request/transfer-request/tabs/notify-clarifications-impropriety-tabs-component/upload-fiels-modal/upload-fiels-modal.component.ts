import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  fileForm: FormGroup = new FormGroup({});
  passForm: ModelForm<any>;
  hide = true;
  certiToUpload: File | null = null;
  keyCertiToUpload: File | null = null;
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
      learnedType: null,
      learnedId: null,
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      post: [null, [Validators.pattern(STRING_PATTERN)]],
      certificate: null,
      keycertificate: null,
      pass: [null, []],
      userCreation: null,
      creationDate: null,
      userModification: null,
      modificationDate: null,
      version: null,
      signature: null,
      mistakemsg: ['dummy'], // Forzoso mistakemsg
      boardSignatory: ['dummy'], // Forzoso
      columnSignatory: ['dummy'], // Forzoso
      recordId: ['dummy'], // Forzoso
      certificatebase64: null,
      identifierSystem: null,
      identifierSignatory: null,
      validationocsp: null,
      rfcUser: [
        null,
        [Validators.pattern(RFCCURP_PATTERN), Validators.maxLength(13)],
      ],
      signatoryId: null,
      IDNumber: ['dummy'], // Forzoso
      ID: ['dummy'], // Forzoso
      nbOrigin: ['dummy'], // Forzoso
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
    this.certiToUpload = event.target.files[0];
    console.log(this.certiToUpload);
  }

  chargeKeyCertifications(event: any) {
    this.keyCertiToUpload = event.target.files[0];
    console.log(this.keyCertiToUpload);
  }

  close() {
    this.modalRef.hide();
  }

  encriptar() {
    const url = 'http://wssiab.sae.gob.mx/WsFirmaElectronicades/wsFirma.asmx';
    const xmlData = `<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope">
    <Body>
        <encriptar xmlns="http://tempuri.org/">
            <CadenaEncriptar>SASH970531CU6</CadenaEncriptar>
        </encriptar>
    </Body>
</Envelope>`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Access-Control-Allow-Origin': '*',
    });

    this.http.post(url, xmlData, { headers }).subscribe(
      data => {
        console.log(data);
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    );

    /*
    const xmlData = `<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope">
    <Body>
        <encriptar xmlns="http://tempuri.org/">
            <CadenaEncriptar>SASH970531CU6</CadenaEncriptar>
        </encriptar>
    </Body>
</Envelope>`

      axios({
        method: 'post',
        url: 'http://wssiab.sae.gob.mx/WsFirmaElectronicades/wsFirma.asmx',
        data: xmlData,
        headers: {
          'Content-Type': 'text/xml',
          'Cache-Control': 'no-cache',
          // 'Postman-Token': '<calculated when request is sent>',
          // 'Content-Length': '<calculated when request is sent>',
          // 'Host': '<calculated when request is sent>',
          // 'User-Agent': 'PostmanRuntime/7.31.3',
          'Accept': '*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': 'http://test.indep.gob.mx:4200',
          'SOAPAction' : 'http://tempuri.org/encriptar'
          
        }
      })
      .then((response) => {
        console.log("OK",response.data);
      })
      .catch((error) => {
        console.error("BAD",error);
      }); 
      
      */
  }

  confirm() {
    let pass = this.fileForm.controls['pass'].value;

    if (pass.length <= 10) {
      console.log(
        'pass: ' + pass + ' Longitud de pass es correcto, proceder a encriptar'
      );

      this.externalFirmService.encrypt(this.passForm.value).subscribe(
        response => {
          if (response !== null) {
            this.password = response;
            console.log('Pass encriptada', this.password.encriptarResult);
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

  create() {
    this.signatoriesService.create(this.fileForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    const idSingnatorie = this.signatories.signatoryId;
    this.signatoriesService
      .update(idSingnatorie, this.fileForm.value)
      .subscribe(
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
