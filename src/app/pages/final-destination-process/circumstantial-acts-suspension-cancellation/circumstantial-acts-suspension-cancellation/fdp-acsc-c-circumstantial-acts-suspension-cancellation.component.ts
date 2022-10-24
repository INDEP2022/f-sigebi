import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-fdp-acsc-c-circumstantial-acts-suspension-cancellation',
  templateUrl:
    './fdp-acsc-c-circumstantial-acts-suspension-cancellation.component.html',
  styles: [],
})
export class FdpAcscCCircumstantialActsSuspensionCancellationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTag: FormGroup;
  response: boolean;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  settings2: any;
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
    this.startCalendars();
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  initForm() {
    this.form = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      closingDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      ident: [null, [Validators.required]],
      receive: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required]],
      address: [null, [Validators.required]],
      autorithyCS: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      elaboration: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      witnessContr: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
    });

    this.formTag = this.fb.group({
      tag: [null, []],
    });
  }

  search(event: any) {
    this.response = !this.response;
  }

  onSubmit() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }
}

const EXAMPLE_DATA1 = [
  {
    goodNumb: 3587,
    description: 'Inmueble ubicado en...',
    process: 'ASEGURADO',
    quantity: 1,
    unit: 'UNIDAD',
    act: '...',
  },
];

const EXAMPLE_DATA2 = [
  {
    goodNumb: 105844,
    clasificationNumb: '855',
    description: '16 Vasos de Vidrio',
    process: 'ASEGURADO',
    quantity: 16,
    unit: 'PIEZA',
  },
];
