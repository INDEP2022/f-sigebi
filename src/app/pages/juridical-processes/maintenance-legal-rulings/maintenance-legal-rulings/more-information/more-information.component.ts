/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
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

  constructor(
    private fb: FormBuilder,
    private jobDictumTextsService: JobDictumTextsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      dictatesNumber: [null, Validators.required],
      rulingType: ['', Validators.required],
      textX: ['', [Validators.pattern(STRING_PATTERN)]],
      textY: ['', [Validators.pattern(STRING_PATTERN)]],
      textZ: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  send() {
    this.jobDictumTextsService.create(this.form.value).subscribe({
      next: data => {
        this.alert(
          'success',
          'Se ha agregado la información correctamente',
          ''
        );
      },
      error: err => {
        this.alert('error', 'No se ha podido agregar la información', '');
      },
    });
  }

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
