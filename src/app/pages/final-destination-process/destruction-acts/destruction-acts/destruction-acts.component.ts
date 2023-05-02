import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNSTABL1 } from './columnsTable1';
import { COLUMNSTABLE2 } from './columnsTable2';

@Component({
  selector: 'app-destruction-acts',
  templateUrl: './destruction-acts.component.html',
  styles: [],
})
export class DestructionActsComponent extends BasePage implements OnInit {
  actForm: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  response: boolean = false; //data backend
  settings2: any;
  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNSTABL1;
    this.settings2.columns = COLUMNSTABLE2;
  }

  ngOnInit(): void {
    this.initForm();
    this.startCalendars();
  }

  search(term: string | number) {
    this.response = !this.response;
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

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      elabDate: [null, [Validators.required]],
      destructDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      destr: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      responsible: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witness1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witness2: [null, [Validators.pattern(STRING_PATTERN)]],
      methodDestruct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witnessContr: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folioScan: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
    });
  }

  onSubmit() {}
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
  },
];
