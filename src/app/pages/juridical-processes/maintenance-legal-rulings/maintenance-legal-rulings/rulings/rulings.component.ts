/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DictamenService } from 'src/app/core/services/catalogs/dictamen.service';
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
    private dictationService: DictamenService
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

    this.form
      .get('expedientNumber')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(x => {
        this.emitChange(x);
      });
    this.form
      .get('id')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(x => {
        this.emitChange(null, x);
      });
  }

  getData(params?: ListParams) {
    if (!this.form.get('id').value) {
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;

    if (this.form.get('id').value) {
      data.addFilter('id', this.form.get('id').value);
    }

    this.dictationService.getAll(data.getParams()).subscribe({
      next: data => {
        this.form.patchValue(data);
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  public emitChange(expedientNumber?: number, dictaNumber?: number) {
    this.formValues.emit(this.form.value);
  }
}
