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
  selector: 'app-proof-of-delivery',
  templateUrl: './proof-of-delivery.component.html',
  styles: [],
})
export class ProofOfDeliveryComponent extends BasePage implements OnInit {
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  response: boolean = false;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  settings2: any;
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;
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
  }

  initForm() {
    this.form = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      capture: [null, []],
      programmingType: [null, []],
      elabDate: [null, [Validators.required]],
      actDate: [null, []],
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      trans: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      del: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required]],
      address: [null, [Validators.required]],
      receive: [null, []],
      observations: [null, [Validators.required]],
      delivery: [null, [Validators.required]],
      witnessContr: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
      status: [null, []],
    });
  }

  onSubmit() {}

  search(event: any) {
    this.response = !this.response;
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }
}

const EXAMPLE_DATA1 = [
  {
    goodNumb: '3859',
    description: 'Inmueble ubicado...',
    quantity: 1,
    unit: 'UNIDAD',
    act: '...',
  },
];

const EXAMPLE_DATA2 = [
  {
    goodNumb: '9877',
    clasificationNumb: '7874',
    description: '...',
    quantity: 4,
    unit: 'UNIDAD',
  },
];
