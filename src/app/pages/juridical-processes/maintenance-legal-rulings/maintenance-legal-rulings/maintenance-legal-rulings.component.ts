/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-maintenance-legal-rulings',
  templateUrl: './maintenance-legal-rulings.component.html',
  styleUrls: ['./maintenance-legal-rulings.component.scss'],
})
export class MaintenanceLegalRulingComponent
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
      justificacion: '',
    });
  }
}
