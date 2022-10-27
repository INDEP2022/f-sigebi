/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-c-review-resource-report',
  templateUrl: './pj-d-c-review-resource-report.component.html',
  styleUrls: ['./pj-d-c-review-resource-report.component.scss'],
})
export class PJDReviewResourceReportComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;

  constructor(private fb?: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegacion: '', // Delegación Detalle
      subdelegacion: '', // Subdelegación Detalle
      fechaPresentacionRecursoDesde: '',
      fechaPresentacionRecursoHasta: '',
      delBien: '', // Del Bien Detalle
      alBien: '', // Al Bien Detalle
    });
  }

  btnGenerarReporte() {
    console.log('GenerarReporte');
  }
}
