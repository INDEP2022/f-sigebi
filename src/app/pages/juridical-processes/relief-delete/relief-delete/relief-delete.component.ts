/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-relief-delete',
  templateUrl: './relief-delete.component.html',
  styleUrls: ['./relief-delete.component.scss'],
})
export class ReliefDeleteComponent
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
      noVolante: '',
      noExpediente: '',
      cveDictamen: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }
  btnBorrarDesahogo() {
    console.log('Borrar Desahogo');
  }
}
