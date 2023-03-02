import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
  showFoli: boolean = true;
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
    private token: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.status.disable();
    this.description.disable();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      justifier: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  loadGood() {
    //2314753
    //5457725
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: response => {
        if (response.status === 'REJ' || response.status === 'ADM') {
          console.log(response);
          this.good = response;
          this.goodServices.good$.emit(this.good);
          this.setGood();
          this.onLoadToast('success', 'Éxitoso', 'Bien cargado correctamente');
        } else {
          this.onLoadToast(
            'error',
            'ERROR',
            `El estatus del bien ${this.numberGood.value} es incorrecto. Los estatus validos son  ADM o REJ.'`
          );
        }
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }

  setGood() {
    this.status.setValue(this.good.status);
    this.description.setValue(this.good.description);
    this.status.disable();
    this.description.disable();
  }

  updateStatus(): any {
    console.log('Cambiando Staus');
    if (this.validDocument()) {
      this.good.status = this.good.status === 'REJ' ? 'ADM' : 'REJ';
      this.goodServices.update(this.good).subscribe({
        next: response => {
          console.log(response);
          this.postHistoryGood();
        },
        error: error => {
          this.onLoadToast('error', 'ERROR', error.error.message);
        },
      });
    }
  }
  changeFoli(event: any) {
    console.log(event);
    this.document = event;
  }
  validDocument(): boolean {
    let valid: boolean = false;
    console.log('entro a Valid');
    if (this.document === undefined) {
      this.onLoadToast(
        'error',
        'ERROR',
        `No puede cambiar el estatus al bien ${this.good.id} porque aun no se ha generado un folio`
      );
      return valid;
    }
    this.documnetServices
      .getByGoodAndScanStatus(this.document.id, this.good.id, 'ESCANEADO')
      .subscribe({
        next: response => {
          console.log(response);
          valid = true;
        },
        error: err => {
          console.log(err);
          this.onLoadToast(
            'error',
            'ERROR',
            `No puede cambiar el estatus al bien ${this.good.id} porque aun no tiene documentos escaneados`
          );
        },
      });
    return valid;
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
        this.onLoadToast(
          'success',
          'Actualizado',
          `El estatus del bien ${this.good.id} se cambio con éxito`
        );
        this.form.reset();
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }
}
