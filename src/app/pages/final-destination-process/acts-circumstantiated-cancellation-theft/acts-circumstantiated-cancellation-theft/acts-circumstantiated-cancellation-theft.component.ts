import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/catalogs/date-documents.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FindActaComponent } from '../find-acta/find-acta.component';
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
  totalItems2: number = 0;
  loading2: boolean = false;
  bienesLoading: boolean = false;
  formTable2: FormGroup;
  actaRecepttionForm: FormGroup;
  validPermisos: boolean = true;
  goodFormFormGroup: FormGroup;
  disabledBtnCerrar: boolean = true;
  ocultarPaginado: boolean = false;
  dataRecepcion: any[] = [];
  disabledBtnActas: boolean = true;
  actaGoodForm: FormGroup;
  formTag: FormGroup;
  gTramite: IProceduremanagement[] = [];
  statusCanc: string | number = '';
  expedient: IExpedient;
  validateEx: boolean = true;
  loadingExpedient: boolean = false;
  screenKey = 'FACTCIRCUNR_0001';
  dataRecepcionGood: LocalDataSource = new LocalDataSource();
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;
  aprevia: string = '';
  causa: string = '';
  annio: string = '';
  noExpediente: number = 0;
  fileNumber: number | string = '';
  columnFilters: any = [];
  columnFilters2: any = [];
  dataTableGood_: any[] = [];
  cveActa: string = '';
  to: string = '';
  from: string = '';
  time = new Date();
  dateElaboration: string = '';
  dataTableGood: LocalDataSource = new LocalDataSource();
  bienes: IGood[] = [];
  constructor(
    private fb: FormBuilder,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private procedureManagementService: ProcedureManagementService,
    protected modalService: BsModalService,
    private GoodprocessService_: GoodprocessService,
    private proceedingsService: ProceedingsService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
    this.actaForm();
    this.dateElaboration = this.datePipe.transform(this.time, 'dd/MM/yyyy');
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
  private actaForm() {
    this.actaRecepttionForm = this.fb.group({
      acta: [null],
      type: [null],
      claveTrans: [null],
      administra: [null],
      cveReceived: [null],
      consec: [null],
      // ejecuta: [null],
      anio: [null],
      mes: [null],
      cveActa: [null],
      direccion: [null],
      observaciones: [null],
      testigoOIC: [null],
      testigoTwo: [null],
      testigoTree: [null],
      respConv: [null],
      parrafo1: [null],
      parrafo2: [null],
      parrafo3: [null],
      // witness1: [null],
      // witness2: [null],
    });
  }

  private goodForm() {
    this.actaGoodForm = this.fb.group({
      goodId: [null],
      statusGood: [null],
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
  goStatus() {
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        origin: this.screenKey,
        // PAR_FOLIO: this.folio,
      },
    });
  }
  actasDefault: any = null;
  searchActas(actas?: string) {
    actas = this.cveActa;
    const expedienteNumber = this.fileNumber;
    const actaActual = this.actasDefault;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      actas,
      actaActual,
      expedienteNumber,
    };

    let modalRef = this.modalService.show(FindActaComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      if (next) {
        this.alert(
          'success',
          'Se Cargó la Información del Acta',
          next.keysProceedings
        );
      }

      this.actasDefault = next;
      // this.fCreate = this.datePipe.transform(
      //   next.dateElaborationReceipt,
      //   'dd/MM/yyyy'
      // );
      this.statusCanc = next.statusProceedings;
      if (this.statusCanc == 'CERRADA') {
        this.disabledBtnCerrar = false;
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
        this.disabledBtnCerrar = true;
      }

      this.actaRecepttionForm.patchValue({
        acta: next.id,

        administra: next.approvedXAdmon,
        // ejecuta: next.ejecuta,
        consec: next.numeraryFolio,
        type: next.idTypeProceedings,
        claveTrans: next.numTransfer,
        cveActa: next.keysProceedings,
        // mes: next.dateElaborationReceipt,
        cveReceived: next.receiptKey,
        // anio: new Date(next.dateElaborationReceipt),
        direccion: next.address,
        // parrafo1: next.parrafo1,
        // parrafo2: next.parrafo2,
        // parrafo3: next.parrafo3,
      });
      this.to = this.datePipe.transform(
        this.actaRecepttionForm.controls['mes'].value,
        'MM/yyyy'
      );
      this.annio = this.datePipe.transform(
        this.actaRecepttionForm.controls['anio'].value,
        'MM/yyyy'
      );
      await this.getDetailProceedingsDevollution(this.actasDefault.id);
      // this.getActasByConversion(next.cve_acta_conv);
    });
    modalRef.content.cleanForm.subscribe(async (next: any) => {
      if (next) {
        this.cleanActa();
      }
    });
  }
  async getDetailProceedingsDevollution(id: any) {
    this.loading2 = true;
    // const params = new ListParams();
    let params: any = {
      ...this.paramsList2.getValue(),
      ...this.columnFilters2,
    };
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService
        .getGoodsByProceedings(id, params)
        .subscribe({
          next: data => {
            let result = data.data.map((item: any) => {
              item['description'] = item.good ? item.good.description : null;
            });

            Promise.all(result).then(item => {
              this.ocultarPaginado = true;
              this.dataRecepcion = data.data;
              this.dataRecepcionGood.load(this.dataRecepcion);
              this.dataRecepcionGood.refresh();
              this.totalItems2 = data.count;
              console.log('data', data);
              this.loading2 = false;
            });
          },
          error: error => {
            this.dataRecepcion = [];
            this.dataRecepcionGood.load([]);
            this.loading2 = false;
            this.ocultarPaginado = false;
          },
        });
    });
  }
  gestionTramite() {
    this.filterParams
      .getValue()
      .addFilter('expedient', this.fileNumber, SearchFilter.EQ);
    this.procedureManagementService.getAll(this.params.getValue()).subscribe({
      next: data => {
        this.gTramite = data.data;
        console.log(this.bienes);
        this.dataTableGood.load(this.bienes);
        this.dataTableGood.refresh();
        this.totalItems = data.count;
      },
      error: () => {
        this.bienesLoading = false;
        console.error('error ');
      },
    });
  }

  actualizarActa() {}
  agregarActa() {}
  cleanActa() {}
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
