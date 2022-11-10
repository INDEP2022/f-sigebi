import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FdpAdpdtDetailDelegationsComponent } from '../../shared-final-destination/detail-delegations/fdp-adpdt-detail-delegations.component';
import { DELEGATIONS_COLUMNS } from '../delegations-columns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-fdp-adpdt-c-third-possession-acts',
  templateUrl: './fdp-adpdt-c-third-possession-acts.component.html',
  styles: [],
})
export class FdpAdpdtCThirdPossessionActsComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  actForm: FormGroup;
  formTable1: FormGroup;
  bsModalRef?: BsModalRef;
  totalItems: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
    this.settings2.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
    this.startCalendars();
  }

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      crimeKey: [null, [Validators.required]],
      crime: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      delivery: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      act: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      folioScan: [null, [Validators.required]],
      orderingJudge: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryName: [null, [Validators.required]],
      beneficiary: [null, [Validators.required]],
      witness: [null, [Validators.required]],
      auditor: [null, [Validators.required]],
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

  search(term: string) {
    this.response = !this.response;
  }

  onSubmit() {}

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Delegación Administra',
        columns: DELEGATIONS_COLUMNS,
        optionColumn: 'delegations',
      },
    };
    this.bsModalRef = this.modalService.show(
      FdpAdpdtDetailDelegationsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
];
