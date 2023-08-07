import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, Subject, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IExpedient } from 'src/app/core/models/catalogs/date-documents.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IConvertiongood } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { ICopiesJobManagementDto } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';

import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IActasConversion } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FlyersService } from 'src/app/pages/documents-reception/flyers/services/flyers.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ScanningFoilComponent } from '../../payment-claim-process/scanning-foil/scanning-foil.component';
import { CreateActaComponent } from '../create-acta/create-acta.component';
import { FindActaGoodComponent } from '../find-acta-good/find-acta-good.component';
import {
  GooByExpediente,
  IDataGoodsTable,
} from '../proceedings-conversion-column';
import { ProceedingsConversionModalComponent } from '../proceedings-conversion-modal/proceedings-conversion-modal.component';
import { ActasConvertionCommunicationService } from '../services/proceedings-conversionn';
import {
  COPY,
  IGoodStatus,
  registrosMovidos,
} from './proceedings-conversion-columns';

export type IGoodAndAvailable = IGood & {
  available: boolean;
  selected: boolean;
};

export type IDocumentJobManagement = {
  cveDocument: string;
  goodNumber: any;
  managementNumber: string;
  recordNumber: string;
  rulingType: string;
  description?: string;
};
export interface IGoodJobManagement {
  managementNumber: string;
  goodNumber: number;
  recordNumber: string;
  classify: string | number;
  goods: string;
  good: IGood;
}
@Component({
  selector: 'app-proceedings-conversion',
  templateUrl: './proceedings-conversion.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
      .disabled[disabled] {
        color: red;
      }
      .disabled-input {
        color: #939393;
        pointer-events: none;
      }
      #bienes table:not(.normal-hover) tbody tr:hover {
        color: black !important;
        font-weight: bold;
      }
      .row-verde {
        background-color: green;
        font-weight: bold;
      }

      .row-negro {
        background-color: black;
        font-weight: bold;
      }
      .registros-movidos {
        background-color: yellow;
      }
    `,
  ],
})
export class ProceedingsConversionComponent extends BasePage implements OnInit {
  // proceedingsConversionForm: ModelForm<any>;
  settings2;
  procs: any;
  totalItems2: number = 0;
  fCreate: string = '';
  typeConv: number | string = 0;
  type = 'CONVERSION';
  actaO: number | string;
  loadingText = '';
  isHideSelection = true;
  userName: string = '';
  insert = false;
  idProceeding: number = 0;
  dataTableGoodsActa: LocalDataSource = new LocalDataSource();
  disabledImport: boolean = true;
  edit = false;
  updateRe = false;
  private unsubscribe$ = new Subject<void>();
  act2Valid = false;
  delete = false;
  dataA: any = 0;
  dataD: any = 0;
  time: string = '';
  confirmSearch: boolean = false;
  preAver = '';
  criCase = '';
  createCon: IProceedingDeliveryReception;
  test: any;
  to: string = '';
  annio: string = '';
  bienes: IGood[] = [];
  statusGoodName: string = '';
  research: true;
  dataTemporal: LocalDataSource = new LocalDataSource();
  goodsByFather: IGood[] = [];
  validPermisos: boolean = true;
  searchMode: boolean = false;
  isLoading = false;
  statusConv: string | number = '';
  read = false;
  isLoadingSender = false;
  isCreate = false;
  statusGood: IGoodStatus;
  selectedRow: IGood;
  selectedActa: IActasConversion;
  origin = '';
  totalItemsActas: number = 0;
  department = '';
  selectedGood: IGoodAndAvailable;
  delegation: string = null;
  data1: any[] = [];
  p_valor: number;
  checkSelectTable: boolean = false;
  proceedingsConversionForm: FormGroup;
  actaRecepttionForm: FormGroup;
  statusGoodForm: FormGroup;
  actaGoodForm: FormGroup;
  dataActa: LocalDataSource = new LocalDataSource();
  dataGoodTable: LocalDataSource = new LocalDataSource();
  paramsGoodsType: number = 0;
  loadingGoods = false;
  select: any;
  initialdisabled = false;
  goods: any[] = [];
  expedient: IExpedient;
  columnFilters: any = [];
  columnFilters2: any = [];
  isAllDisabled = false;
  cveActa: string = '';
  fileNumber: number = 0;
  rececption: any[] = [];
  conversion: number = 0;
  datos: any[] = [];
  goodFatherNumber: string | number = 0;
  isLoadingGood = false;
  dataTableGoods: IGoodAndAvailable[] = [];
  convertionData: IConvertiongood;
  header: ModelForm<any>;
  antecedent: ModelForm<any>;
  antecedentTwo: ModelForm<any>;
  antecedentThree: ModelForm<any>;
  first: ModelForm<any>;
  dataUserLoggedTokenData: any;
  pageParams: IInitFormProceedingsBody = null;
  closureOfMinutes: ModelForm<any>;
  antecedentThreeEnable: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  paramsGood: number = 0;
  loadingSend = false;
  userRes: string;
  trasnfer: any;
  screenKey = 'FCOMERCARTALIB_I';
  dataTableGoodsConvertion: LocalDataSource = new LocalDataSource();
  copyActa: any[] = [];
  dataGoodFilter: IGood[] = [];
  dataGood: GooByExpediente[] = [];
  dataTableGoodsJobManagement: IGoodJobManagement[] = [];
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @ViewChild('tableDocs') tableDocs: Ng2SmartTableComponent;
  @ViewChild('modal') modal: ProceedingsConversionModalComponent;
  @ViewChild('hijoRef', { static: false }) hijoRef: ScanningFoilComponent;
  @ViewChild('myInput') inputEl: ElementRef;
  @Output() onConfirm = new EventEmitter<any>();
  @Input() registro: any;
  @Output() mover = new EventEmitter();

  dataTableGoodsMap = new Map<number, IGoodAndAvailable>();
  dataGoodsSelected = new Map<number, IGoodAndAvailable>();

  paramsScreen: IParamsProceedingsParamsActasConvertion = {
    PAR_IDCONV: 0, // P_GEST_OK
  };

  isDisabledBtnDocs = false;
  isDisabledBtnPrint = false;
  // Send variables
  blockSend: boolean = false;
  variablesSend = {
    ESTATUS: '',
    PAR_IDCONV: '',
    origin: '',
  };
  converGood: IConvertiongood;
  formData: Partial<IConvertiongood> = null;
  senders = new DefaultSelect();
  actas = new DefaultSelect();
  disabled: boolean = true;
  estatusNew: 'CERRADA';
  filtroPersonaExt: ICopiesJobManagementDto[] = [];
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  witnessOic: string = '';
  acordionDetail: boolean = false;
  dataTableGood: LocalDataSource = new LocalDataSource();
  dataRecepcionGood: LocalDataSource = new LocalDataSource();
  dataRecepcion: any[] = [];
  dataTableGood_: any[] = [];

  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  loading2: boolean = false;
  ocultarPaginado: boolean = false;
  disabledBtnCerrar: boolean = true;
  disabledBtnActas: boolean = true;
  statusGood_: any;
  constructor(
    private authService: AuthService,
    protected flyerService: FlyersService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private massiveGoodService: MassiveGoodService,
    private router: Router,
    private expedientService: ExpedientService,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService,
    private regionalDelegacionService: RegionalDelegationService,
    protected modalService: BsModalService,
    private statusGoodService: StatusGoodService,
    private convertiongoodService: ConvertiongoodService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private goodService: GoodService,
    private securityService: SecurityService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    protected goodprocessService: GoodProcessService,
    protected serviceOficces: GoodsJobManagementService,
    private changeDetectorRef: ChangeDetectorRef,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private screenStatusService: ScreenStatusService,
    private GoodprocessService_: GoodprocessService,
    private proceedingsService: ProceedingsService,
    private readonly historyGoodService: HistoryGoodService,
    private usersService: UsersService
  ) {
    super();
    // this.procs = new LocalDataSource();
    this.validPermisos = !this.validPermisos;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      // selectMode: 'multi',
      selectedRowIndex: -1,
      mode: 'external',
      // columns: { ...GOODSEXPEDIENT_COLUMNS_GOODS },
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelectedValid(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelectValid(instance),
        },
        goodId: {
          title: 'No. Bien',
          type: 'number',
          sort: false,
        },
        description: {
          title: 'Descripción',
          type: 'string',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          type: 'string',
          sort: false,
        },
        acta_: {
          title: 'Acta',
          type: 'string',
          sort: false,
          // valuePrepareFunction: (cell: any, row: any) => {
          //   return row.acta_;
          // },
        },
        status: {
          title: 'Estatus',
          type: 'string',
          sort: false,
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }

        // if (row.data.status === 'CNE') {
        //   return 'bg-success text-white';
        // } else if (
        //   row.data.status === 'RRE' ||
        //   row.data.status === 'VXR' ||
        //   row.data.status === 'DON'
        // ) {
        //   return 'bg-dark text-white';
        // } else {
        //   return 'bg-success text-white';
        // }
      },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: { ...COPY },
      rowClassFunction: (row: any) => {
        // if (row.data.di_disponible == 'S') {
        //   return 'text-white';
        // } else {
        return 'bg-light text-black';
        // }
      },
    };
  }

  ngOnInit(): void {
    this.actasConvertionCommunicationService.ejecutarFuncion$.subscribe(
      (next: any) => {
        console.log('SI WILM', next);
        this.ejecutarFuncion();
      }
    );

    this.getDelegation(new FilterParams());
    this.prepareForm();
    this.actaForm();
    this.goodForm();
    const token = this.authService.decodeToken();
    this.dataUserLoggedTokenData = token;
    this.pageParams = this.actasConvertionCommunicationService.actasParams;
    this.pageParams.PAR_IDCONV ||= this.route.snapshot.params?.['PAR_IDCONV'];
    this.route.queryParamMap.subscribe(params => {
      this.origin = params.get('origin');
      console.log(this.origin);
    });
    this.initFormPostGetUserData();

    this.dataTableGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              goodId: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              quantity: () => (searchFilter = SearchFilter.EQ),
              acta_: () => (searchFilter = SearchFilter.ILIKE),
              status: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              // console.log(
              //   'this.columnFilters[field]',
              //   this.columnFilters[field]
              // );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getGoodsByStatus(this.fileNumber);
        }
      });
    this.paramsList
      .pipe(
        skip(1),
        tap(() => {
          this.getGoodsByStatus(this.fileNumber);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        // this.getGoodsByStatus(this.fileNumber)
      });
    // this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   this.getGoodsByStatus(this.fileNumber);
    // });

    this.dataRecepcionGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              numberGood: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              amount: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.paramsList2 = this.pageFilter(this.paramsList2);
          //Su respectivo metodo de busqueda de datos
          this.getDetailProceedingsDevollution(this.actasDefault.id);
        }
      });
    this.paramsList2
      .pipe(
        skip(1),
        tap(() => {
          this.getDetailProceedingsDevollution(this.actasDefault.id);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        // this.getGoodsByStatus(this.fileNumber)
      });
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }
  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }
  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }

  private prepareForm() {
    this.department = this.authService.decodeToken().department;
    this.userTracker(
      this.screenKey,
      this.authService.decodeToken().preferred_username
    );
    console.log(this.userTracker);
    this.proceedingsConversionForm = this.fb.group({
      idConversion: [null],
      goodFatherNumber: [null],
      noExpedient: [null],
      acta: [null, [Validators.pattern(STRING_PATTERN)]],
      preliminaryInquiry: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      criminalCase: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      cveActaConv: [null],
      statusConv: [null],
      trans: [null, [Validators.pattern(STRING_PATTERN)]],
      conv: [null, [Validators.pattern(STRING_PATTERN)]],
      admin: [null, [Validators.pattern(STRING_PATTERN)]],
      fConversions: [null, [Validators.pattern(STRING_PATTERN)]],
      hourConv: [null],
      fCreate: [null],

      // respConv: [null, [Validators.pattern(STRING_PATTERN)]],
      respCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      // folioUniversalAsoc: [null, [Validators.pattern(STRING_PATTERN)]],
      // testigoTwo: [null, [Validators.pattern(STRING_PATTERN)]],
      // testigoTree: [null, [Validators.pattern(STRING_PATTERN)]],
      // testigoOIC: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.statusGoodForm = this.fb.group({
      statusGood: [null],
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

  exportToExcel() {
    const filename: string = this.userName + '-Actas';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(this.procs['data'], { filename });
  }
  userTracker(screen: string, user: string) {
    let isfilterUsed = false;
    const params = this.params.getValue();
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.securityService.getScreenUser(screen, user).subscribe({
      next: (data: any) => {
        data.data.map((filter: any) => {
          if (
            filter.readingPermission == 'S' &&
            filter.writingPermission == 'S'
          ) {
            this.read = true;
            this.updateRe = true;
            this.updateRe = true;
            this.delete = true;
            this.insert = true;
            console.log('readYes and writeYes');
            this.validPermisos = true;
          } else if (
            filter.readingPermission == 'S' &&
            filter.writingPermission == 'N'
          ) {
            this.read = true;
            console.log('readYes and writeNO');
          } else if (
            filter.readingPermission == 'N' &&
            filter.writingPermission == 'S'
          ) {
            this.insert = true;
            this.validPermisos = true;
            this.validPermisos = true;
            console.log('readNo and writeYes');
          } else {
            this.alert(
              'info',
              'No Tiene Permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá Ingresar',
              ''
            );
            return;
          }
        });
      },
      error: (error: any) => {
        this.alert(
          'info',
          'No Tiene Permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá Ingresar',
          ''
        );
        this.router.navigate(['/pages/general-processes/goods-tracker']);
      },
    });
  }
  execute_PUP_LLAMA_VALIDACION() {
    this.loadingSend = false;
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        origin: this.screenKey,
        PAR_IDCONV: this.convertionData.id,
        // origin2: this.origin,
        // origin3: this.origin3,
        ...this.paramsScreen,
      },
    });
  }

  initFormPostGetUserData() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin2']
          ? params['origin2']
          : params['origin'] ?? null;
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_IDCONV) {
        this.initForm();
      } else {
        console.log('SIN PARAMETROS');
        if (!this.origin) {
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de Actas
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de Actas
        } else {
        }
      }
    }
  }

  initForm() {
    let body: IInitFormProceedingsBody = {
      PAR_IDCONV: Number(this.paramsScreen.PAR_IDCONV),
    };
    let subscription = this.convertiongoodService
      .getById(body.PAR_IDCONV)
      .subscribe({
        next: (res: IConvertiongood) => {
          console.log(res);
          // this.loading = false;
          this.fileNumber = res.fileNumber.id;
          this.conversion = res.id;
          this.goodFatherNumber = res.goodFatherNumber;
          this.fCreate = this.datePipe.transform(res.fCreate, 'dd/MM/yyyy');
          this.typeConv = res.typeConv;
          this.statusConv = res.statusConv;
          this.witnessOic = res.witnessOic;
          this.preAver = res.fileNumber.preliminaryInquiry;
          this.criCase = res.fileNumber.criminalCase;
          this.cveActa = res.minutesErNumber;
          this.userRes = res.fileNumber.usrResponsibleFile;
          this.actaGoodForm.value.acta = this.cveActa;
          this.time = new Date().toISOString().slice(0, 16);
          this.getExpedient(this.fileNumber);
          // this.getActasByConversion(this.cveActa);
          // this.getStatusDeliveryCveExpendiente(this.cveActa);
          this.actaRecepttionForm.get('respConv').setValue(res.respConv);
          this.actaRecepttionForm.get('testigoOIC').setValue(res.witnessOic);
          this.actaRecepttionForm.get('testigoTwo').setValue(res.witness2);
          this.actaRecepttionForm.get('testigoTree').setValue(res.witness3);

          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);

          subscription.unsubscribe();
        },
      });
  }

  cleanFilter() {
    this.proceedingsConversionForm.reset();
    this.proceedingsConversionForm.updateValueAndValidity();
    this.proceedingsConversionForm.controls['txtSearch'].setValue('');
    // this.searchProcs();
  }
  goBack() {
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        origin: this.screenKey,
        PAR_IDCONV: this.conversion,
      },
    });
  }

  openDialogSelectedManagement() {}

  async getSenderByDetail(params: ListParams) {
    params.take = 20;
    params['order'] = 'DESC';
    const delegationNumber = this.department;
    params['no_delegacion'] = delegationNumber;
    params['search'] = params['search'] ? params['search'] : '';
    this.convertiongoodService.getRegSender(params).subscribe({
      next: data => {
        console.log(data);
        this.senders = new DefaultSelect(data.data, data.count);
        this.isLoadingSender = false;
      },
      error: err => {
        console.log(err);
        this.select = new DefaultSelect([], 0);
        this.isLoadingSender = false;
      },
    });
  }

  changeSender(sender: IRSender) {
    console.log({ sender });
    this.proceedingsConversionForm
      .get('delRemNumber')
      .setValue(sender.no_delegacion);

    this.proceedingsConversionForm
      .get('depRemNumber')
      .setValue(sender.no_departamento);
    //TODO: lov remitente
  }
  async getFromSelect(params: ListParams) {
    const senderUser = this.proceedingsConversionForm.value.sender.usuario;
    params['remitente'] = senderUser;
    this.convertiongoodService.getRegAddressee(params).subscribe(
      data => {
        let result = data.data.map(item => {
          return {
            ...item,
            userAndName: item.usuario + ' - ' + item.nombre,
          };
        });
        this.select = new DefaultSelect(result, data.count);
      },
      () => {
        this.select = new DefaultSelect();
      }
    );
  }
  closeActa() {}

  refreshTableCopies() {
    this.initForm();
  }

  refreshTableGoods() {
    const params = new ListParams();

    params['filter.fileNumber'] =
      this.proceedingsConversionForm.value.noExpedient;
    // this.getGoods1(params);
  }

  getExpedient(id: number) {
    this.expedientService.getById(id).subscribe({
      next: (data: any) => {
        // this.loading = false;
        this.expedient = data;
        this.trasnfer = this.expedient.expTransferNumber;
        this.actaRecepttionForm.value.claveTrans = this.trasnfer;
        // console.log(this.expedient);
        this.getGoodsByStatus(this.fileNumber);
      },
      error: () => console.error('expediente nulo'),
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
            vcScreen: 'FACTDBCONVBIEN',
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
        this.dataTableGood.load([]);
        this.dataTableGood.refresh();
        this.totalItems = 0;
      },
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

  async getActaGood(good: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${good.id}`;
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService.getAllFiltered(params).subscribe({
        next: data => {
          // console.log('data', data);
          this.loading2 = false;
          resolve(true);
        },
        error: error => {
          this.loading2 = false;
          resolve(false);
        },
      });
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

  getAllConvertiones() {
    this.loading = true;
    this.convertiongoodService.getAll().subscribe({
      next: data => {
        this.dataTableGoodsConvertion.load(data.data);
        this.dataTableGoodsConvertion.refresh();
        // this.loading = false;
        this.totalItems = data.count;
        console.log(this.dataTableGoodsConvertion);
      },
      error: error => {
        // this.loading = false;
        // console.log(error);
        // this.dataTableGoodsConvertion.load([]);
        // this.dataTableGoodsConvertion.refresh();
      },
    });
  }

  getQueryParams(name: string) {
    return this.route.snapshot.queryParamMap.get(name);
  }
  convertDataGoods(data: { data: any[] }) {
    const _data = data.data.map((data: any) => {
      return {
        goodId: data.no_bien,
        description: data.descripcion,
        quantity: data.cantidad,
        identifier: data.identificador,
        status: data.estatus,
        proceedingsNumber: data.no_expediente,
        goodClassNumber: data.no_clasif_bien,
        registerNumber: data.no_registro,
        available: data.disponible == 'N' ? true : false,
        selected: this.dataGoodsSelected.has(data.no_bien),
      };
    });
    return _data;
  }

  convertDataGoodsAvailable(data: any) {
    const _data = data.data.map((data: any) => {
      return {
        goodNumber: data.no_bien,
        goods: data.descripcion,
        classify: data.no_clasif_bien,
        registerNumber: data.no_registro,
        available: data.disponible == 'N' ? true : false,
        managementNumber: this.proceedingsConversionForm.value.idConversion,
      };
    });
    return _data;
  }

  getGoods(id: number) {
    this.convertiongoodService.getById(id).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => console.log(error),
    });
  }

  reviewGoodData(dataGoodRes: IDataGoodsTable, count: number, total: number) {
    // this.getGoodStatusDescription(dataGoodRes, count, total);
  }
  async cerrarActa(father: string | number) {
    console.log('this.actasDefault', this.actasDefault);
    console.log('this.conversion', this.conversion);
    if (this.actasDefault != null) {
      if (this.actasDefault.keysProceedings == null) {
        this.alert('warning', 'No Existe Acta para Cerrar', '');
        return;
      }

      if (this.dataRecepcionGood.count() == 0) {
        this.alertInfo(
          'warning',
          'El Acta no tiene ningún Bien asignado, no se puede Cerrar.',
          ''
        );
        return;
      }

      if (this.actasDefault.comptrollerWitness == null) {
        this.alert('warning', 'Indique el Testigo de la Contraloría', '');
        return;
      }

      const toolbar_user = this.authService.decodeToken().preferred_username;
      const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;
      console.log('cadena', cadena);

      if (cadena != 0 && this.userName == toolbar_user) {
        null;
      } else {
        if (this.delete == true) {
          this.alertQuestion('question', '¿Desea Cerrar el Acta?', '').then(
            async question => {
              if (question.isConfirmed) {
                // await this.createDET();
                this.actasDefault.statusProceedings = 'CERRADA';
                delete this.actasDefault.numDelegation1Description;
                delete this.actasDefault.numDelegation2Description;
                delete this.actasDefault.numTransfer_;
                this.proceedingsDeliveryReceptionService
                  .editProceeding(this.actasDefault.id, this.actasDefault)
                  .subscribe({
                    next: async data => {
                      let objConver: any = {
                        id: Number(this.conversion),
                        statusConv: 3,
                        cveActaConv: this.actaRecepttionForm.value.cveActa,
                      };
                      this.convertiongoodService
                        .update(this.conversion, objConver)
                        .subscribe({
                          next: resp => {
                            this.cveActa =
                              this.actaRecepttionForm.value.cveActa;
                            console.log('SIIII', resp);
                          },
                          error: error => {},
                        });
                      // this.loading = false;
                      let obj = {
                        pActaNumber: this.actasDefault.id,
                        pStatusActa: 'CERRADA',
                        pVcScreen: 'FACTDBCONVBIEN',
                        pUser:
                          this.authService.decodeToken().preferred_username,
                      };

                      await this.updateGoodEInsertHistoric(obj);

                      this.alertInfo(
                        'success',
                        'Se Cerró el Acta Correctamente',
                        ''
                      );
                      // this.alert('success', 'Acta cerrada', '');
                      this.disabledBtnCerrar = false;
                      this.disabledBtnActas = false;
                      this.getGoodsByStatus(this.fileNumber);
                      await this.getDetailProceedingsDevollution(
                        this.actasDefault.id
                      );
                      // this.initForm();
                    },
                    error: error => {
                      this.alert(
                        'error',
                        'Ocurrió un Error al Cerrar el Acta',
                        ''
                      );
                      // this.loading = false
                    },
                  });
              }
            }
          );
        } else {
          if (this.delete == false) {
            this.alert(
              'warning',
              'El Usuario no está Autorizado para Cerrar Acta',
              // 'El Usuario no está autorizado para cerrar acta',
              ''
            );
          }
          if (this.delete == null) {
            this.alert(
              'warning',
              'El Usuario no está Autorizado para Cerrar Acta',
              // 'El Usuario no está autorizado para cerrar acta',
              ''
            );
          }
        }
      }
    } else {
      this.alert(
        'warning',
        'No Existe Ningún Acta a Cerrar.',
        // 'El Usuario no está autorizado para cerrar acta',
        ''
      );
    }
  }

  updateGoodEInsertHistoric(good: any) {
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .updateGoodEInsertHistoric(good)
        .subscribe({
          next: (resp: any) => {
            resolve(true);
          },
          error: (error: any) => {
            resolve(false);
          },
        });
    });
  }

  getScreenStatus(good: any) {
    let obj = {
      estatus: good.status,
      vc_pantalla: 'FACTDBCONVBIEN',
    };

    // console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenStatusService.getAllFiltro_(obj).subscribe({
        next: (resp: any) => {
          console.log('ESCR', resp);
          resolve(resp.data[0].statusFinal);
        },
        error: (error: any) => {
          resolve(null);
        },
      });
    });
  }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  async Generar() {
    this.isLoading = true;
    // this.createConversion();
    // this.createConversion();
    await this.updateConversion();
    // this.edit ? this.update() : this.create();
    let params = {
      id_conv: this.conversion,
      id_bien: this.goodFatherNumber,
      DESTYPE: this.origin,
    };
    console.log(params);
    if (this.witnessOic != null) {
      this.siabService
        // .fetchReport('ACTACONVSTES', params)
        .fetchReportBlank('blank')
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    } else {
      this.siabService
        // .fetchReport('ACTACONVCTES', params)
        .fetchReportBlank('blank')
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }
  }
  cleanForm() {
    this.proceedingsConversionForm.reset();
    this.actaRecepttionForm.reset();
    this.actaGoodForm.reset();
  }
  checkSearchMode(searchMode: boolean) {
    this.searchMode = searchMode;
    this.changeDetectorRef.detectChanges();
  }

  search(formData: Partial<IConvertiongood>) {
    this.formData = formData;
    this.changeDetectorRef.detectChanges();
  }

  async selectData(event: { data: IGood; selected: any }) {
    this.selectedRow = event.data;
    console.log(this.selectedRow);
    await this.getStatusGoodService(this.selectedRow.status);
    this.selectedGooods = event.selected;
    this.changeDetectorRef.detectChanges();
  }
  selectActa(data: IActasConversion) {
    this.selectedActa = data;
    console.log(this.selectedRow);
    this.changeDetectorRef.detectChanges();
  }

  searchProcs(provider?: IConvertiongood) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };

    let modalRef = this.modalService.show(
      ProceedingsConversionModalComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any) => {
      console.log(next);
      this.paramsScreen.PAR_IDCONV = next.id;
      console.log(this.paramsScreen.PAR_IDCONV);

      this.initForm();
    });
  }

  getDetail() {
    this.acordionDetail = true;
    // this.actasConvertionCommunicationService.enviarDatos(this.conversion);
  }
  valDeta: boolean = false;
  closeDetail() {
    this.valDeta = !this.valDeta;
    this.acordionDetail = false;
    if (this.valDeta)
      this.actasConvertionCommunicationService.enviarDatos(this.conversion);
  }

  cargarData(binaryExcel: any) {
    this.hijoRef.cargarData(binaryExcel);
  }

  cargueMasive() {
    this.massiveGoodService.cargueMassiveGoodConversion().subscribe({
      next: (data: any) => {
        this.alert(
          'success',
          'Carga Masiva Completada',
          // `Expediente : ${this.fileNumber}`
          ``
        );
        this.getGoodsByStatus(this.fileNumber);
        console.log(data);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  create() {
    // this.loading = true;
    this.mover.emit(this.registro);
    console.log(this.registro);
    this.proceedingsDeliveryReceptionService
      .createDetail(this.createCon)
      .subscribe({
        next: data => {
          if ((data.data.statusProceedings = 'CERRADA')) {
            this.alert('info', 'Acta Está Cerrada', '');
            return;
          }
          // this.loading = false;
          this.handleSuccess();
        },
        error: error => {
          // this.loading = false;
        },
      });
  }

  changeSelection(event: any, id: number) {
    const good = this.dataTableGoodsMap.get(id);
    if (event.target.checked) {
      this.dataGoodsSelected.set(id, good);
    } else {
      this.dataGoodsSelected.delete(id);
    }
  }

  // update() {
  //   this.proceedingsDeliveryReceptionService
  //     .update(this.conversion, this.createCon)
  //     .subscribe({
  //       next: data => {
  //         console.log(data);
  //         // Recorrer todos los registros y actualizar uno por uno
  //         // const records = data;
  //         // for (const item of records) {
  //         //   this.convertiongoodService.updateActa(item, this.createCon).subscribe((response) => {
  //         //     console.log('Registro actualizado:', response);
  //         //   });
  //         // }

  //         // Manejar el éxito de la actualización
  //         this.handleSuccess();
  //       },
  //     });
  // }

  async updateConversion() {
    // this.loading = true;
    // this.loading = true;
    this.convertiongoodService
      .update(this.conversion, this.proceedingsConversionForm.value)
      .subscribe({
        next: data => {
          console.log(data);
          // this.loading = false;
          // this.loading = false;
        },
        error: error => {
          // this.loading = false;
          // this.onLoadToast('error', 'No se actualizaron los datos', '');
          // this.onLoadToast('error', 'No se actualizaron los datos', '');
        },
        // this.alert('success', 'conversión actualizada con éxito', ''),
      });
  }

  changeStatus() {
    // this.loading = true;
    // this.loading = true;
    this.goodService.updateByBody(this.actaRecepttionForm.value).subscribe({
      next: (data: any) => {
        console.log(data);
        // this.loading = false;
      },
      error: error => {
        error;
        // this.loading = false;
      },
    });
  }

  getByIdGood(id: number | string) {
    this.goodService.getById(id).subscribe({
      next: (data: IGoodStatus) => {
        this.statusGoodName = data.goodStatus;
        console.log(this.statusGoodName);
      },
      error: error => {
        console.error('no existe el bien');
      },
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `${this.conversion} creado`, `${message} `);
    // this.loading = false;
    this.onConfirm.emit(true);
  }

  getActas() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.idConversion'] = `$eq:${this.conversion}`;
      this.convertiongoodService
        .getAllGoodsConversions(this.conversion, params)
        .subscribe({
          next: data => {
            let name = data.data[0].authorityName;
            this.actas = data;
            console.log(this.actas);
            resolve(true);
          },
          error: error => {
            // this.authorityName = '';
            resolve(true);
          },
        });
    });
  }

  goStatus() {
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {
        origin: this.screenKey,
        PAR_IDCONV: this.conversion,
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

    let modalRef = this.modalService.show(FindActaGoodComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      if (next) {
        this.alert(
          'success',
          'Se Cargó la Información del Acta',
          next.keysProceedings
        );
      }

      this.acordionDetail = false;
      this.actasDefault = next;
      this.fCreate = this.datePipe.transform(
        next.dateElaborationReceipt,
        'dd/MM/yyyy'
      );
      this.statusConv = next.statusProceedings;
      if (this.statusConv == 'CERRADA') {
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

  getActasByConversion(cve: string) {
    this.convertiongoodService.getActasByConvertion(cve).subscribe({
      next: (data: IActasConversion) => {
        this.to = this.datePipe.transform(
          this.actaRecepttionForm.controls['mes'].value,
          'MM/yyyy'
        );
        this.annio = this.datePipe.transform(
          this.actaRecepttionForm.controls['anio'].value,
          'mm/yyyy'
        );
        this.actaRecepttionForm.setValue({
          acta: this.conversion,
          type: this.type,
          administra: data.administra,
          // ejecuta: data.ejecuta,
          folio: data.folio_universal,
          consec: data.tipo_acta,
          claveTrans: this.trasnfer,
          cveActa: data.cve_acta_conv,
          mes: this.to,
          cveReceived: '',
          anio: this.annio,
          direccion: '',
          observaciones: '',
          responsable: '',
        });

        console.log(this.actaRecepttionForm.value);
      },
    });
  }

  savActa() {
    // this.loading = false;
    // this.changeStatus();
    this.alert('success', 'Acta Actualizada Correctamente', '');
  }
  moverRegistro(registro: any, origen: any[], destino: any[]) {
    const index = origen.indexOf(registro);
    if (index >= 0) {
      origen.splice(index, 1);
      destino.push(registro);
    }
  }

  moverRegistros() {
    registrosMovidos.forEach(registro => {
      this.moverRegistro(registro, this.bienes, this.rececption);
      registrosMovidos.push(registro);
    });
  }

  selectProceedings(event: any) {
    console.log(event);
  }
  selectGoods(event: any) {
    console.log(event);
  }
  rowSelected2(event: any) {
    console.log(event);
  }
  deleteGoodActa(event: any) {
    console.log(event);
  }
  toggleDisabled() {}
  // ------------------------------------------------------------------------------------------------ //
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;
  async addSelect() {
    if (this.selectedGooods.length > 0) {
      if (this.actasDefault == null) {
        this.alert(
          'warning',
          'No Existe un Acta en la cual Asignar el Bien.',
          'Debe capturar un acta.'
        );
        return;
      } else {
        if (this.statusConv == 'CERRADA') {
          this.alert(
            'warning',
            'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
            ''
          );
          return;
        } else {
          console.log('aaa', this.goods);

          let result = this.selectedGooods.map(async (good: any) => {
            if (good.di_acta != null) {
              this.alert(
                'warning',
                `Ese Bien ya se Encuentra en el Acta ${good.di_acta}`,
                'Debe Capturar un Acta.'
              );
            } else if (good.di_disponible == 'N') {
              this.onLoadToast(
                'warning',
                `El Bien ${good.id} tiene un Estatus Inválido para ser Asignado a algún Acta`
              );
              return;
            } else {
              console.log('GOOD', good);
              this.loading2 = true;

              if (!this.dataRecepcion.some((v: any) => v === good)) {
                let indexGood = this.dataTableGood_.findIndex(
                  _good => _good.id == good.id
                );
                console.log('indexGood', indexGood);
                // if (indexGood != -1)
                // this.dataTableGood_[indexGood].di_disponible = 'N';

                await this.createDET(good);
                // this.dataTableGood_ = this.bienes;
                // this.dataRecepcion.push(good);
                // this.dataRecepcion = [...this.dataRecepcion];
              }
            }
          });

          Promise.all(result).then(async item => {
            this.getGoodsByStatus(this.fileNumber);
            await this.getDetailProceedingsDevollution(this.actasDefault.id);
          });
        }
      }
    } else {
      this.alert('warning', 'Seleccione Primero el Bien a Asignar.', '');
    }
  }

  // OBTENER DATOS DE LA TABLA DET
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

  addAll() {
    if (this.actasDefault == null) {
      this.alert(
        'warning',
        'No existe un Acta en la cual Asignar el Bien.',
        'Debe capturar un acta.'
      );
      return;
    } else {
      if (this.statusConv == 'CERRADA') {
        this.alert(
          'warning',
          'El Acta ya esta Cerrada, no puede Realizar Modificaciones a esta',
          ''
        );
        return;
      } else {
        if (this.dataTableGood_.length > 0) {
          this.loading2 = true;
          let result = this.dataTableGood_.map(async _g => {
            console.log(_g);

            if (_g.di_disponible == 'N') {
              return;
            }

            if (_g.di_disponible == 'S') {
              _g.di_disponible = 'N';
              let valid = this.dataRecepcion.some(
                goodV => goodV.numberGood == _g.id
              );

              console.log('valid', valid);
              await this.createDET(_g);
              if (!valid) {
                // this.dataRecepcion = [...this.dataRecepcion, _g];
              }
            }
          });

          Promise.all(result).then(async item => {
            this.getGoodsByStatus(this.fileNumber);
            await this.getDetailProceedingsDevollution(this.actasDefault.id);
          });
        }
      }
    }
  }

  removeSelect() {
    if (this.dataRecepcion.length == 0) {
      return;
    }
    if (this.statusConv == 'CERRADA') {
      this.alert(
        'warning',
        'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
        ''
      );
      return;
    } else {
      if (this.actasDefault == null) {
        this.alert(
          'warning',
          'No Existe un Acta en la cual Asignar el Bien.',
          'Debe Capturar un Acta.'
        );
        return;
      } else if (this.selectedGooodsValid.length == 0) {
        this.alert(
          'warning',
          'Debe Seleccionar un Bien que Forme Parte del Acta Primero',
          'Debe Capturar un Acta.'
        );
        return;
      } else {
        this.loading2 = true;
        if (this.selectedGooodsValid.length > 0) {
          // this.goods = this.goods.concat(this.selectedGooodsValid);
          let result = this.selectedGooodsValid.map(async good => {
            console.log('good', good);
            this.dataRecepcion = this.dataRecepcion.filter(
              (_good: any) => _good.id != good.id
            );
            let index = this.dataTableGood_.findIndex(
              g => g.id === good.numberGood
            );
            // if (index != -1) {
            //   this.dataTableGood_[index].di_disponible = 'S';
            //   this.dataTableGood_[index].acta = null;
            // }
            await this.deleteDET(good);
            // this.selectedGooods = [];
          });

          Promise.all(result).then(async item => {
            this.getGoodsByStatus(this.fileNumber);
            await this.getDetailProceedingsDevollution(this.actasDefault.id);
          });
          this.selectedGooodsValid = [];
        }
      }
    }
  }

  removeAll() {
    if (this.actasDefault == null) {
      this.alert(
        'warning',
        'No Existe un Acta en la cual Asignar el Bien.',
        'Debe Capturar un Acta.'
      );
      return;
    } else {
      if (this.statusConv == 'CERRADA') {
        this.alert(
          'warning',
          'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
          ''
        );
        return;
      } else {
        if (this.dataRecepcion.length > 0) {
          this.dataRecepcion.forEach(good => {
            console.log('this.dataRecepcion', this.dataRecepcion);
            this.dataRecepcion = this.dataRecepcion.filter(
              _good => _good.id != good.id
            );
            let index = this.dataTableGood_.findIndex(g => g.id === good.id);
            // if (index != -1) {
            //   if (this.dataTableGood_[index].est_disponible) {
            //     this.dataTableGood_[index].est_disponible = 'S';
            //   }

            //   if (this.dataTableGood_[index].di_disponible) {
            //     this.dataTableGood_[index].di_disponible = 'S';
            //   }
            // }
          });
          this.goodsValid = [];
        }
      }
    }
  }

  rowsSelected(event: any) {
    this.selectedGooodsValid = event.selected;
  }

  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      numberProceedings: this.actasDefault.id,
      numberGood: good.id,
      amount: good.quantity,
      received: null,
      approvedXAdmon: null,
      approvedDateXAdmon: null,
      approvedUserXAdmon: null,
      dateIndicatesUserApproval: null,
      numberRegister: null,
      reviewIndft: null,
      correctIndft: null,
      idftUser: null,
      idftDate: null,
      numDelegationIndft: null,
      yearIndft: null,
      monthIndft: null,
      idftDateHc: null,
      packageNumber: null,
      exchangeValue: null,
    };

    await this.saveGoodActas(obj);

    // let obj_: any = {
    //   id: good.id,
    //   goodId: good.id,
    //   status: await this.getScreenStatus(good),
    // };
    // // UPDATE BIENES
    // await this.updateGood(obj_);

    // // INSERT HISTORIC
    // await this.saveHistoric(obj_);
    // });

    // }
  }

  async saveGoodActas(body: any) {
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService.addGoodToProceedings(body).subscribe({
        next: data => {
          // this.alert('success', 'Bien agregado correctamente', '');
          resolve(true);
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }

  async deleteDET(good: any) {
    // if (this.selectedGooodsValid.length > 0) {
    //   this.loading2 = true;
    //   let result = this.selectedGooodsValid.map(async good => {

    const valid: any = await this.getGoodsDelete(good.numberGood);
    if (valid != null) {
      let obj: any = {
        numberGood: good.numberGood,
        numberProceedings: this.actasDefault.id,
      };

      await this.deleteDetailProcee(obj);
    }

    // let obj_: any = {
    //   id: good.id,
    //   goodId: good.id,
    //   status: await this.getScreenStatus(good),
    // };
    // // UPDATE BIENES
    // await this.updateGood(obj_);

    // // INSERT HISTORIC
    // await this.saveHistoric(obj_);
    //   });

    //   Promise.all(result).then(async (item) => {
    //     await this.getDetailProceedingsDevollution(this.actasDefault.id);
    //   })
    // }
  }

  async deleteDetailProcee(params: any) {
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService.deleteDetailProcee(params).subscribe({
        next: data => {
          console.log('data', data);
          // this.loading2 = false;
          resolve(true);
        },
        error: error => {
          // this.loading2 = false;
          resolve(false);
        },
      });
    });
  }

  async saveHistoric(good: any) {
    const historyGood: IHistoryGood = {
      propertyNum: good.id,
      status: good.status,
      changeDate: new Date(),
      userChange: this.authService.decodeToken().preferred_username,
      statusChangeProgram: null,
      reasonForChange: null,
      registryNum: null,
      extDomProcess: null,
    };

    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        // this.loading = false;
      },
      error: error => {
        // this.loading = false;
      },
    });
  }

  async getGoodsDelete(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.goodService.getByExpedient_(this.fileNumber, params).subscribe({
        next: data => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getStatusGoodService(status: any) {
    this.statusGoodService.getById(status).subscribe({
      next: async (resp: any) => {
        console.log('resp.data', resp);
        this.statusGood_ = resp.description;
        // this.statusGoodForm.get('statusGood').setValue(resp.description)
      },
      error: err => {
        this.statusGood_ = '';
        // this.statusGoodForm.get('statusGood').setValue('')
      },
    });
  }

  agregarActa() {
    const responsable = this.actaRecepttionForm.get('respConv').value;
    const testigoTwo = this.actaRecepttionForm.get('testigoTwo').value;
    const testigoTree = this.actaRecepttionForm.get('testigoTree').value;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      delegationToolbar: this.delegationToolbar,
      fileNumber: this.fileNumber,
      witnessOic: this.witnessOic,
      expedient: this.expedient,
      testigoTree,
      responsable,
      testigoTwo,
    };

    let modalRef = this.modalService.show(CreateActaComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.alert(
          'success',
          'Se Cargó la Información del Acta',
          next.keysProceedings
        );
      }

      console.log(next);
      this.totalItems2 = 0;
      this.acordionDetail = false;
      this.actasDefault = next;
      // this.fCreate = this.datePipe.transform(next.dateElaborationReceipt,'dd/MM/yyyy');
      this.statusConv = next.statusProceedings;
      if (this.statusConv == 'CERRADA') {
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
      // this.to = this.datePipe.transform(
      //   this.actaRecepttionForm.controls['mes'].value,
      //   'MM/yyyy'
      // );
      // this.annio = this.datePipe.transform(
      //   this.actaRecepttionForm.controls['anio'].value,
      //   'MM/yyyy'
      // );
      await this.getDetailProceedingsDevollution(this.actasDefault.id);
    });
    console.log(this.authService.decodeToken());
  }

  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter(
      'id',
      this.authService.decodeToken().preferred_username,
      SearchFilter.EQ
    );
    return this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: (value: any) => {
        const data = value.data[0].usuario;
        if (data) this.delegationToolbar = data.delegationNumber;

        console.log('SI', value);
      },
      error(err) {
        console.log('NO');
      },
    });
  }

  cleanActa() {
    this.actasDefault = null;
    this.actaRecepttionForm.get('cveActa').setValue('');
    this.actaRecepttionForm.get('direccion').setValue('');
    this.dataRecepcionGood.load([]);
    this.dataRecepcionGood.refresh();
    this.totalItems2 = 0;
  }

  actualizarActa() {
    if (!this.actasDefault) {
      this.alertInfo('warning', 'Debe Seleccionar un Acta', '');
      return;
    }
    if (this.actasDefault.statusProceedings == 'CERRADA') {
      this.alertInfo('warning', 'No puede Actualizar un Acta Cerrada', '');
      return;
    }
    this.actasDefault.address = this.actaRecepttionForm.get('direccion').value;
    delete this.actasDefault.numDelegation1Description;
    delete this.actasDefault.numDelegation2Description;
    delete this.actasDefault.numTransfer_;
    this.proceedingsDeliveryReceptionService
      .editProceeding(this.actasDefault.id, this.actasDefault)
      .subscribe({
        next: async data => {
          this.alertInfo('success', 'Se Actualizó el Acta Correctamente', '');
        },
        error: error => {
          this.alert('error', 'Ocurrió un Error al Actualizar el Acta', '');
          // this.loading = false
        },
      });
  }

  ejecutarFuncion() {
    console.log('SIO');
    this.cleanActa();
    // Lógica de la función que se ejecutará sin cerrar el modal
  }
}

export interface IParamsProceedingsParamsActasConvertion {
  PAR_IDCONV: number;
}
export interface IInitFormProceedingsBody {
  PAR_IDCONV: number;
}

export interface IParamsProceedingsParamsDerivationGoods {
  PAR_IDCONV: number;
}
export interface IRSender {
  no_delegacion: string;
  no_departamento: string;
  no_subdelegacion: string;
  nombre: string;
  usuario: string;
}
