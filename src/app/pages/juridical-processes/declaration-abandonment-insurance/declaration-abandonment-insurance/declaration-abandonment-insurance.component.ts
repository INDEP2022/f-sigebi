/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-declaration-abandonment-insurance',
  templateUrl: './declaration-abandonment-insurance.component.html',
  styleUrls: ['./declaration-abandonment-insurance.component.scss'],
})
export class DeclarationAbandonmentInsuranceComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public idBien: string = '';
  public form: FormGroup;

  constructor(private fb: FormBuilder, private activateRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.idBien ? this.idBien : ''],
      descripcion: [''],
      cantidad: [''],
      estatus: ['', [Validators.pattern(STRING_PATTERN)]],
      fechaNotificacion: [''],
      fechaNotificacion2: [''],
      fechaNotificacion3: [''],
      fechaTerminoPeriodo: [''],
      fechaTerminoPeriodo2: [''],
      fechaTerminoPeriodo3: [''],
      declaracionAbandonoSERA: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  public btnRatificacion() {
    console.log('btnRatificacion');
  }
}
