import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-legal-regularization',
  templateUrl: './legal-regularization.component.html',
  styles: [],
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
      this.redicrectScan = true;
      this.numberFoli = parseInt(JSON.parse(numberFoli), 10);
      this.loadGood();
    }
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

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
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  loadGood() {
    //2314753
    //5457725
    console.log('XXXXXXXXXXXXXXXXX');
    if (this.numberGood.value === null || this.numberGood.value === '') {
      this.alert('warning', 'Regularización jurídica', 'Ingrese No. de Bien');
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
              this.alert(
                'success',
                'Regularización jurídica',
                'Bien cargado correctamente'
              );
            }
          } else {
            this.alert(
              'warning',
              'Regularización jurídica',
              `El expediente ${response.data[0].fileNumber} que esta asociado a este bien no existe.`
            );
          }
        } else {
          if (!this.redicrectScan) {
            this.alert(
              'warning',
              'Regularización jurídica',
              `El estatus del bien ${this.numberGood.value} es incorrecto. Los estatus validos son  ADM o REJ.`
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
    console.log('Cambiando Staus');
    if (
      this.numberFoli === undefined ||
      this.numberFoli === null ||
      this.numberFoli === ''
    ) {
      this.alert(
        'warning',
        'Regularización jurídica',
        `No puede cambiar el estatus al bien ${this.good.id} porque aun no se ha generado un folio`
      );
      return;
    }
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
          this.alert('error', 'Ha ocurrido un error', error.error.message);
        },
      });
    }
  }
  changeFoli(event: any) {
    console.log(event);
    this.document = event;
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
            res(valid);
            this.alert(
              'warning',
              'Regularización jurídica',
              `No puede cambiar el estatus al bien ${this.good.id} porque aun no tiene documentos escaneados`
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
          'Regularización jurídica',
          `Justificación de la Regularización jurídica del bien ${this.good.id} actualizada con éxito.`
        );
        this.clean();
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  clean() {
    this.form.reset();
    this.numberFoli = null;
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
}
