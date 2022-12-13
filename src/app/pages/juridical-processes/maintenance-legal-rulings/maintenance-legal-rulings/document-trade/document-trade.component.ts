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
      noDictaminacion: '',
      remitente: ['', [Validators.pattern(STRING_PATTERN)]],
      ciudad: ['', [Validators.pattern(STRING_PATTERN)]],
      parrafoInicial: ['', [Validators.pattern(STRING_PATTERN)]],
      parrafoFinal: ['', [Validators.pattern(STRING_PATTERN)]],
      masInformacion1: ['', [Validators.pattern(STRING_PATTERN)]],
      masInformacion3: ['', [Validators.pattern(STRING_PATTERN)]],
      destinatario: ['', [Validators.pattern(STRING_PATTERN)]],
      noDelegacionDestinatario: '',
      noDepartamentoDestinatario: '',
      estatus: ['', [Validators.pattern(STRING_PATTERN)]],
      tipoDictaminacion: ['', [Validators.pattern(STRING_PATTERN)]],
      destinatarioESXT: ['', [Validators.pattern(STRING_PATTERN)]],
      destinatarioRemitente: ['', [Validators.pattern(STRING_PATTERN)]],
      noNotario: '',
      claveCargo: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
