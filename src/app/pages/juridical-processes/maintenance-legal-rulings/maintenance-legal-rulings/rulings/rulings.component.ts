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
      claveDictaminacion: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      noExpediente: '',
      tipo: '',
      estatusDictaminacion: ['', [Validators.pattern(STRING_PATTERN)]],
      fechaDictaminacion: '',
      usuarioDictamina: ['', [Validators.pattern(STRING_PATTERN)]],
      observaciones: ['', [Validators.pattern(STRING_PATTERN)]],
      noDelegacion: '',
      areaDictamina: ['', [Validators.pattern(STRING_PATTERN)]],
      fechaInstructora: '',
      delito: ['', [Validators.pattern(STRING_PATTERN)]],
      noVolante: '',
      fechaAseguramiento: '',
      fechaResolucion: '',
      fechaNotificaResolucion: '',
      folioUniversal: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      fechaIngreso: '',
      fechaDictaminacionHC: '',
      fechaIngresoHC: '',
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
