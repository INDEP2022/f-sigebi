/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-rulings',
  templateUrl: './rulings.component.html',
})
export class RulingsComponent extends BasePage implements OnInit, OnDestroy {
  @Output() formValues = new EventEmitter<any>();
  params: any;

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dictationService: DictationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: '',
      passOfficeArmy: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      expedientNumber: '',
      typeDict: '',
      statusDict: ['', [Validators.pattern(STRING_PATTERN)]],
      dictDate: '',
      userDict: ['', [Validators.pattern(STRING_PATTERN)]],
      observations: ['', [Validators.pattern(STRING_PATTERN)]],
      delegationDictNumber: '',
      areaDict: ['', [Validators.pattern(STRING_PATTERN)]],
      instructorDate: '',
      esDelit: ['', [Validators.pattern(STRING_PATTERN)]],
      wheelNumber: '',
      notifyAssuranceDate: '',
      resolutionDate: '',
      notifyResolutionDate: '',
      folioUniversal: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      entryDate: '',
      dictHcDAte: '',
      entryHcDate: '',
    });
  }

  setFormData() {
    const dictationNumber = this.form.get('id').value;

    this.dictationService.findByIds({ id: dictationNumber }).subscribe({
      next: data => {
        this.form.patchValue(data);
        const value = this.form.value;
        this.form
          .get('dictDate')
          .patchValue(value.dictDate ? new Date(value.dictDate) : null);
        this.form
          .get('entryDate')
          .patchValue(value.entryDate ? new Date(value.entryDate) : null);
        this.form
          .get('entryHcDate')
          .patchValue(value.entryHcDate ? new Date(value.entryHcDate) : null);
        this.form
          .get('instructorDate')
          .patchValue(
            value.instructorDate ? new Date(value.instructorDate) : null
          );
        this.form
          .get('notifyResolutionDate')
          .patchValue(
            value.notifyResolutionDate
              ? new Date(value.notifyResolutionDate)
              : null
          );
        this.form
          .get('notifyAssuranceDate')
          .patchValue(
            value.notifyAssuranceDate
              ? new Date(value.notifyAssuranceDate)
              : null
          );
        this.form
          .get('resolutionDate')
          .patchValue(
            value.resolutionDate ? new Date(value.resolutionDate) : null
          );
        this.form
          .get('dictHcDAte')
          .patchValue(value.dictHcDAte ? new Date(value.dictHcDAte) : null);
        this.emitChange();
      },
      error: err => {
        console.log(err);
      },
    });
  }

  public emitChange() {
    this.formValues.emit(this.form.value);
  }
}
