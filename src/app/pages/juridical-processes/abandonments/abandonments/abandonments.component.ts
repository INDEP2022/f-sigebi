/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-abandonments',
  templateUrl: './abandonments.component.html',
  styleUrls: ['./abandonments.component.scss'],
})
export class AbandonmentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
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
      noBien: '',
      descripcion: '',
      cantidad: '',
      estatus: '',
      clasificacion: ['', [Validators.pattern(STRING_PATTERN)]],
      destino: '',
      unidad: '',
    });
  }

  btnAplicaAbandono() {
    console.log('Aplica Abandono');
  }
}
