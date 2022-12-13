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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-more-information',
  templateUrl: './more-information.component.html',
})
export class MoreInformationComponent
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
      texto1: ['', [Validators.pattern(STRING_PATTERN)]],
      texto2: ['', [Validators.pattern(STRING_PATTERN)]],
      texto3: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
