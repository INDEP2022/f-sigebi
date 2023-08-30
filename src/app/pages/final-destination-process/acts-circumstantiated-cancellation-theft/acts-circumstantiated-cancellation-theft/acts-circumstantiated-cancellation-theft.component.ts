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
import { format } from 'date-fns';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';

import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  skip,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';

import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
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
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import * as XLSX from 'xlsx';
import {
  COPY,
  IDataGoodsTable,
  RELATED_FOLIO_COLUMNS,
} from '../acts-cir-columns';
import { CreateActaComponent } from '../create-acta/create-acta.component';
import { FindActaComponent } from '../find-acta/find-acta.component';
import { FindAllExpedientComponent } from '../find-all-expedient/find-all-expedient.component';
//import { IExpedient } from 'C:/indep/f-sigebi/src/app/core/models/ms-expedient/expedient';

import { IUpdateManagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ModalScanningFoilComponent } from '../modal-scanning-foil/modal-scanning-foil.component';

export type IGoodAndAvailable = IGood & {
  available: boolean;
  selected: boolean;
};

@Component({
  selector: 'app-acts-circumstantiated-cancellation-theft',
  templateUrl: './acts-circumstantiated-cancellation-theft.component.html',
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
export class ActsCircumstantiatedCancellationTheftComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  selectedRow: IGood;
  statusGood_: any;
  formTable1: FormGroup;
  statusInicial: string = 'RFI';
  statusFinal: string = 'RFP';
  formFind: FormGroup;
  origin: string = '';
  origin3: string = '';
  loadingExcel: boolean = true;
  selectedGood: IGoodAndAvailable;
  totalItems2: number = 0;
  loadDetail: number = 0;
  updateReg: IUpdateManagement;
  dictationData: IDictation;
  loading2: boolean = false;
  goods: string;
  origin2: string = '';
  formScan: FormGroup;
  delete: boolean = false;
  dataUserLogged: any;
  bienesLoading: boolean = false;
  formTable2: FormGroup;
  witnessOic: any;
  loadingBienes: boolean = true;
  actaRecepttionForm: FormGroup;
  validPermisos: boolean = true;
  goodFormFormGroup: FormGroup;
  dataTableGoods: IGoodAndAvailable[] = [];
  paramsScreen: IParamsActaC = {
    origin: '',
    P_GEST_OK: '',
    P_NO_TRAMITE: '',
    folio: '',
    acta: '',
  };
  validateGoods: boolean = false;
  disabledBtnImage: boolean = false;
  disabledBtnImprimir: boolean = false;
  disabledBtnEscaneo: boolean = false;
  disabledBtnReplicar: boolean = false;
  //disabledBtnCerrar: boolean = true;
  showScanForm: boolean = true;
  ocultarPaginado: boolean = false;
  transfer: number = 0;
  dataRecepcion: any;
  disabledBtnActas: boolean = true;
  actaGoodForm: FormGroup;
  formTag: FormGroup;
  actaReception: IProceduremanagement;
  gTramite: IProceduremanagement;
  statusCanc: string = '';
  expedient: IExpedient;
  validateEx: boolean = true;
  wheelNumber: number = 0;
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
  // data1 = EXAMPLE_DATA1;
  // data2 = EXAMPLE_DATA2;
  aprevia: string = '';
  causa: string = '';
  annio: string = '';
  dateToday = new Date();
  noExpediente: number = 0;
  fileNumber: number;
  columnFilters: any = [];
  columnFilters2: any = [];
  dataTableGood_: any[] = [];
  cveActa: string = '';
  id_acta: number;
  to: string = '';
  from: string = '';
  time = new Date();
  dateElaboration: string = '';
  dataTableGood: LocalDataSource = new LocalDataSource();
  bienes: IGood[] = [];
  //folioScan: number;
  consec: string | number;
  loadingDoc: boolean = false;
  invoiceDetailsForm: ModelForm<any>;
  dataDelivery: any[] = [];
  files: any;
  userdelegacion: any;
  userDepartament: any;
  folioBoool: boolean = false;
  authorityNumber: any;
  Exportdate: boolean = false;

  data1: any;

  contador: number = 0;
  vTotalB: string = '';
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @ViewChild('tableDocs') tableDocs: Ng2SmartTableComponent;
  @ViewChild('myInput') inputEl: ElementRef;
  @Output() onConfirm = new EventEmitter<any>();
  @Input() registro: any;
  @Output() mover = new EventEmitter();

  dataTableGoodsMap = new Map<number, IGoodAndAvailable>();
  dataGoodsSelected = new Map<number, IGoodAndAvailable>();
  constructor(
    private fb: FormBuilder,
    private fileBrowserService: FileBrowserService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private documentsService: DocumentsService,
    private screenStatusService: ScreenStatusService,
    private excelService: ExcelService,
    private procedureManagementService: ProcedureManagementService,
    protected modalService: BsModalService,
    private GoodprocessService_: GoodprocessService,
    private proceedingsService: ProceedingsService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private statusGoodService: StatusGoodService,
    private changeDetectorRef: ChangeDetectorRef,
    private jasperService: SiabService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private documentsForDictumService: DocumentsForDictumService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    // this.settings = { ...this.settings, actions: false };
    // this.settings.columns = COLUMNS1;
    // this.settings2 = { ...this.settings, actions: false };
    // this.settings2.columns = COLUMNS2;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.consec = params['folioScan'] ? Number(params['folioScan']) : null;
        this.fileNumber = params['expedient']
          ? Number(params['expedient'])
          : null;
        this.id_acta = params['acta'] ? Number(params['acta']) : null;
      });

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
          valuePrepareFunction: (cell: any, row: any) => {
            return row.keysProceedings;
          },
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
      // selectedRowIndex: -1,
      // mode: 'external',
      columns: {
        ...COPY,
      },
      rowClassFunction: (row: any) => {
        return 'bg-light text-black';
      },
    };
  }

  ngOnInit(): void {
    this.showScanForm = true;
    this.prepareScan();
    const token = this.authService.decodeToken();
    console.log(token);
    this.dataUserLogged = token;
    this.initFormPostGetUserData();
    // this.actaReception = this.actasDefault;
    this.goodForm();
    this.actaForm();
    this.formFolio();

    this.dateElaboration = this.datePipe.transform(this.time, 'dd/MM/yyyy');

    this.dataTableGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        // console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              amount: () => (searchFilter = SearchFilter.EQ),
              minutesKey: () => (searchFilter = SearchFilter.ILIKE),
              status: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              // // console.log(
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
        // console.log('SI');
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

  generarDatosDesdeUltimosCincoDigitos(
    claveActa: string
  ): { anio: number; mes: string } | null {
    // Verificar que la longitud de la clave sea la esperada
    if (claveActa.length < 5) {
      return null; // Clave no válida
    }

    // Obtener los últimos cinco dígitos de la clave
    const ultimosCincoDigitos = claveActa.slice(-5);

    // Obtener el año y el mes a partir de los últimos cinco dígitos
    const anio = parseInt(ultimosCincoDigitos.substring(0, 2), 10);
    const mesNumero = parseInt(ultimosCincoDigitos.substring(3, 5), 10);

    // Validar los valores obtenidos
    if (
      isNaN(anio) ||
      isNaN(mesNumero) ||
      anio < 0 ||
      mesNumero < 1 ||
      mesNumero > 12
    ) {
      return null; // Valores no válidos
    }

    const mesesTexto = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const mesTexto = mesesTexto[mesNumero - 1]; // Restamos 1 porque los meses en el array comienzan desde 0

    // Obtener el año completo basado en el siglo actual
    const fechaActual = new Date();
    const sigloActual = Math.floor(fechaActual.getFullYear() / 100) * 100;
    const anioCompleto = anio < 100 ? sigloActual + anio : anio;

    this.actaRecepttionForm.patchValue({
      anio: anioCompleto,
      mes: mesTexto,
    });

    return { anio: anioCompleto, mes: mesTexto };
  }

  // MAPEO o LLAMAR DATOS DESPUES DE ESCANEAR
  formFolio() {
    console.log('formFolio');
    this.formScan.patchValue({
      scanningFoli: this.consec,
    });
    this.actaRecepttionForm.patchValue({
      type: this.id_acta,
    });

    if (this.fileNumber != null) {
      console.log('ENTRA -->');
      this.getGoodsByStatus(this.fileNumber);
      //this.getDetailProceedingsDevollution(this.fileNumber);
      this.afterScanning();

      this.afterScanningExpedient();
      this.disabledBtnReplicar = true;
    }
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
  prepareScan() {
    this.formScan = this.fb.group({
      scanningFoli: [
        { value: '', disabled: false },
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(11)],
      ],
    });
  }

  private actaForm() {
    this.actaRecepttionForm = this.fb.group({
      acta: [null],
      type: [null],
      claveTrans: [null],
      direccion: [null],
      administra: [null],
      cveReceived: [null],
      consec: [null],
      fechaCaptura: [null],
      anio: [null],
      mes: [null],
      receive: [null],
      ident: [null],
      cveActa: [null],
      observaciones: [null],
      testigoOIC: [null],
      testigoOne: [null],
      testigoTree: [null],
      respConv: [null],
      parrafo1: [null],
      parrafo2: [null],
      parrafo3: [null],
      elaboradate: [null],
      fechaact: [null],
      fechacap: [null],
    });
  }

  goodForm() {
    this.actaGoodForm = this.fb.group({
      goodId: [null],
      statusGood: [null],
    });
  }
  onSubmit() {}

  search(event: any) {
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
        this.loadingExpedient = false;
        this.loadingExpedient = false;
        this.response = !this.response;
        this.validateEx = true;
        this.expedient = data;
        this.fileNumber = Number(this.expedient.id);
        this.fileNumber = Number(this.expedient.id);
        this.aprevia = this.expedient.preliminaryInquiry;
        this.causa = this.expedient.criminalCase;
        this.transfer = this.expedient.transferNumber;

        this.validateGoods = true;
        console.log('this.expedient ', this.expedient);
        console.log('this.causa ', this.expedient.criminalCase);

        // this.actaRecepttionForm.get('elabDate').setValue(this.expedient.insertDate);

        this.authorityNumber = this.expedient.authorityNumber;
        // Mapeo de datos
        this.actaRecepttionForm
          .get('fechaCaptura')
          .setValue(this.expedient.insertionDatehc);
        this.actaRecepttionForm
          .get('claveTrans')
          .setValue(this.expedient.authorityNumber);
        this.actaRecepttionForm
          .get('ident')
          .setValue(this.expedient.identifier);
        this.actaRecepttionForm
          .get('receive')
          .setValue(this.expedient.courtName);
        /*this.actaRecepttionForm
          .get('testigoOne')
          .setValue(this.expedient.witness1);
        this.actaRecepttionForm
          .get('testigoTree')
          .setValue(this.expedient.witness2);*/

        // this.actaRecepttionForm;

        this.getGoodsByStatus(this.fileNumber);
      },
      error: () => {
        console.error('expediente nulo');
        this.loadingExpedient = false;
        this.validateEx = false;
      },
    });
  }

  getGoodsByStatus(id: number) {
    this.loadingBienes = true;
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getByExpedient_(id, params).subscribe({
      next: data => {
        this.loadingBienes = false;
        this.loadingBienes = false;
        this.bienes = data.data;

        console.log('Bienes', this.bienes);

        let result = data.data.map(async (item: any) => {
          this.wheelNumber = item.flyerNumber;
          let obj = {
            vcScreen: 'FACTCIRCUNR_0001',
            pNumberGood: item.goodId,
          };
          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          if (item.minutesKey) {
            item.di_disponible = 'N';
          }
          item['quantity'] = item.amount;
          item['di_acta'] = item.minutesKey;
          item['id'] = item.goodId;
        });

        Promise.all(result).then(item => {
          this.dataTableGood_ = this.bienes;
          this.dataTableGood.load(this.bienes);
          this.dataTableGood.refresh();

          this.totalItems = data.count;
          this.loadingBienes = false;
          this.loadingBienes = false;
        });
      },
      error: error => {
        this.loading = false;
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
        managementNumber: this.paramsScreen.P_NO_TRAMITE,
      };
    });
    return _data;
  }
  reviewGoodData(dataGoodRes: IDataGoodsTable, count: number, total: number) {
    // this.getGoodStatusDescription(dataGoodRes, count, total);
  }
  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.GoodprocessService_.getScreenGood(body).subscribe({
        next: async (state: any) => {
          if (state.data) {
            // console.log('di_disponible', state);
            resolve('S');
          } else {
            // console.log('di_disponible', state);
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
      this.proceedingsService.getGetFactCir(good, exp).subscribe({
        next: async (state: any) => {
          //console.log('acta', state);
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
          // // console.log('data', data);
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
  cleanForm() {
    this.form.reset();
    this.dataTableGood_ = [];
    this.dataTableGood.load([]);
    this.dataTableGood.reset();
  }
  searchExpedient(provider?: IExpedient) {
    this.loadingExpedient = true;
    this.dataRecepcionGood.load([]);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };

    let modalRef = this.modalService.show(
      FindAllExpedientComponent,
      modalConfig
    );
    // ocultar loading
    modalRef.onHidden.subscribe(() => {
      this.loadingExpedient = false;
    });
    modalRef.content.onSave.subscribe((next: any) => {
      console.log('recibido de modal ', next);
      this.getExpedient(next.id);
    });
  }

  actasDefault: any = null;
  searchActas(actas?: string) {
    this.consec = null;
    if (this.fileNumber == 0 || this.fileNumber == null) {
      this.alertInfo(
        'warning',
        'No se Puede Buscar Actas sin Selecccionar el Expediente',
        ''
      );
      return;
    }

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
      // Limpiar formulario una vez consulte
      this.actaRecepttionForm.reset();

      const dateElabora =
        next.elaborationDate != null ? new Date(next.elaborationDate) : null;
      const formattedfecElaborate =
        dateElabora != null ? this.formatDate(dateElabora) : null;

      const dateActa =
        next.datePhysicalReception != null
          ? new Date(next.datePhysicalReception)
          : null;
      const formattedfecActa =
        dateActa != null ? this.formatDate(dateActa) : null;

      const dateCapture =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecCapture =
        dateCapture != null ? this.formatDate(dateCapture) : null;

      this.actasDefault = next;
      // this.fCreate = this.datePipe.transform(
      //   next.dateElaborationReceipt,
      //   'dd/MM/yyyy'
      // );
      this.to = this.datePipe.transform(
        this.actaRecepttionForm.controls['mes'].value,
        'MM/yyyy'
      );
      this.annio = this.datePipe.transform(
        this.actaRecepttionForm.controls['anio'].value,
        'MM/yyyy'
      );
      this.statusCanc = next.statusProceedings;
      if (this.statusCanc == 'CERRADA') {
        //this.disabledBtnCerrar = false;
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
        //this.disabledBtnCerrar = true;
      }

      // MAPEAR DATOS DATA NEXT CUANDO CONSULTO ACTAS
      console.log('acta NEXT ', next);
      this.actaRecepttionForm.patchValue({
        administra: next.approvedXAdmon,
        testigoOIC: next.comptrollerWitness,
        respConv: next.receiptKey,

        observaciones: next.observations,
        // ejecuta: next.ejecuta,
        consec: next.numeraryFolio,
        type: next.id,
        cveActa: next.keysProceedings,
        mes: next.dateElaborationReceipt,
        //cveReceived: next.receiptKey,
        //anio: new Date(next.dateElaborationReceipt),
        direccion: next.address,
        parrafo1: next.parrafo1,
        // testigoOIC: next.comptrollerWitness,
        //testigoOIC: next.witness1,
        testigoOne: next.witness1,
        testigoTree: next.witness2,
        elaboradate: formattedfecElaborate,
        fechaact: formattedfecActa,
        fechacap: formattedfecCapture,

        // parrafo2: next.parrafo2,
        // parrafo3: next.parrafo3,
      });

      this.data1 = next.statusProceedings;
      this.formScan.get('scanningFoli').patchValue(next.universalFolio);
      // Pasar clave a esta función
      this.generarDatosDesdeUltimosCincoDigitos(next.keysProceedings);

      await this.getDetailProceedingsDevollution(this.actasDefault.id);
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
              this.Exportdate = true;
              //this.disabledBtnEscaneo = true;
              this.disabledBtnImprimir = true;
              this.disabledBtnImage = true;
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
    this.bienesLoading = false;
    this.procedureManagementService
      .getById(this.paramsScreen.P_NO_TRAMITE)
      .subscribe({
        next: (data: any) => {
          this.gTramite = data;
          console.log('this.gTramite', this.gTramite);
          this.fileNumber = this.gTramite.expedient;
          this.getExpedient(this.fileNumber);
          this.getGoodsByStatus(this.fileNumber);
          this.getActaGoodExp(this.paramsScreen.acta, this.fileNumber);
          this.getDetailProceedingsDevollution(this.paramsScreen.acta);
          this.afterScanning();
          if (
            this.gTramite.status == 'RFI' &&
            this.paramsScreen.P_GEST_OK == '1'
          ) {
            this.updateReg = {
              id: Number(this.paramsScreen.P_NO_TRAMITE),
              status: this.statusFinal,
              userTurned: this.authService.decodeToken().username,
              actualDate: new Date(),
            };
            this.upddateTramite(Number(this.paramsScreen.P_NO_TRAMITE));
          }
          console.log('sin parametros = 1');
        },
        error: () => {
          this.bienesLoading = false;
          console.error('error ');
        },
      });
  }

  upddateTramite(tramite: number) {
    this.procedureManagementService
      .updateTramite(tramite, this.updateReg)
      .subscribe({
        next: data => {
          console.log('actualizado');
        },
        error: () => {
          this.loading = false;
        },
      });
  }

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
        if (this.statusCanc == 'CERRADA') {
          this.alert(
            'warning',
            'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
            ''
          );
          return;
        } else {
          // console.log('aaa', this.goods);
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
              // console.log('GOOD', good);
              this.loading2 = true;

              if (!this.dataRecepcion.some((v: any) => v === good)) {
                let indexGood = this.dataTableGood_.findIndex(
                  _good => _good.id == good.id
                );

                this.Exportdate = true;

                console.log('indexGood', indexGood);
                if (indexGood != -1)
                  this.dataTableGood_[indexGood].di_disponible = 'N';

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
          //this.actasDefault = null;
        }
      }
    } else {
      this.alert('warning', 'Seleccione Primero el Bien a Asignar.', '');
    }
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
      console.log(this.selectedGooods);
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
    const exists = this.selectedGooodsValid.find(
      good => good.goodId == _good.id
    );
    return !exists ? false : true;
  }
  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
      console.log(this.selectedGooodsValid);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
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
  }
  async saveGoodActas(body: any) {
    return new Promise((resolve, reject) => {
      this.detailProceeDelRecService.addGoodToProceedings(body).subscribe({
        next: data => {
          // this.alert('success', 'Bien agregado correctamente', '');
          resolve(true);
          this.Exportdate = true;
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }
  async getGoodsDelete(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.goodService
        .getByExpedient_(Number(this.fileNumber), params)
        .subscribe({
          next: data => {
            resolve(true);
          },
          error: error => {
            resolve(null);
          },
        });
    });
  }

  async deleteDET(good: any) {
    // if (this.selectedGooodsValid.length > 0) {
    //   this.loading2 = true;
    //   let result = this.selectedGooodsValid.map(async good => {
    console.log(good);
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
    // await this.goodService.updateStatus(obj_.goodId, 'ADM');

    // // INSERT HISTORIC
    // await this.saveHistoric(obj_);
    //   });

    //   Promise.all(result).then(async (item) => {
    //     await this.getDetailProceedingsDevollution(this.actasDefault.id);
    //   })
    // }
  }

  getScreenStatus(good: any) {
    let obj = {
      estatus: good.status,
      vc_pantalla: 'FACTCIRCUNR_0001',
    };

    // console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenStatusService.getAllFiltro_(obj).subscribe({
        next: (resp: any) => {
          console.log('Status', resp);
          resolve(resp.data[0].statusFinal);
        },
        error: (error: any) => {
          resolve(null);
        },
      });
    });
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

  async selectData(event: { data: IGood; selected: any }) {
    this.selectedRow = event.data;
    // console.log('select RRR', this.selectedRow);

    await this.getStatusGoodService(this.selectedRow.status);
    this.selectedGooods = event.selected;
    this.changeDetectorRef.detectChanges();
  }
  async getStatusGoodService(status: any) {
    this.statusGoodService.getById(status).subscribe({
      next: async (resp: any) => {
        console.log('datapruebaJess', resp);
        this.statusGood_ = resp.description;
        // this.statusGoodForm.get('statusGood').setValue(resp.description)
      },
      error: err => {
        this.statusGood_ = '';
        // this.statusGoodForm.get('statusGood').setValue('')
      },
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
      if (this.statusCanc == 'CERRADA') {
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
            // console.log(_g);

            if (_g.di_disponible == 'N') {
              return;
            }

            if (_g.di_disponible == 'S') {
              _g.di_disponible = 'N';
              let valid = this.dataRecepcion.some(
                (goodV: any) => goodV.goodId == _g.id
              );

              this.Exportdate = true;
              // console.log('valid', valid);
              await this.createDET(_g);
              if (!valid) {
                // this.dataRecepcion = [...this.dataRecepcion, _g];
              }
            }
          });
          Promise.all(result).then(async item => {
            this.getGoodsByStatus(Number(this.fileNumber));
            await this.getDetailProceedingsDevollution(this.actasDefault.id);
            //this.actasDefault = null;
          });
        }
      }
    }
  }
  //Quitar uno
  removeSelect() {
    if (this.statusCanc == 'CERRADA') {
      this.alert(
        'warning',
        'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
        ''
      );
      return;
    } else {
      // console.log('this.actasDefault ', this.actasDefault);

      if (this.actasDefault == null) {
        this.alert(
          'warning',
          'Debe Especificar/Buscar el Acta para Despues Eliminar el Bien de Esta.',
          ''
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
              g => g.id === good.goodId
            );
            // if (index != -1) {
            //   this.dataTableGood_[index].di_disponible = 'S';
            //         //   this.dataTableGood_[index].acta = null;
            // }
            await this.deleteDET(good);
            // this.selectedGooods = [];
          });

          Promise.all(result).then(async item => {
            this.getGoodsByStatus(Number(this.fileNumber));
            await this.getDetailProceedingsDevollution(this.actasDefault.id);
          });
          this.Exportdate = false;
          this.validateGoods = true;
          this.selectedGooodsValid = [];
        }
      }
    }
    // console.log('selectedGooodsValid--', this.selectedGooodsValid);
  }

  //Quitar todos
  removeAll() {
    if (this.actasDefault == null) {
      this.alert(
        'warning',
        'Debe Especificar/Buscar el Acta para Despues Eliminar el Bien de Esta.',
        'Debe Capturar un Acta.'
      );
      return;
    } else {
      if (this.statusCanc == 'CERRADA') {
        this.alert(
          'warning',
          'El Acta ya está Cerrada, no puede Realizar Modificaciones a esta',
          ''
        );
        return;
      } else {
        // console.log('DataRecepcion', this.dataRecepcion);

        if (this.dataRecepcion.length > 0) {
          this.dataRecepcion.forEach((good: any) => {
            console.log('this.dataRecepcion', this.dataRecepcion);
            this.dataRecepcion = this.dataRecepcion.filter(
              (_good: any) => _good.id != good.id
            );
            let index = this.dataTableGood_.findIndex(g => g.id === good.id);
            this.dataRecepcion = [];
            this.dataRecepcionGood.load([]);
            this.Exportdate = false;
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
          await this.confirmScanRequest();
        },
        error: error => {
          this.alert('error', 'Ocurrió un Error al Actualizar el Acta', '');
          // this.loading = false
        },
      });
  }

  // LIMPIAR CAMPOS
  cleanActa() {
    this.actaRecepttionForm.reset();
    this.fileNumber = 0;
    this.causa = '';
    this.aprevia = '';
    this.formScan.reset();
    this.dataTableGood.load([]);
    this.dataRecepcionGood.load([]);
    this.actasDefault = null;
    this.statusCanc = null;
    this.selectedGooods = [];
    this.Exportdate = false;
    this.validateGoods = false;
    this.disabledBtnImprimir = false;
    this.disabledBtnImage = false;
    this.disabledBtnReplicar = false;
    this.data1 = null;
    this.consec = null;
    this.actaGoodForm.reset();
  }
  cargueMasive() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataDelivery, {
      skipHeader: true,
    });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
    this.cleanPlaceholder('nameFileA', 'reporteEntrega.xlsx');
    XLSX.writeFile(workBook, 'reporteEntrega.xlsx');
  }

  cleanPlaceholder(element: string, newMsg: string) {
    const nameFile = document.getElementById(element) as HTMLInputElement;
    nameFile.placeholder = `${newMsg}`;
  }

  btnDetail() {}
  sendOffice() {}

  Scanner() {
    /*if (this.formScan.get('scanningFoli').value) {
      this.alertQuestion(
        'info',
        'Se Abrirá la Pantalla de Escaneo para el Folio de Escaneo del Acta Abierta ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          this.router.navigate([`/pages/general-processes/scan-documents`], {
            queryParams: {
              origin: 'FACTCIRCUNR_0001',
              folio: this.formScan.get('scanningFoli').value,
            },
          });
        }
      });
    } else {
      this.alertInfo('warning', 'No Existe Folio de Escaneo a Escanear', '');
    }*/
  }
  agregarActa() {
    if (this.fileNumber == 0 || this.fileNumber == null) {
      this.alertInfo(
        'warning',
        'No se Puede Crear una Nueva Acta sin Selecccionar el Expediente',
        ''
      );
      return;
    }
    const respConv = this.actaRecepttionForm.get('respConv').value;
    const testigoOne = this.actaRecepttionForm.get('testigoOne').value;
    const testigoTree = this.actaRecepttionForm.get('testigoTree').value;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      delegationToolbar: this.delegationToolbar,
      fileNumber: this.fileNumber,
      witnessOic: this.witnessOic,
      expedient: this.expedient,
      testigoTree,
      respConv,
      testigoOne,
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

      // console.log('data modal next ', next);
      this.totalItems2 = 0;
      this.actasDefault = next;
      // this.fCreate = this.datePipe.transform(next.dateElaborationReceipt,'dd/MM/yyyy');
      this.statusCanc = next.statusProceedings;
      if (this.statusCanc == 'CERRADA') {
        //this.disabledBtnCerrar = false;
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
        //this.disabledBtnCerrar = true;
      }
      // console.log('NEXT', next);

      // Const formato de fecha

      const dateElabora =
        next.elaborationDate != null ? new Date(next.elaborationDate) : null;
      const formattedfecElaborate =
        dateElabora != null ? this.formatDate(dateElabora) : null;

      const dateActa =
        next.datePhysicalReception != null
          ? new Date(next.datePhysicalReception)
          : null;
      const formattedfecActa =
        dateActa != null ? this.formatDate(dateActa) : null;

      const dateCapture =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecCapture =
        dateCapture != null ? this.formatDate(dateCapture) : null;

      this.actaRecepttionForm.patchValue({
        acta: next.id,
        administra: next.approvedXAdmon,
        consec: next.numeraryFolio,
        type: next.id,
        claveTrans: next.numTransfer,
        cveActa: next.keysProceedings,
        respConv: next.receiptKey,
        testigoOne: next.witness1,
        testigoTree: next.witness2,
        testigoOIC: next.comptrollerWitness,
        direccion: next.address,
        observaciones: next.observations,
        elaboradate: formattedfecElaborate,
        fechaact: formattedfecActa,
        fechacap: formattedfecCapture,

        //respConv: next.receiveBy,
        //mes: next.dateElaborationReceipt,
        //cveReceived: next.receiptKey,
        //anio: new Date(next.dateElaborationReceipt),
        // ejecuta: next.ejecuta,
        // parrafo1: next.parrafo1,
        // parrafo2: next.parrafo2,
        // parrafo3: next.parrafo3,
      });

      this.data1 = next.statusProceedings;
      // Se mapea Autoridad cuando se crea nueva acta
      // console.log('AUTORITHY --', this.authorityNumber);
      this.actaRecepttionForm.get('claveTrans').setValue(this.authorityNumber);

      // Se mapea Mes  y año al crear nueva acta
      this.generarDatosDesdeUltimosCincoDigitos(next.keysProceedings);

      await this.getDetailProceedingsDevollution(this.actasDefault.id);
    });
    // console.log(this.authService.decodeToken());
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

        // console.log('SI', value);
      },
      error(err) {
        console.log('NO');
      },
    });
  }

  // Cammbiar formato de fecha

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  async cerrarActa() {
    if (this.consec == null) {
      this.alert(
        'warning',
        'No se puede Cerrar el Acta sin Folio de Escaneo',
        ''
      );
      return;
    }
    // console.log('this.actasDefault', this.actasDefault);
    // console.log(
    //   'this.circumstantialRecord',
    //   this.expedient
    //   //this.expedient.circumstantialRecord
    // );

    if (this.data1 != null) {
      if (this.data1 == null) {
        this.alert('warning', 'No Existe Acta para Cerrar', '');
        return;
      }
      if (this.data1 == 'CERRADA') {
        this.alertInfo('warning', 'El Acta ya se Encuentra Cerrada', '');
        return;
      }
      if (this.dataRecepcionGood.count() == 0) {
        this.alertInfo(
          'warning',
          'Para Cerrar un Acta debe Contener al Menos un Bien, por favor Registra este en la Pantalla de Actas.',
          ''
        );
        return;
      }

      // if (this.actasDefault.comptrollerWitness == null) {
      //   this.alert('warning', 'Indique el Testigo de la Contraloría', '');
      //   return;
      // }

      const toolbar_user = this.authService.decodeToken().preferred_username;
      const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;
      // console.log('cadena', cadena);

      if (
        cadena != 0 &&
        this.authService.decodeToken().preferred_username == toolbar_user
      ) {
        null;
      } else {
        this.alertQuestion(
          'question',
          '¿Seguro que Desea Realizar el Cierre de esta Acta?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            // await this.createDET();
            this.actasDefault.statusProceedings = 'CERRADA';
            delete this.actasDefault.numDelegation1Description;
            delete this.actasDefault.numDelegation2Description;
            delete this.actasDefault.numTransfer_;
            this.actasDefault.universalFolio = this.consec;
            this.proceedingsDeliveryReceptionService
              .editProceeding(this.actasDefault.id, this.actasDefault)
              .subscribe({
                next: async data => {
                  this.loading = false;
                  // console.log(data);
                  let obj = {
                    pActaNumber: this.actasDefault.id,
                    pStatusActa: 'CERRADA',
                    pVcScreen: 'FACTCIRCUNR_0001',
                    pUser: this.authService.decodeToken().preferred_username,
                  };

                  await this.updateGoodEInsertHistoric(obj);

                  this.alertInfo('success', 'El Acta Ha Sido Cerrada', '');
                  this.alert('success', 'Acta Cerrada', '');
                  this.data1 = 'CERRADA';
                  //this.disabledBtnCerrar = false;
                  this.disabledBtnActas = false;
                  this.getGoodsByStatus(this.fileNumber);
                  await this.getDetailProceedingsDevollution(
                    this.actasDefault.id
                  );
                },
                error: error => {
                  this.alert('error', 'Ocurrió un Error al Cerrar el Acta', '');
                },
              });
          }
        });
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
  updateGoodEInsertHistoric(obj: {
    pActaNumber: any;
    pStatusActa: string;
    pVcScreen: string;
    pUser: string;
  }) {
    //throw new Error('Method not implemented.');
  }

  getFileNamesByFolio(folio: number | string) {
    this.fileBrowserService.getFilenamesFromFolio(folio).subscribe({
      next: (files: any) => {
        this.files = files;
      },
      error: () => {
        this.files = [];
      },
    });
  }
  exportToExcel() {
    this.loadingExcel = true;
    if (
      this.fileNumber !== null &&
      this.actaRecepttionForm.get('cveActa').value !== 'null'
    ) {
      // console.log('Redirigiendo a la página de actas');
    } else {
      this.alert('info', 'Necesitas un Número de Expedientes con Acta', '');
      this.loadingExcel = false;
      return;
    }
    const filename: string =
      this.authService.decodeToken().preferred_username + '-ActaporRobo';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.loading = false;
    this.excelService.export(this.dataRecepcion, { filename });
    this.alert('success', 'Datos Exportados', '');
  }

  viewPictures(event: any) {
    let foliouniversal = this.formScan.get('scanningFoli').value;
    // console.log('FOLIO PARA IMA -->', foliouniversal);
    if (foliouniversal == null) {
      this.alert('warning', 'No Tiene Folio de Escaneo para Visualizar', '');
      return;
    }
    // console.log(event);
    if (!this.wheelNumber) {
      this.onLoadToast('error', 'Error', 'ésta acta no tiene volante asignado');
      return;
    }
    this.getDocumentsByFlyer(this.wheelNumber);
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados con el volante';
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }
  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const columns = RELATED_FOLIO_COLUMNS;
    // const body = {
    //   proceedingsNum: this.dictationData.expedientNumber,
    //   flierNum: this.dictationData.wheelNumber,
    // };
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        columns,
        title,
        $params,
        proceedingsNumber: this.fileNumber,
        wheelNumber: this.wheelNumber,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilComponent<IDocuments>,
      config
    );
  }
  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    // if (document.id != this.dictationData.folioUniversal) {
    // if (document.id) {
    //   folio = this.dictationData.folioUniversal;
    // }
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    if (!folio && this.actasDefault.universalFolio) {
      folio = this.actasDefault.universalFolio;
    }
    // console.log('PICTURES ', folio, document);
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  uploadPdfEmitter(
    blobFile: Blob,
    nameAndExtension: string,
    folioUniversal: string | number
  ) {
    // console.log(
    //   'DOCUMENT PDF UPLOAD ',
    //   blobFile,
    //   nameAndExtension,
    //   folioUniversal
    // );
    // UPLOAD PDF TO DOCUMENTS
    // this._blockErrors.blockAllErrors = true;
    // const formData = new FormData();
    // formData.append('file', blobFile, nameAndExtension);
    let filePdf = new File([blobFile], nameAndExtension);
    this.fileBrowserService
      .uploadFileByFolio(folioUniversal, filePdf)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al subir el reporte'
          );
        },
        complete: async () => {
          console.log('COMPLETADO SUBIR PDF');
          // this.updateSheets();
          this.files = [];
          this.loadImages(this.actasDefault.universalFolio);
        },
      });
  }

  updateSheets() {
    const token = this.authService.decodeToken();
    let scanStatus = null;
    const sheets = `${this.files.length}`;
    if (this.files.length > 0) {
      scanStatus = 'ESCANEADO';
    }
    const userRegistersScan = token?.preferred_username?.toUpperCase();
    const dateRegistrationScan = new Date();
    this.documentsService
      .update(this.actasDefault.universalFolio, {
        sheets,
        scanStatus,
        userRegistersScan,
        dateRegistrationScan,
      })
      .subscribe(() => {
        // const params = this.documentsParams.getValue();
        // this.documentsParams.next(params);
      });
  }
  loadImages(folio: string | number) {
    this.getFileNamesByFolio(folio);
    this.updateSheets();
  }
  createDocument(document: IDocuments) {
    return this.documentsService.create(document).pipe(
      tap(_document => {
        // END PROCESS
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al generar el documento'
        );
        return throwError(() => error);
      })
    );
  }
  async confirmScanRequest() {
    const response = await this.alertQuestion(
      'question',
      'Aviso',
      'Se Generará un Nuevo Folio de Escaneo para el Acta Abierta. ¿Deseas continuar?'
    );
    if (!response.isConfirmed) {
      return;
    }

    const flyerNumber = this.wheelNumber;
    if (!flyerNumber) {
      this.alert(
        'error',
        'Error',
        'Al localizar la información de Volante: ' +
          flyerNumber +
          ' y Expediente: ' +
          this.fileNumber
      );
      return;
    }
    // const { numFile, keysProceedings } = this.controls;
    const document = {
      numberProceedings: this.fileNumber,
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `EXPEDIENTE ${this.fileNumber}`, // Clave de Oficio Armada
      significantDate: format(new Date(), 'MM-yyyy'),
      scanStatus: 'SOLICITADO',
      userRequestsScan:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user,
      scanRequestDate: new Date(),
      numberDelegationRequested: this.dataUserLogged.delegationNumber,
      numberSubdelegationRequests: this.dataUserLogged.subdelegationNumber,
      numberDepartmentRequest: this.dataUserLogged.departamentNumber,
      flyerNumber: this.wheelNumber,
    };

    // this.createDocument(document)
    //   .pipe(
    //     tap(_document => {
    //       this.formScan.get('scanningFoli').setValue(_document.id);
    //     }),
    //     switchMap((_document: any) => {
    //       this.dataRecepcion.universalFolio =
    //         this.formScan.get('scanningFoli').value;
    //       return _document;
    //     }),
    //     switchMap(_document => this.generateScanRequestReport())
    //   )
    //   .subscribe();
    this.createDocument(document)
      .pipe(
        tap(_document => {
          this.formScan.get('scanningFoli').setValue(_document.id);
          this.disabledBtnReplicar = true;
          this.consec = _document.id;
        }),
        switchMap(_document => {
          this.dataRecepcion.universalFolio =
            this.formScan.get('scanningFoli').value;
          this.showMessageDigitalization(); // se llama el reporte

          console.log(
            'this.actasDefault.universalFolio -->>',
            this.dataRecepcion.universalFolio
          );
          return Observable.create(() => {
            _document;
          });
        }),
        switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }
  updateActa(data: IProceedingDeliveryReception) {
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
  generateScanRequestReport() {
    const pn_folio = this.formScan.get('scanningFoli').value;
    return this.jasperService
      .fetchReport('RGERGENSOLICDIGIT', { pn_folio })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        })
      );
  }
  showScannerFoil() {
    if (!this.dataRecepcion) {
      return;
    }
    if (this.formScan.get('scanningFoli').value) {
      // Insertar imagenes
    } else {
      this.alertInfo(
        'warning',
        'No tiene Folio de Escaneo para visualizar',
        ''
      );
    }
  }

  //ESCANEAR
  openScannerPage() {
    if (
      !['CERRADO', 'CERRADA'].includes(this.statusCanc) &&
      this.statusCanc != null
    ) {
      if (this.formScan.get('scanningFoli').value) {
        this.alertQuestion(
          'info',
          'Se Abrirá la Pantalla de Escaneo para el Folio de Escaneo del Acta Abierta ¿Deseas continuar?',
          '',
          'Aceptar',
          'Cancelar'
        ).then(res => {
          console.log(res);
          console.log('paramsScreen --> ', this.paramsScreen);
          if (res.isConfirmed) {
            this.router.navigate([`/pages/general-processes/scan-documents`], {
              queryParams: {
                origin: 'FACTCIRCUNR_0001',
                folio: this.formScan.get('scanningFoli').value,
                expedient: this.fileNumber,
                acta: this.actaRecepttionForm.get('type').value,
                P_GEST_OK: this.paramsScreen.P_GEST_OK,
                P_NO_TRAMITE: this.paramsScreen.P_NO_TRAMITE,
                //...this.paramsScreen,
              },
            });
          }
        });
      } else {
        this.alertInfo('warning', 'No Existe Folio de Escaneo a Escanear', '');
      }
    } else {
      this.alertInfo(
        'warning',
        'No se puede Escanear para un Acta que esté Cerrada',
        ''
      );
    }
  }

  showMessageDigitalization() {
    let params = {
      PN_FOLIO: this.formScan.get('scanningFoli').value,
    };
    if (params.PN_FOLIO) {
      const msg = setTimeout(() => {
        this.jasperService
          //.fetchReport('RGERGENSOLICDIGIT', params)  No existe reporte
          .fetchReportBlank('blank')
          .pipe(
            tap(response => {
              this.alert(
                'success',
                'Generado Correctamente',
                'Folio de Escaneo: ' + this.formScan.get('scanningFoli').value
              );
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
              this.loadingDoc = false;

              clearTimeout(msg);
            })
          )
          .subscribe();
      }, 1000);
    } else {
      this.alert(
        'error',
        'ERROR',
        'Debe Tener el Folio en Pantalla para poder Imprimir'
      );
    }
  }

  async replicate() {
    if (this.data1 == 'CERRADA') {
      this.alert(
        'warning',
        'No se Puede Replicar el Folio de Escaneo en un Acta Cerrada',
        ''
      );
      return;
    }
    if (!this.dataRecepcion) {
      return;
    }
    if (
      // this.dataRecepcion.statusProceedings == 'ENVIADO' &&
      // this.dataRecepcion.universalFolio
      !['CERRADO', 'CERRADA'].includes(this.statusCanc) &&
      this.statusCanc != null
    ) {
      if (this.formScan.get('scanningFoli').value) {
        // Replicate function
        const response = await this.alertQuestion(
          'question',
          'Aviso',
          'Se Generará un Nuevo Folio de Escaneo y se le Copiarán las Imágenes del Folio de Escaneo Actual. ¿Deseas Continuar?'
        );

        if (!response.isConfirmed) {
          return;
        }

        // if (!this.dictationData.wheelNumber) {
        //   this.onLoadToast(
        //     'error',
        //     'Error',
        //     'El trámite no tiene un número de volante'
        //   );
        //   return;
        // }

        this.getDocumentsCount().subscribe(count => {
          if (count == null) {
            this.alert(
              'warning',
              'Folio de Escaneo Inválido para Replicar',
              ''
            );
          } else {
            // INSERTAR REGISTRO PARA EL DOCUMENTO
            this.saveNewUniversalFolio_Replicate();
          }
        });
      } else {
        this.alertInfo(
          'warning',
          'Especifique el Folio de Escaneo a Replicar',
          ''
        );
        return;
      }
    } else {
      this.alertInfo(
        'warning',
        'No se Puede Replicar el Folio de Escaneo en un Acta Cerrada',
        ''
      );
      return;
    }
  }
  async createScannerFoil() {
    // validación

    let foliouniversal = this.formScan.get('scanningFoli').value;
    if (foliouniversal != null) {
      this.alert('warning', 'El Acta ya Tiene Folio de Escaneo', '');
      return;
    }
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
          this.disabledBtnEscaneo = true;
          await this.confirmScanRequest();
        },
        error: error => {
          this.alert('error', 'Ocurrió un Error al Actualizar el Acta', '');
          // this.loading = false
        },
      });
  }

  saveNewUniversalFolio_Replicate() {
    let folio =
      this.dataRecepcion.universalFolio != null
        ? this.dataRecepcion.universalFolio
        : this.consec;

    const document = {
      numberProceedings: this.fileNumber,
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `DICTAMEN ${folio}`, // Clave de Oficio Armada
      significantDate: format(new Date(), 'MM-yyyy'),
      scanStatus: 'ESCANEADO',
      userRequestsScan:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user,
      scanRequestDate: new Date(),
      numberDelegationRequested: this.dataUserLogged.delegationNumber,
      numberSubdelegationRequests: this.dataUserLogged.subdelegationNumber,
      numberDepartmentRequest: this.dataUserLogged.departamentNumber,
      associateUniversalFolio: this.formScan.get('scanningFoli').value,
      flyerNumber: this.wheelNumber,
    };
    console.log('Documento a crear para el folio asociado', document);
    this.createDocument(document)
      .pipe(
        tap(_document => {
          this.onLoadToast(
            'success',
            'Se Creó Correctamente el Nuevo Folio Universal: ' + _document.id,
            ''
          );
          const folio = _document.id;
          this.formScan.get('scanningFoli').setValue(folio);
          this.formScan.get('scanningFoli').updateValueAndValidity();
          this.alert('success', 'El Folio Universal Generado es: ' + folio, '');
          // this.updateDocumentsByFolio(
          //   folio,
          //   document.associateUniversalFolio
          // ).subscribe();
        }),
        switchMap(_document => {
          this.dataRecepcion.universalFolio =
            this.formScan.get('scanningFoli').value;
          return Observable.create(() => {
            _document;
          });
        })
        // switchMap(_document => this.generateScanRequestReport())
        // switchMap(_document => {
        //   this.dataRecepcion.universalFolio = Number(_document.id);
        //   // this.form.get('scanningFoli').value;
        //   return this.updateDictation(this.dataRecepcion).pipe(
        //     map(() => _document)
        //   );
        // })
        // switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }
  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter(
      'associateUniversalFolio',
      SearchFilter.NULL,
      SearchFilter.NULL
    );
    params.addFilter('id', this.formScan.get('scanningFoli').value);
    console.log(params);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          return of({ count: 0 });
        }
        this.onLoadToast(
          'error',
          'Ocurrió un error al validar el Folio ingresado',
          error.error.message
        );
        return throwError(() => error);
      })
      // map(response => {
      //   return response.count;
      // })
    );
  }

  ValidGoods(): void {
    console.log('this.bienes1 -->', this.dataRecepcion);

    if (this.dataRecepcion.length === 0) {
      this.alertInfo('warning', 'No Hay Ningún Bien a Comparar', '');
      return;
    }

    this.contador = 0;
    this.vTotalB = '';

    for (const bien of this.dataRecepcion) {
      console.log('entra al for ', bien);
      if (bien != null) {
        console.log('Entra al if y al for');
        this.contador++;

        if (this.contador === 1) {
          this.vTotalB = bien.numberGood.toString();
        } else {
          this.vTotalB = bien.numberGood + ', ' + this.vTotalB;
        }
      }
    }

    console.log('this.bienes -->', this.dataRecepcion);
    console.log('Contador ', this.contador);

    if (this.contador > 0) {
      this.onLoadToast(
        'success',
        'Se Encontraron ' + this.contador + ' No. Bien',
        'Que Son: ' + this.vTotalB
      );
      console.log('SE ENCONTRARON:', this.contador, 'QUE SON:', this.vTotalB);
    } else {
      this.alertInfo('warning', 'No Existe el Bien de Gastos', '');
    }
  }

  changeSelection(event: any, id: number) {
    const good = this.dataTableGoodsMap.get(id);
    if (event.target.checked) {
      this.dataGoodsSelected.set(id, good);
    } else {
      this.dataGoodsSelected.delete(id);
    }
  }
  goBack() {
    this.router.navigate(['/pages/general-processes/scan-documents'], {
      queryParams: {
        origin: this.origin,
        origin3: this.origin3,
        P_GEST_OK: this.paramsScreen.P_GEST_OK,
        P_NO_TRAMITE: this.paramsScreen.P_NO_TRAMITE,
        folio: this.formScan.get('scanningFoli').value,
        acta: this.actaRecepttionForm.get('type').value,
      },
    });
  }
  initFormPostGetUserData() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsScreen.P_GEST_OK = paramsQuery['P_GEST_OK'] ?? null;
        this.paramsScreen.P_NO_TRAMITE = paramsQuery['P_NO_TRAMITE'] ?? null;
        this.paramsScreen.folio = paramsQuery['folio'] ?? null;
        this.paramsScreen.acta = paramsQuery['type'] ?? null;
        if (this.origin == 'FACTCIRCUNR_0001') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          this.origin2 = paramsQuery['origin2'] ?? null;
          this.origin3 = paramsQuery['origin3'] ?? null;
          if (
            this.origin != null &&
            this.paramsScreen.P_GEST_OK != null &&
            this.paramsScreen.P_NO_TRAMITE != null
          ) {
            console.log(this.paramsScreen);
            this.gestionTramite();
          }
        }
      });
  }

  afterScanning() {
    console.log('afterScanning');
    this.loading = true;

    this.params.getValue()['filter.id'] =
      this.actaRecepttionForm.get('type').value;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.proceedingsDeliveryReceptionService
      .getStatusDeliveryCveExpendienteAll(params)
      .subscribe({
        next: data => {
          console.log('getStatusDeliveryCveExpendienteAll ', data);
          this.loading = false;
          for (let i = 0; i < data.count; i++) {
            //console.log("data for ", data.data[i].numeraryFolio);
            if (data.data[i] != null && data.data[i] != undefined) {
              this.actasDefault = data.data[i];

              // Const formato de fecha

              const dateElabora =
                data.data[i].elaborationDate != null
                  ? new Date(data.data[i].elaborationDate)
                  : null;
              const formattedfecElaborate =
                dateElabora != null ? this.formatDate(dateElabora) : null;

              const dateActa =
                data.data[i].datePhysicalReception != null
                  ? new Date(data.data[i].datePhysicalReception)
                  : null;
              const formattedfecActa =
                dateActa != null ? this.formatDate(dateActa) : null;

              const dateCapture =
                data.data[i].captureDate != null
                  ? new Date(data.data[i].captureDate)
                  : null;
              const formattedfecCapture =
                dateCapture != null ? this.formatDate(dateCapture) : null;

              this.actaRecepttionForm
                .get('consec')
                .setValue(data.data[i].numeraryFolio);
              this.actaRecepttionForm
                .get('cveActa')
                .setValue(data.data[i].keysProceedings);
              this.actaRecepttionForm
                .get('direccion')
                .setValue(data.data[i].address);
              this.actaRecepttionForm
                .get('testigoOne')
                .setValue(data.data[i].witness1);
              this.actaRecepttionForm
                .get('testigoTree')
                .setValue(data.data[i].witness2);
              this.actaRecepttionForm
                .get('testigoOIC')
                .setValue(data.data[i].comptrollerWitness);
              this.actaRecepttionForm
                .get('administra')
                .setValue(data.data[i].approvedXAdmon);
              this.actaRecepttionForm
                .get('observaciones')
                .setValue(data.data[i].observations);
              this.actaRecepttionForm
                .get('respConv')
                .setValue(data.data[i].receiptKey);
              this.actaRecepttionForm
                .get('parrafo1')
                .setValue(data.data[i].parrafo1);
              this.actaRecepttionForm
                .get('elaboradate')
                .setValue(formattedfecElaborate);
              this.actaRecepttionForm
                .get('fechaact')
                .setValue(formattedfecActa);
              this.actaRecepttionForm
                .get('fechacap')
                .setValue(formattedfecCapture);
              this.getDetailProceedingsDevollution(data.data[i].id);

              this.data1 = data.data[i].statusProceedings;
              console.log('LLEGA data 1 ->', this.data1);
              //this.actaRecepttionForm.get('scanningFoli').setValue(data.data[i].universalFolio);
            }
            //this.formScan.get('scanningFoli').patchValue(next.universalFolio);
            this.generarDatosDesdeUltimosCincoDigitos(
              data.data[i].keysProceedings
            );
          }
        },
        error: error => {
          this.loading = false;
        },
      });

    // HABILITAR UNA VEZ REGRESE DEL ESCANEO
    this.disabledBtnImprimir = true;
    this.disabledBtnImage = true;
    this.validateGoods = true;
    this.Exportdate = true;
  }

  afterScanningExpedient() {
    this.loadingExpedient = true;
    this.expedientService.getById(this.fileNumber).subscribe({
      next: (data): any => {
        if (data != null && data != undefined) {
          console.log('this.data ', data);
          this.aprevia = data.preliminaryInquiry;
          this.causa = data.criminalCase;
          this.transfer = data.transferNumber;
        }
        this.actaRecepttionForm
          .get('claveTrans')
          .setValue(data.authorityNumber);
      },
      error: () => {
        this.loadingExpedient = false;
      },
    });
  }
}
export interface IParamsActaC {
  origin: string;
  P_GEST_OK: string;
  P_NO_TRAMITE: string;
  folio: string;
  acta: string;
}
