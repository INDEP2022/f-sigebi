/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IJobDictumTexts } from 'src/app/core/models/ms-officemanagement/job-dictum-texts.model';
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
  mode: 'create' | 'update' = 'create';
  public form: FormGroup;

  @Input() set data(value: IJobDictumTexts) {
    if (value) {
      this.form.patchValue(value);
      this.mode = 'update';
    } else {
      this.prepareForm();
      this.form.reset();
    }
  }

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
      textx: [''],
      textoy: ['', [Validators.pattern(STRING_PATTERN)]],
      textoz: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  send() {
    if (this.mode === 'update') {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
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

  update() {
    this.jobDictumTextsService.update(this.form.value).subscribe({
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
