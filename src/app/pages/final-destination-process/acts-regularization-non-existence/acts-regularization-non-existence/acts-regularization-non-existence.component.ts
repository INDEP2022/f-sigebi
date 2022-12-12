import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-acts-regularization-non-existence',
  templateUrl: './acts-regularization-non-existence.component.html',
  styles: [],
})
export class ActsRegularizationNonExistenceComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  formTable1: FormGroup;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
  }

  search(event: any) {
    this.response = !this.response;
  }

  initForm() {
    this.form = this.fb.group({
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      actSelect: [null, [Validators.required]],
      type: [null, [Validators.required]],
      del: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      elabDate: [null, [Validators.required]],
      authorization: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      sessionNumb: [null, [Validators.required]],
      caseNumb: [null, [Validators.required]],
      folioScan: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      responsible: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witness1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witness2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
  }

  onSubmit() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }
}

const EXAMPLE_DATA1 = [
  {
    goodNumb: '3859',
    description: 'Inmueble ubicado...',
    quantity: 1,
    act: '...',
  },
];

const EXAMPLE_DATA2 = [
  {
    goodNumb: '9877',
    description: '...',
    quantity: 4,
  },
];
