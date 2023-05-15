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
      officialNumber: [null, Validators.required],
      sender: ['', [Validators.pattern(STRING_PATTERN)]],
      city: ['', [Validators.pattern(STRING_PATTERN)]],
      text1: ['', [Validators.pattern(STRING_PATTERN)]],
      text2: ['', [Validators.pattern(STRING_PATTERN)]],
      text2To: ['', [Validators.pattern(STRING_PATTERN)]],
      text3: ['', [Validators.pattern(STRING_PATTERN)]],
      recipient: ['', [Validators.pattern(STRING_PATTERN)]],
      delegacionRecipientNumber: '',
      recipientDepartmentNumber: '',
      statusOf: ['', [Validators.pattern(STRING_PATTERN)]],
      typeDict: ['', [Validators.pattern(STRING_PATTERN), Validators.required]],
      recipientEsxt: ['', [Validators.pattern(STRING_PATTERN)]],
      desSenderPa: ['', [Validators.pattern(STRING_PATTERN)]],
      notaryNumber: '',
      cveChargeRem: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
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
        this.alert(
          'success',
          'Se ha agregado la información correctamente',
          ''
        );
      },
      error: err => {
        this.alert('error', 'No se ha podido agregar la información', '');
      },
    });
  }

  update() {
    this.officialDictationService.update(this.form.value).subscribe({
      next: data => {
        this.alert(
          'success',
          'Se ha agregado la información correctamente',
          ''
        );
      },
      error: err => {
        this.alert('error', 'No se ha podido agregar la información', '');
      },
    });
  }
}
