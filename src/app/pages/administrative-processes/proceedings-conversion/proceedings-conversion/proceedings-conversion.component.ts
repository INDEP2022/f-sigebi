import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
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
import { BehaviorSubject, takeUntil } from 'rxjs';
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

import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';

import { IActasConversion } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FlyersService } from 'src/app/pages/documents-reception/flyers/services/flyers.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ScanningFoilComponent } from '../../payment-claim-process/scanning-foil/scanning-foil.component';

import { FindActaGoodComponent } from '../find-acta-good/find-acta-good.component';
import {
  GooByExpediente,
  IDataGoodsTable,
} from '../proceedings-conversion-column';
import { ProceedingsConversionModalComponent } from '../proceedings-conversion-modal/proceedings-conversion-modal.component';
import { ActasConvertionCommunicationService } from '../services/proceedings-conversionn';
import {
  COPY,
  GOODSEXPEDIENT_COLUMNS_GOODS,
  IConverGoodCreate,
  IGoodStatus,
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
  disabledImport: boolean = true;
  edit = false;
  updateRe = false;
  delete = false;
  dataA: any = 0;
  dataD: any = 0;
  time: string = '';
  confirmSearch: boolean = false;
  preAver = '';
  criCase = '';
  createCon: IConverGoodCreate;
  test: any;
  to: string = '';
  annio: string = '';
  bienes: IGood[] = [];
  statusGoodName: string = '';
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
  selectedRow: IConvertiongood;
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
  actaGoodForm: FormGroup;
  dataActa: LocalDataSource = new LocalDataSource();
  dataGoodTable: LocalDataSource = new LocalDataSource();
  paramsGoodsType: number = 0;
  loadingGoods = false;
  select: any;
  goods: IGood[] = [];
  expedient: IExpedient;
  columnFilters: any = [];
  isAllDisabled = false;
  cveActa: string = '';
  fileNumber: number = 0;
  rececption: IProceedingDeliveryReception;
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
  screenKey = 'FACTDBCONVBIEN';
  dataTableGoodsConvertion: LocalDataSource = new LocalDataSource();
  copyActa: any[] = [];
  dataGoodFilter: IGood[] = [];
  dataGood: GooByExpediente[] = [];
  dataTableGoodsJobManagement: IGoodJobManagement[] = [];
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @ViewChild('tableDocs') tableDocs: Ng2SmartTableComponent;
  @ViewChild('modal') modal: ProceedingsConversionModalComponent;
  @ViewChild('hijoRef', { static: false }) hijoRef: ScanningFoilComponent;
  @ViewChild('myInput') inputEl: ElementRef;
  @Output() onConfirm = new EventEmitter<any>();

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
  filtroPersonaExt: ICopiesJobManagementDto[] = [];
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  witnessOic: string = '';
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'hh:mm',
  };
  acordionDetail: boolean = false;
  dataTableGood: LocalDataSource = new LocalDataSource();

  constructor(
    private authService: AuthService,
    protected flyerService: FlyersService,
    private excelService: ExcelService,
    private fb: FormBuilder,
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
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.procs = new LocalDataSource();
    this.validPermisos = !this.validPermisos;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: { ...GOODSEXPEDIENT_COLUMNS_GOODS },
      rowClassFunction: (row: any) => {
        if (row.data.status === 'CNE') {
          return 'bg-success text-white';
        } else if (row.data.status === 'RRE' || row.data.status === 'VXR') {
          return 'bg-dark text-white';
        } else {
          return 'bg-success text-white';
        }
      },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: { ...COPY },
    };
  }

  ngOnInit(): void {
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
    this.dataGoodTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'goodId' ||
            filter.field == 'description' ||
            filter.field == 'quantity' ||
            filter.field == 'acta'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodsByStatus(this.fileNumber);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByStatus(this.fileNumber));
  }

  private prepareForm() {
    this.department = this.authService.decodeToken().department;
    // this.userTracker(
    //   this.screenKey,
    //   this.authService.decodeToken().preferred_username
    // );
    // console.log(this.userTracker);
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

      respConv: [null, [Validators.pattern(STRING_PATTERN)]],
      respCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      folioUniversalAsoc: [null, [Validators.pattern(STRING_PATTERN)]],
      testigoTwo: [null, [Validators.pattern(STRING_PATTERN)]],
      testigoTree: [null, [Validators.pattern(STRING_PATTERN)]],
      testigoOIC: [null, [Validators.pattern(STRING_PATTERN)]],
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
      ejecuta: [null],
      anio: [null],
      mes: [null],
      cveActa: [null],
      direccion: [null],
      observaciones: [null],
      responsable: [null],
      parrafo1: [null],
      parrafo2: [null],
      parrafo3: [null],
    });
  }

  private goodForm() {
    this.actaGoodForm = this.fb.group({
      goodId: [null],
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
              'No tiene permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá ingresar',
              ''
            );
            return;
          }
        });
      },
      error: (error: any) => {
        this.alert(
          'info',
          'No tiene permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá ingresar',
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
          this.loading = false;
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
          // this.getAllConvertiones();
          this.actaRecepttionForm.value.cveActa = this.cveActa;
          // this.getActasReception(this.cveActa);
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
        this.loading = false;
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
    this.goodService.getByExpedient(id).subscribe({
      next: data => {
        this.bienes = data.data;
        this.loading = false;
        console.log(this.bienes);
        this.dataTableGood.load(this.bienes);
        this.dataTableGood.refresh();
        // Define la función rowClassFunction para cambiar el color de las filas en función del estado de los bienes
        this.totalItems = data.count;
        console.log(this.dataGood);
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  getAllConvertiones() {
    this.loading = true;
    this.convertiongoodService.getAll().subscribe({
      next: data => {
        this.dataTableGoodsConvertion.load(data.data);
        this.dataTableGoodsConvertion.refresh();
        this.loading = false;
        this.totalItems = data.count;
        console.log(this.dataTableGoodsConvertion);
      },
      error: error => {
        this.loading = false;
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
    if (this.conversion == null) {
      this.alert('warning', 'No existe acta para cerrar', '');
      return;
    }

    const toolbar_user = this.authService.decodeToken().preferred_username;
    const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;
    console.log('cadena', cadena);
    if (cadena != 0 && this.userName == toolbar_user) {
      null;
    } else {
      if (this.delete == true) {
        this.alertQuestion(
          'warning',
          'Eliminar',
          'Desea eliminar este registro?'
        ).then(question => {
          if (question.isConfirmed) {
            this.expedientService.getDeleteTeacher(father).subscribe({
              next: data => {
                this.loading = false;
                this.alert('success', 'Acta cerrada', '');
                this.alert('success', 'Acta cerrada', '');
                this.initForm();
              },
              error: error => {
                this.loading = false;
              },
            });
          }
        });
      } else {
        if (this.delete == false) {
          this.alert(
            'warning',
            'El Usuario no está autorizado para cerrar acta',
            'El Usuario no está autorizado para cerrar acta',
            ''
          );
        }
        if (this.delete == null) {
          this.alert(
            'warning',
            'El Usuario no está autorizado para cerrar acta',
            'El Usuario no está autorizado para cerrar acta',
            ''
          );
        }
      }
    }
  }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  Generar() {
    this.isLoading = true;
    // this.createConversion();
    // this.createConversion();
    this.updateConversion();
    this.edit ? this.update() : this.create();
    this.edit ? this.update() : this.create();
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
  }
  checkSearchMode(searchMode: boolean) {
    this.searchMode = searchMode;
    this.changeDetectorRef.detectChanges();
  }

  search(formData: Partial<IConvertiongood>) {
    this.formData = formData;
    this.changeDetectorRef.detectChanges();
  }

  selectData(data: IConvertiongood) {
    this.selectedRow = data;
    console.log(this.selectedRow);
    this.changeDetectorRef.detectChanges();
    let params: IConverGoodCreate = {
      goodNumber: this.conversion,
      proceedingNumber: this.fileNumber,
    };
    console.log(params);
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
    this.actasConvertionCommunicationService.enviarDatos(this.conversion);
  }
  closeDetail() {
    this.acordionDetail = false;
  }

  cargarData(binaryExcel: any) {
    this.hijoRef.cargarData(binaryExcel);
  }

  cargueMasive() {
    this.massiveGoodService.cargueMassiveGoodConversion().subscribe({
      next: (data: any) => {
        this.alert(
          'success',
          'Carga masiva completada con éxito',
          `Expediente : ${this.fileNumber}`
        );
        console.log(data);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getActasReception(id: string | number) {
    this.loading = true;
    this.proceedingsDeliveryReceptionService.getStatusConversion(id).subscribe({
      next: (data: any) => {
        this.loading = false;
        console.log(data);
        this.dataGoodTable.load(data);
        this.dataGoodTable.refresh();
      },
      error: error => {
        // this.dataGoodTable.load([]);
        // this.dataGoodTable.refresh();
        this.loading = false;
      },
    });
  }

  create() {
    this.loading = true;
    this.convertiongoodService.createActa(this.createCon).subscribe({
      next: data => {
        this.loading = false;
        this.handleSuccess();
      },
      error: error => {
        this.loading = false;
        this.alert('error', 'Ya el bien está agregado al acta', '');
      },
    });
  }
  selectedRadio: string;

  changeSelection(event: any, id: number) {
    const good = this.dataTableGoodsMap.get(id);
    if (event.target.checked) {
      this.dataGoodsSelected.set(id, good);
    } else {
      this.dataGoodsSelected.delete(id);
    }
  }

  update() {
    this.convertiongoodService
      .updateActa(this.conversion, this.createCon)
      .subscribe({
        next: data => {
          console.log(data);
          // Recorrer todos los registros y actualizar uno por uno
          // const records = data;
          // for (const item of records) {
          //   this.convertiongoodService.updateActa(item, this.createCon).subscribe((response) => {
          //     console.log('Registro actualizado:', response);
          //   });
          // }

          // Manejar el éxito de la actualización
          this.handleSuccess();
        },
      });
  }

  updateConversion() {
    this.loading = true;
    this.loading = true;
    this.convertiongoodService
      .update(this.conversion, this.proceedingsConversionForm.value)
      .subscribe({
        next: data => {
          console.log(data);
          this.loading = false;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          // this.onLoadToast('error', 'No se actualizaron los datos', '');
          // this.onLoadToast('error', 'No se actualizaron los datos', '');
        },
        // this.alert('success', 'conversión actualizada con éxito', ''),
      });
  }

  changeStatus(good: string) {
    this.loading = true;
    this.goodprocessService.updateGoodXGoodNumber(good).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loading = false;
        this.loading = false;
      },
      error: error => {
        error;
        this.loading = false;
        this.loading = false;
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
    this.loading = false;
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
  searchActas(actas?: IActasConversion) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      actas,
    };

    let modalRef = this.modalService.show(FindActaGoodComponent, modalConfig);
    modalRef.content.onSave.subscribe((next: any) => {
      console.log(next);
      this.to = this.datePipe.transform(
        this.actaRecepttionForm.controls['mes'].value,
        'MM'
      );
      this.annio = this.datePipe.transform(
        this.actaRecepttionForm.controls['anio'].value,
        'yyyy'
      );
      this.actaRecepttionForm.setValue({
        acta: this.conversion,
        administra: next.administra,
        ejecuta: next.ejecuta,
        consec: next.folio_universal,
        type: this.type,
        claveTrans: this.trasnfer,
        cveActa: next.cve_acta_conv,
        mes: this.to,
        cveReceived: '',
        anio: this.annio,
        direccion: '',
        observaciones: '',
        responsable: '',
        parrafo1: next.parrafo1,
        parrafo2: next.parrafo2,
        parrafo3: next.parrafo3,
      });
      // this.getActasByConversion(next.cve_acta_conv);
    });
  }

  getActasByConversion(cve: string) {
    this.convertiongoodService.getActasByConvertion(cve).subscribe({
      next: (data: IActasConversion) => {
        this.to = this.datePipe.transform(
          this.actaRecepttionForm.controls['mes'].value,
          'MM'
        );
        this.annio = this.datePipe.transform(
          this.actaRecepttionForm.controls['anio'].value,
          'yyyy'
        );
        this.actaRecepttionForm.setValue({
          acta: this.conversion,
          type: this.type,
          administra: data.administra,
          ejecuta: data.ejecuta,
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
      },
    });
  }

  savActa() {
    this.alert('success', 'conversion actualizada', '');
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
