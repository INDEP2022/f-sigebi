/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-document-trade',
  templateUrl: './document-trade.component.html',
})
export class DocumentTradeComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  @Output() formValues = new EventEmitter<any>();
  mode: 'create' | 'update' = 'create';
  public form: FormGroup;

  @Input() set data(value: IOfficialDictation) {
    if (value) {
      this.form.patchValue(value);
      this.mode = 'update';
    } else {
      this.prepareForm();
      this.form.reset();
    }
  }

  constructor(
    private fb: FormBuilder,
    private officialDictationService: OficialDictationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      officialNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      sender: [
        '',
        [Validators.maxLength(15), Validators.pattern(STRING_PATTERN)],
      ],
      city: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(25)],
      ],
      text1: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      text2: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      text2To: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      text3: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      recipient: ['', [Validators.pattern(STRING_PATTERN)]],
      delegacionRecipientNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), , Validators.maxLength(15)],
      ],
      recipientDepartmentNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), , Validators.maxLength(25)],
      ],
      statusOf: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(25)],
      ],
      typeDict: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(15),
        ],
      ],
      recipientEsxt: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      desSenderPa: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(20)],
      ],
      notaryNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      cveChargeRem: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(20)],
      ],
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }

  send() {
    if (this.mode === 'update') {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    console.log(this.form.value);
    this.officialDictationService.create(this.form.value).subscribe({
      next: data => {
        console.log(data);
        this.alert(
          'success',
          'Se ha agregado la información correctamente',
          ''
        );
      },
      error: err => {
        this.onLoadToast(
          'error',
          ' Los Datos Ingresados son Incorrectos.',
          `Por favor de Verificar`
        );
      },
    });
  }

  update() {
    this.officialDictationService.update(this.form.value).subscribe({
      next: data => {
        console.log(data);
        this.alert(
          'success',
          'Se ha agregado la información correctamente',
          ''
        );
      },
      error: err => {
        this.onLoadToast(
          'error',
          ' Los Datos Ingresados son Incorrectos.',
          `Por favor de Verificar`
        );
      },
    });
  }
}
