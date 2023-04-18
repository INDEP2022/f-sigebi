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

  public emitChange() {
    this.formValues.emit(this.form);
  }
}
