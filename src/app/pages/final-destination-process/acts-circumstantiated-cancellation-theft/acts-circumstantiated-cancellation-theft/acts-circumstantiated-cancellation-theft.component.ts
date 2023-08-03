import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/catalogs/date-documents.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FindAllExpedientComponent } from '../find-all-expedient/find-all-expedient.component';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-acts-circumstantiated-cancellation-theft',
  templateUrl: './acts-circumstantiated-cancellation-theft.component.html',
  styles: [],
})
export class ActsCircumstantiatedCancellationTheftComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  formTable1: FormGroup;
  formFind: FormGroup;
  formTable2: FormGroup;
  formTag: FormGroup;
  expedient: IExpedient;
  validateEx: boolean = true;
  loadingExpedient: boolean = false;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;
  aprevia: string = '';
  causa: string = '';
  noExpediente: number = 0;
  fileNumber: number | string = '';
  columnFilters: any = [];
  columnFilters2: any = [];
  dataTableGood_: any[] = [];
  time = new Date().toISOString().slice(0, 16);
  dataTableGood: LocalDataSource = new LocalDataSource();
  bienes: IGood[] = [];
  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    protected modalService: BsModalService,
    private GoodprocessService_: GoodprocessService,
    private proceedingsService: ProceedingsService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      find: [null],
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
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ident: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      receive: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      autorithy2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      elaboration: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      responsible: [null, [Validators.required]],
      witnessContr: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folioScan: [null, [Validators.required]],
    });

    this.formTable1 = this.fb.group({
      detail: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formTable2 = this.fb.group({
      detail: [null, [Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formTag = this.fb.group({
      tag: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  onSubmit() {}

  search(event: any) {
    this.loadingExpedient = true;
    this.getExpedient(event);
    event = '';
  }
  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }
  getExpedient(id: number) {
    this.loadingExpedient = true;
    this.expedientService.getById(id).subscribe({
      next: (data: any) => {
        this.response = !this.response;
        this.validateEx = true;
        this.loadingExpedient = false;
        this.expedient = data;
        this.fileNumber = this.expedient.id;
        this.aprevia = this.expedient.preliminaryInquiry;
        this.causa = this.expedient.criminalCase;
        this.form.get('elabDate').setValue(this.expedient.insertDate);
        this.form.get('captureDate').setValue(this.expedient.insertionDatehc);
        this.form.get('authority').setValue(this.expedient.authorityNumber);
        this.form.get('ident').setValue(this.expedient.identifier);
        this.form.get('receive').setValue(this.expedient.courtName);
        this.form.get('admin').setValue(this.expedient.indicatedName);
        // this.actaRecepttionForm.value.claveTrans = this.trasnfer;
        // console.log(this.expedient);
        this.getGoodsByStatus(Number(this.fileNumber));
      },
      error: () => {
        console.error('expediente nulo');
        this.loadingExpedient = false;
        this.validateEx = false;
      },
    });
  }
  getGoodsByStatus(id: number) {
    this.loading = true;

    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    console.log('1412212', params);
    this.goodService.getByExpedient_(id, params).subscribe({
      next: data => {
        this.bienes = data.data;

        console.log('Bienes', this.bienes);

        let result = data.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FACTCIRCUNR_0001',
            pNumberGood: item.id,
          };
          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          const acta: any = await this.getActaGoodExp(item.id, item.fileNumber);
          console.log('acta', acta);
          item['acta_'] = acta;
          item.di_disponible = acta != null ? 'N' : di_dispo;
        });

        Promise.all(result).then(item => {
          this.dataTableGood_ = this.bienes;
          this.dataTableGood.load(this.bienes);
          this.dataTableGood.refresh();
          // Define la función rowClassFunction para cambiar el color de las filas en función del estado de los bienes
          this.totalItems = data.count;
          this.loading = false;
          // console.log(this.bienes);
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }
  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.GoodprocessService_.getScreenGood(body).subscribe({
        next: async (state: any) => {
          if (state.data) {
            console.log('di_dispo', state);
            resolve('S');
          } else {
            console.log('di_dispo', state);
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }
  async getActaGoodExp(good: any, exp: any) {
    return new Promise((resolve, reject) => {
      this.proceedingsService.getGetFactDbConvBien(good, exp).subscribe({
        next: async (state: any) => {
          console.log('acta', state);
          resolve(state.data[0].cve_acta);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }
  cleanForm() {
    this.form.reset();
    this.dataTableGood_ = [];
    this.dataTableGood.load([]);
    this.dataTableGood.reset();
  }
  searchExpedient(provider?: IExpedient) {
    this.loadingExpedient = true;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };

    let modalRef = this.modalService.show(
      FindAllExpedientComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any) => {
      console.log(next);
      this.getExpedient(next.id);
    });
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
    clasificationNumb: '7874',
    description: '...',
    quantity: 4,
  },
];
