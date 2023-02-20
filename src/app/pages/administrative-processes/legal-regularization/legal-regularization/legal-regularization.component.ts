import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGood } from 'src/app/core/models/ms-good/good';
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
    private readonly documnetServices: DocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
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
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: response => {
        if (response.status === 'REJ' || response.status === 'ADM') {
          this.good = response;
          this.setGood();
          this.onLoadToast('success', 'Éxitoso', 'Bien cargado correctamente');
        } else {
          this.onLoadToast(
            'error',
            'ERROR',
            'El bien no puede ser administrado en esta pantalla'
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
    /* if(this.good.) */
  }
  changeFoli(event: string | number) {
    console.log(event);
  }
  validDocument() {
    /* this.documnetServices */
  }
}
