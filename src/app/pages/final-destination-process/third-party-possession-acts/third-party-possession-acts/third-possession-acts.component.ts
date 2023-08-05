import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DetailDelegationsComponent } from '../../shared-final-destination/detail-delegations/detail-delegations.component';
import { DELEGATIONS_COLUMNS } from '../delegations-columns';
import { COLUMNS, COLUMNS2 } from './columns';

@Component({
  selector: 'app-third-possession-acts',
  templateUrl: './third-possession-acts.component.html',
  styles: [],
})
export class ThirdPossessionActsComponent extends BasePage implements OnInit {
  response: boolean = false;
  actForm: FormGroup;
  formTable1: FormGroup;
  bsModalRef?: BsModalRef;
  totalItems: number = 0;
  totalItems1: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());

  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  //data = EXAMPLE_DATA;
  //data2 = EXAMPLE_DATA2;
  columnFilters: any = [];
  columnFilters1: any = [];

  data: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();

  expedientSearch: number | string;
  expedient: any;
  proceedingDev: any;
  crime: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private rNomenclaService: RNomenclaService,
    private procedureManagementService: ProcedureManagementService,
    //Transferente
    private stationService: StationService,
    //HistoricoGood
    private historyGoodService: HistoryGoodService,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private statusGoodService: StatusGoodService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    //crime
    private affairService: AffairService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
    this.startCalendars();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*  SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventTpId':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(filter.search);
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGood();
        }
      });

    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGood());*/
    /*const noTransfer = 1;
    const type = 'P'
    this.getCveTransferent(noTransfer,type);*/
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
      crimeKey: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      crime: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delivery: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      elabDate: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      folioScan: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      orderingJudge: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      deliveryName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      beneficiary: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witness: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      auditor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.actForm;

    this.formTable1 = this.fb.group({
      id: [null, []],
      preliminaryInquiry: [null, []],
      criminalCase: [null, []],
      crimeKey: [null, []],
      registerNumber: [null, []],
      transferNumber: [null, []],
      expTransferNumber: [null, []],
      expedientType: [null, []],
      detail: [null, []],
      crime: [null, []],
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

  search(term: string | number) {
    this.expedientSearch = term;
    console.log(this.expedientSearch);
    //this.response = !this.response;
    this.getExpedient(term);
  }

  onSubmit() {}

  getExpedient(id?: number | string) {
    if (id) {
      this.params1.getValue()['filter.id'] = `$eq:${id}`;
    }
    let params = {
      ...this.params1.getValue(),
    };
    this.expedientService.getAll(params).subscribe({
      next: response => {
        this.expedient = response.data;
        this.formTable1.controls['id'].setValue(this.expedient[0].id);
        this.formTable1.controls['preliminaryInquiry'].setValue(
          this.expedient[0].preliminaryInquiry
        );
        this.formTable1.controls['criminalCase'].setValue(
          this.expedient[0].criminalCase
        );
        this.formTable1.controls['crimeKey'].setValue(
          this.expedient[0].crimeKey
        );
        this.formTable1.controls['expTransferNumber'].setValue(
          this.expedient[0].expTransferNumber
        );
        this.formTable1.controls['expedientType'].setValue(
          this.expedient[0].expedientType
        );
        console.log(response.data);
        this.response = !this.response;
        this.getCrime(this.formTable1.controls['crimeKey'].value);
        this.getProceedingsDevolution(this.formTable1.controls['id'].value);
        this.getGood(this.formTable1.controls['id'].value);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'No se Encontro el Expediente',
          `Intente con Otro`
        );
      },
    });
  }

  getProceedingsDevolution(idExp: string | number) {
    if (idExp) {
      this.params2.getValue()['filter.fileNumber.filesId'] = `$eq:${idExp}`;
    }
    let params = {
      ...this.params2.getValue(),
    };
    this.detailProceedingsDevolutionService
      .getAllProceedingsDevolution(params)
      .subscribe({
        next: response => {
          this.proceedingDev = response.data;
          console.log(this.proceedingDev[0]);
          this.actForm.controls['actSelect'].setValue(
            this.proceedingDev[0].proceeding
          );
          this.actForm.controls['status'].setValue(
            this.proceedingDev[0].proceedingsTypeId
          );
          this.actForm.controls['delivery'].setValue(
            this.proceedingDev[0].receiptCve
          );
          this.actForm.controls['act'].setValue(
            this.proceedingDev[0].proceedingsCve
          );
          var formatted = new DatePipe('en-EN').transform(
            this.proceedingDev[0].elaborationDate,
            'dd/MM/yyyy',
            'UTC'
          );
          this.actForm.controls['elabDate'].setValue(formatted);
          this.actForm.controls['folioScan'].setValue(
            this.proceedingDev[0].universalFolio
          );
          this.actForm.controls['orderingJudge'].setValue(
            this.proceedingDev[0].authorityOrder
          );
          this.actForm.controls['observations'].setValue(
            this.proceedingDev[0].observations
          );
          this.actForm.controls['deliveryName'].setValue(
            this.proceedingDev[0].witnessOne
          );
          this.actForm.controls['beneficiary'].setValue(
            this.proceedingDev[0].beneficiaryOwner
          );
          this.actForm.controls['witness'].setValue(
            this.proceedingDev[0].witnessTwo
          );
          this.actForm.controls['auditor'].setValue(
            this.proceedingDev[0].auditor
          );
          this.actForm.controls['statusAct'].setValue(
            this.proceedingDev[0].proceedingStatus
          );

          /*proceedingsTypeId
        receiptCve
        elaborationDate
        closingDate
        authorityOrder
        witnessOne
        witnessTwo
        observations
        beneficiaryOwner
        auditor
        proceedingStatus
        elaborated
        id
        proceedingsType
        delegationNumberOne
        delegationNumberTwo
        numRegister

        transferNumber
        proceedingsCve*/
        },
        error: err => {},
      });
  }

  getCrime(cveCrime?: string | number) {
    if (cveCrime) {
      this.params3.getValue()['filter.id'] = cveCrime;
    }
    let params = {
      ...this.params3.getValue(),
    };
    this.affairService.getCrime(params).subscribe({
      next: response => {
        this.crime = response.data;
        this.formTable1.controls['crime'].setValue(this.crime[0].otvalor);
        //otvalor
        //console.log(response.data);
      },
      error: err => {},
    });
  }

  getCveTransferent(noTranfer: string | number, typeExpe: string) {
    let body = {
      transferNumber: noTranfer,
      fileType: typeExpe,
    };
    let params = {
      ...this.params4.getValue(),
    };
    this.affairService.getCveTransfer(body, params).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {},
    });
  }

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Delegación Administra',
        columns: DELEGATIONS_COLUMNS,
        optionColumn: 'delegations',
      },
    };
    this.bsModalRef = this.modalService.show(
      DetailDelegationsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  getGood(expId?: string | number) {
    this.loading = true;
    if (expId) {
      this.params.getValue()['filter.fileNumber'] = `$eq:${expId}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getAll(params).subscribe({
      next: response => {
        //this.comerEvent = response.data;
        this.data.load(response.data);
        this.totalItems = response.count || 0;
        this.data.refresh();
        //this.params.value.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  getDetailProcedings(expId: string | number) {
    this.loading = true;
    if (expId) {
      this.params.getValue()['filter.good.fileNumber'] = `$eq:${expId}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    this.detailProceedingsDevolutionService.getAll(params).subscribe({
      next: response => {
        //this.comerEvent = response.data;
        this.data2.load(response.data);
        this.totalItems1 = response.count || 0;
        this.data2.refresh();
        //this.params.value.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems1 = 0;
      },
    });
  }

  closeExpedient() {}
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
