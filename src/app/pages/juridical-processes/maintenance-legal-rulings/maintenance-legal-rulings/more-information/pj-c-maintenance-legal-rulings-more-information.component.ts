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
  selector: 'app-pj-c-maintenance-legal-rulings-more-information',
  templateUrl:
    './pj-c-maintenance-legal-rulings-more-information.component.html',
})
export class PJMaintenanceLegalRulingMoreInformationComponent
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
      tipoDictaminacion: '',
      texto1: '',
      texto2: '',
      texto3: '',
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
