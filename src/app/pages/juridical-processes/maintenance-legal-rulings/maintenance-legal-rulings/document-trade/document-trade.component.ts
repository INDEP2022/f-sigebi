/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      officialNumber: '',
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
      typeDict: ['', [Validators.pattern(STRING_PATTERN)]],
      recipientEsxt: ['', [Validators.pattern(STRING_PATTERN)]],
      desSenderPa: ['', [Validators.pattern(STRING_PATTERN)]],
      notaryNumber: '',
      cveChargeRem: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
