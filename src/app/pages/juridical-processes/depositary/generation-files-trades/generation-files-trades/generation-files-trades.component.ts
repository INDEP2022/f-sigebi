/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-generation-files-trades',
  templateUrl: './generation-files-trades.component.html',
  styleUrls: ['./generation-files-trades.component.scss'],
})
export class GenerationFilesTradesComponent
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
      noVolante: ['', [Validators.required]], //*
      noExpediente: '',
      noOficio: '',
      tipoOficio: '',
      estatus: '',
      cveOficio: '', // Campo extenso
      oficioPor: '',
      remitente: '',
      destinatario: '',
      nomPerExt: '', // Campo extenso
    });
  }

  btnGenerarOficio(): any {
    console.log(this.form.value);
  }
}
