import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-destination-goods-acts',
  templateUrl: './destination-goods-acts.component.html',
  styles: [],
})
export class DestinationGoodsActsComponent extends BasePage implements OnInit {
  actForm: FormGroup;
  formTable1: FormGroup;
  response: boolean = false;
  totalItems: number = 0;
  settings2: any;
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
    this.actForm = this.fb.group({
      statusAct: [null, [Validators.required]],
      act: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      destinationDelivDate: [null, [Validators.required]],
      address: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryName: [null, [Validators.required]],
      receiverName: [null, [Validators.required]],
      auditor: [null, [Validators.required]],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
  }

  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;

  search(term: string) {
    this.response = !this.response;
  }

  onSubmit() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
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
];
