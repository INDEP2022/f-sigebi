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
  selector: 'app-review-resource-report',
  templateUrl: './review-resource-report.component.html',
  styleUrls: ['./review-resource-report.component.scss'],
})
export class ReviewResourceReportComponent
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
      delegacion: ['', [Validators.pattern(STRING_PATTERN)]], // Delegación Detalle
      subdelegacion: ['', [Validators.pattern(STRING_PATTERN)]], // Subdelegación Detalle
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
