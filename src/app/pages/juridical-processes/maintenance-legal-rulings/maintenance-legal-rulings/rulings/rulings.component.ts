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
  selector: 'app-rulings',
  templateUrl: './rulings.component.html',
})
export class RulingsComponent extends BasePage implements OnInit, OnDestroy {
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
      claveDictaminacion: '',
      noExpediente: '',
      tipo: '',
      estatusDictaminacion: '',
      fechaDictaminacion: '',
      usuarioDictamina: '',
      observaciones: '',
      noDelegacion: '',
      areaDictamina: '',
      fechaInstructora: '',
      delito: '',
      noVolante: '',
      fechaAseguramiento: '',
      fechaResolucion: '',
      fechaNotificaResolucion: '',
      folioUniversal: '',
      fechaIngreso: '',
      fechaDictaminacionHC: '',
      fechaIngresoHC: '',
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
