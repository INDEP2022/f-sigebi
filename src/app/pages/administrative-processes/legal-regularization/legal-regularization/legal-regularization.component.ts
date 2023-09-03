import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ScanningFoilComponent } from '../scanning-foil/scanning-foil.component';

@Component({
  selector: 'app-legal-regularization',
  templateUrl: './legal-regularization.component.html',
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LegalRegularizationComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;
  good: IGood;
  document: IDocuments;
  nameReport: string = 'RGERGENSOLICDIGIT';
  cveScreen: string = 'FREGULARIZAJUR';
  folioEscaneo = 'folioEscaneo';
  numberFile: string | number = '';
  numberFoli: string | number = '';
  redicrectScan: boolean = false;
  viewFol: boolean = true;
  refresh: boolean = false;
  disableButton: boolean = true;
  loadingBtn: boolean = false;
  get numberGood() {
    return this.form.get('numberGood');
  }
  get status() {
    return this.form.get('status');
  }
  get description() {
    return this.form.get('description');
  }
  get justifier() {
    return this.form.get('justifier');
  }
  @ViewChild('hijoRef', { static: false }) hijoRef: ScanningFoilComponent;
  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private readonly historyGoodService: HistoryGoodService,
    private readonly documnetServices: DocumentsService,
    private token: AuthService,
    private readonly expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.status.disable();
    this.description.disable();
    const objetoString = localStorage.getItem('documentLegal');
    const numberFoli = localStorage.getItem('numberFoli');
    const savedForm = localStorage.getItem('savedForm');
    if (savedForm) {
      const change: any = JSON.parse(savedForm);
      this.form.patchValue(change);
      this.document = JSON.parse(objetoString);
      this.numberFoli = parseInt(JSON.parse(numberFoli), 10);
      setTimeout(() => {
        this.insertDocument(this.document);
        this.insertFolio(this.numberFoli);
      }, 1500);
      this.redicrectScan = true;

      this.loadGood();
    }
    // this.justifier.valueChanges.subscribe(data => {
    //   console.log(data);
    //   if (data) {
    //     if (data.length > 0 && this.good) {
    //       this.disableButton = false;
    //     } else {
    //       this.disableButton = true;
    //     }
    //   }
    // });
  }

  private buildForm() {
    this.form = this.fb.group({
      numberGood: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      justifier: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.min(1)],
      ],
    });
  }

  loadGood() {
    //2314753
    //5457725
    console.log('XXXXXXXXXXXXXXXXX');
    if (this.numberGood.value === null || this.numberGood.value === '') {
      this.alert('warning', 'Ingrese No. de Bien', '');
      return;
    }
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: async (response: any) => {
        console.log(response.data[0]);
        if (
          response.data[0].status === 'REJ' ||
          response.data[0].status === 'ADM'
        ) {
          const valid: boolean = await this.validExpedient(
            response.data[0].fileNumber
          );
          if (valid) {
            this.good = response.data[0];
            this.goodServices.good$.emit(this.good);
            this.numberFile = this.good.fileNumber;
            this.setGood();
            if (!this.redicrectScan) {
              this.alert('success', 'Bien Cargado Correctamente', '');
            }
            this.form
              .get('justifier')
              .setValidators([
                Validators.required,
                Validators.pattern(STRING_PATTERN),
                Validators.min(1),
              ]);
            //this.form.get('justifier').updateValueAndValidity();
          } else {
            this.alert(
              'warning',
              'Atención',
              `El expediente ${response.data[0].fileNumber} que está asociado a este Bien no existe.`
            );
          }
        } else {
          if (!this.redicrectScan) {
            this.alert(
              'warning',
              'Atención',
              `El estatus del Bien ${this.numberGood.value} es incorrecto. Los estatus válidos son ADM o REJ.`
            );
          }
        }
      },
      error: err => {
        console.log(err);
        this.alert('error', 'Ha ocurrido un error', err.error.message);
      },
    });
  }

  setGood() {
    this.status.setValue(this.good.status);
    this.description.setValue(this.good.description);
    this.status.disable();
    this.description.disable();
  }

  async updateStatus() {
    console.log('Cambiando Staus' + this.numberFoli);
    console.log(this.numberFoli);

    if (
      this.numberFoli === undefined ||
      this.numberFoli === null ||
      this.numberFoli === ''
    ) {
      this.alert(
        'warning',
        'Atención',
        `No puede cambiar el estatus al Bien ${this.good.id} porque aún no se ha generado un folio`
      );
      return;
    }
    this.loadingBtn = true;
    const res = await this.validDocument();
    console.log(res);
    if (res) {
      this.good.status = this.good.status === 'REJ' ? 'ADM' : 'REJ';
      const good: IGood = {
        id: Number(this.good.id),
        goodId: Number(this.good.id),
        status: this.good.status,
      };
      this.goodServices.update(good).subscribe({
        next: response => {
          console.log(response);
          this.postHistoryGood();
        },
        error: error => {
          this.loadingBtn = false;
          this.alert('error', 'Ha ocurrido un error', error.error.message);
        },
      });
    }
  }
  changeFoli(event: any) {
    console.log('aaa', event);
    this.document = event;
    console.log(event.id);
    this.numberFoli = event.id;
  }
  validDocument() {
    return new Promise<boolean>((res, _rej) => {
      let valid: boolean = false;
      console.log('entro a Valid');
      this.documnetServices
        .getByGoodAndScanStatus(this.numberFoli, this.good.id, 'ESCANEADO')
        .subscribe({
          next: response => {
            console.log(response);
            valid = true;
            res(valid);
          },
          error: err => {
            console.log(err);
            this.loadingBtn = false;
            res(valid);
            this.alert(
              'warning',
              'Atención',
              `No puede cambiar el estatus al Bien ${this.good.id} por que aún no tiene documentos escaneados`
            );
          },
        });
    });
  }

  postHistoryGood() {
    const historyGood: IHistoryGood = {
      propertyNum: this.numberGood.value,
      status: this.good.status,
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'FREGULARIZAJUR',
      reasonForChange: this.justifier.value,
      registryNum: null,
      extDomProcess: this.good.extDomProcess,
    };

    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        this.alert(
          'success',
          'Actualizado',
          `La Justificación de la Regularización Jurídica del Bien ${this.good.id} se actualizó`
        );
        //this.clean();
        this.loadingBtn = false;
        this.loadGood();
      },
      error: error => {
        console.log(error);
        this.loadingBtn = false;
        this.loading = false;
      },
    });
  }

  clean() {
    this.justifier.clearValidators();
    this.justifier.setValidators(Validators.pattern(STRING_PATTERN));
    this.justifier.updateValueAndValidity();
    this.form.reset();
    this.numberFoli = null;
    this.document = undefined;
    this.cambiarValor();
    this.insertFolio('');
    localStorage.removeItem('savedForm');
    localStorage.removeItem('documentLegal');
    localStorage.removeItem('numberFoli');
    this.refresh = true;
  }

  savedLocal(event: any) {
    console.log(event);
    const model = {
      numberGood: this.numberGood.value,
      status: this.status.value,
      description: this.description.value,
      justifier: this.justifier.value,
    };
    localStorage.setItem('savedForm', JSON.stringify(model));
    localStorage.setItem(
      'numberFoli',
      JSON.stringify(
        this.numberFoli === '' || this.numberFoli === null
          ? this.document.id
          : this.numberFoli
      )
    );
  }

  validExpedient(fileNumber: number | string) {
    return new Promise<boolean>((res, rej) => {
      this.expedientService.getById(fileNumber).subscribe({
        next: resp => res(true),
        error: err => res(false),
      });
    });
  }

  cleanDocument() {
    const nullDocument: any = {
      id: null,
      natureDocument: null,
      descriptionDocument: null,
      significantDate: null,
      scanStatus: null,
      fileStatus: null,
      userRequestsScan: null,
      scanRequestDate: null,
      userRegistersScan: null,
      dateRegistrationScan: null,
      userReceivesFile: null,
      dateReceivesFile: null,
      keyTypeDocument: null,
      keySeparator: null,
      numberProceedings: null,
      sheets: null,
      numberDelegationRequested: null,
      numberSubdelegationRequests: null,
      numberDepartmentRequest: null,
      registrationNumber: null,
      flyerNumber: null,
      userSend: null,
      areaSends: null,
      sendDate: null,
      sendFilekey: null,
      userResponsibleFile: null,
      mediumId: null,
      associateUniversalFolio: null,
      dateRegistrationScanningHc: null,
      dateRequestScanningHc: null,
      goodNumber: null,
    };
    return nullDocument;
  }

  cambiarValor() {
    this.hijoRef.cleanDocumentFolio(this.cleanDocument());
  }

  insertDocument(documentFolio: any) {
    this.hijoRef.inserDocumentFolio(documentFolio);
  }
  insertFolio(folio: any) {
    this.hijoRef.setFolio(folio);
  }
}
