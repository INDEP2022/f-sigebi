/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
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
      remitente: '',
      ciudad: '',
      parrafoInicial: '',
      parrafoFinal: '',
      masInformacion1: '',
      masInformacion3: '',
      destinatario: '',
      noDelegacionDestinatario: '',
      noDepartamentoDestinatario: '',
      estatus: '',
      tipoDictaminacion: '',
      destinatarioESXT: '',
      destinatarioRemitente: '',
      noNotario: '',
      claveCargo: '',
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
