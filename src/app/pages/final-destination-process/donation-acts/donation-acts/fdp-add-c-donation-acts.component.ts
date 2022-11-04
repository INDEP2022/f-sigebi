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
  selector: 'app-fdp-add-c-donation-acts',
  templateUrl: './fdp-add-c-donation-acts.component.html',
  styles: [],
})
export class FdpAddCDonationActsComponent extends BasePage implements OnInit {
  actForm: FormGroup;
  formTable1: FormGroup;
  settings2: any;
  response: boolean = false;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;

  data = EXAMPLE_DATA;
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
    this.startCalendars();
  }

  search(term: string) {
    this.response = !this.response;
  }

  onSubmit() {}

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required]],
      don: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required]],
      address: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      donationDate: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryName: [null, [Validators.required]],
      receiverName: [null, [Validators.required]],
      auditor: [null, []],
      comptrollerWitness: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
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
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    unidad: 'UNIDAD',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    unidad: 'UNIDAD',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    unidad: 'UNIDAD',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    unidad: 'UNIDAD',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    unidad: 'UNIDAD',
    status: false,
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
];
