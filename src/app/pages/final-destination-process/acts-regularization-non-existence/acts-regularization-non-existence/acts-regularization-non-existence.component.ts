import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';

import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IDetailProceedingsDeliveryReception_ } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SearchActsComponent } from '../../acts-goods-delivered/acts-goods-delivered/search-acts/search-acts.component';
import { GOODSEXPEDIENT_COLUMNS_GOODS } from '../../donation-acts/donation-acts/columns1';
import { COLUMNS2 } from '../../donation-acts/donation-acts/columns2';
import { SearchExpedientComponent } from '../../donation-acts/donation-acts/search-expedient/search-expedient.component';
import { ACTASRIF } from './columns1';
import { ModalMantenimientoEstatusActComponent } from './modal-mantenimiento-estatus-act/modal-mantenimiento-estatus-act.component';
@Component({
  selector: 'app-acts-regularization-non-existence',
  templateUrl: './acts.regularization-non-existence.component.html',
  styles: [
    `
      .bg-gray {
        background-color: #eee !important;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ActsRegularizationNonExistenceComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  formExpedient: FormGroup;
  formActCreate: FormGroup;
  formActReception: FormGroup;
  formFolio: FormGroup;
  formTable1: FormGroup;
  form2: FormGroup;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;

  totalItems1: number = 0;
  totalItems2: number = 0;
  settings2 = {
    ...this.settings,
  };
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  dataTabla2: any[] = [];
  bienSelecionado: any = {};
  bienSelecionado2: any = {};
  actaSelected: string = '';
  actaActual: any[] = [];

  listaActas: any[] = [];
  statusActa: String = '';
  expedienteBuscado: number = 0;

  dataExpediente: any = null;
  actaDefault: any = null;

  arrayDele = new DefaultSelect<any>();
  dele = new DefaultSelect<any>();
  trans = new DefaultSelect<any>();
  responsables = new DefaultSelect<any>();
  actaCerrada: boolean = true;
  loadingBtn: boolean = false;

  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  months = [
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
    { value: 4, label: '04' },
    { value: 5, label: '05' },
    { value: 6, label: '06' },
    { value: 7, label: '07' },
    { value: 8, label: '08' },
    { value: 9, label: '09' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
  ];
  valClave: boolean = false;
  btnSave: boolean = false;
  delegation: any;
  stagecreated: string | number;
  loading2: boolean = false;
  statusGood_: string = '';
  dataUser: TokenInfoModel;
  selectData: any = null;
  selectData2: any = null;
  columnFilters1: any = [];
  columnFilters2: any = [];
  dataRecepcion: any[] = [];
  transferenSelected: any;
  departamentNumber: string | number;
  subdelegationNumber: string | number;
  userdelegacion: any;
  COLUMNS_ACTARIF = ACTASRIF;
  constructor(
    private fb: FormBuilder,
    private proceedingsDelivery: ProceedingsDeliveryReceptionService,
    private goodsService: GoodService,
    private modalService: BsModalService,
    private goodprocessService: GoodProcessService,
    private expedientService: ExpedientService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private parametersService: ParametersService,
    private rNomenclaService: RNomenclaService,
    private transferenteService: TransferenteService,
    private authService: AuthService,
    private serviceDetailProc: DetailProceeDelRecService,
    private goodprocessService_: GoodprocessService,
    private statusGoodService: StatusGoodService,
    private goodService: GoodService,
    private datePipe: DatePipe,
    private securityService: SecurityService,
    private usersService: UsersService,
    private documentsService: DocumentsService,
    private notificationService: NotificationService,
    private fractionsService: FractionsService,
    private router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private documentsForDictumService: DocumentsForDictumService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    this.settings2 = { ...this.settings, actions: false };

    this.settings.columns = GOODSEXPEDIENT_COLUMNS_GOODS;
    this.settings2.columns = COLUMNS2;

    this.settings.hideSubHeader = false;
    this.settings2.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.dataUser = this.authService.decodeToken();
    console.log(this.dataUser);
    this.initForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log(params);
        const folio = params['folioScan'] ? Number(params['folioScan']) : null;
        const expedient = params['expedient']
          ? Number(params['expedient'])
          : null;
        const idActa = params['cveActa'] ? Number(params['cveActa']) : null;

        if (folio) {
          console.log();
          this.goBackScanning(idActa, expedient, folio);
        }
      });
    this.getDataSelectInitial();
    this.initFilters();
    this.responsablesList(new ListParams());
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
  }
  async getDataDepartment() {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;

    params[
      'filter.user'
    ] = `${SearchFilter.EQ}:${this.dataUser.preferred_username}`;
    this.securityService.getAllUsersAccessTracking(params).subscribe({
      next: (data: any) => {
        this.departamentNumber = data.data[0].departmentNumber;
        this.subdelegationNumber = data.data[0].subdelegationNumber;
      },
      error: error => {
        this.departamentNumber = null;
        this.subdelegationNumber = null;
      },
    });
  }

  initFilters() {
    // FILTRO PARA PRIMERA TABLA **** BIENES **** //
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              amount: () => (searchFilter = SearchFilter.EQ),
              minutesKey: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getGoodsByExpedient(this.dataExpediente.id);
        }
      });

    this.params1
      .pipe(
        skip(1),
        tap(() => {
          this.getGoodsByExpedient(this.dataExpediente.id);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});

    // FILTRO PARA SEGUNDA TABLA **** BIENES ASOCIADOS A LAS ACTAS **** //
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        // console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

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
          this.params2 = this.pageFilter(this.params2);
          //Su respectivo metodo de busqueda de datos
          this.getDetailProceedingsDevollution(this.actaDefault.id);
        }
      });

    this.params2
      .pipe(
        skip(1),
        tap(() => {
          this.getDetailProceedingsDevollution(this.actaDefault.id);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }
  // -------------- PUP_INICIALIZA_FORMA START ------------- //
  async getDataSelectInitial() {
    this.delegation = this.dataUser.department;
    await this.delegationWhereStageCreated();
    await this.validacionFirst();
    await this.getDataDepartment();
  }
  async delegationWhereStageCreated() {
    let date = `date=${format(new Date(), 'yyyy-MM-dd')}`;
    this.parametersService
      .getPhaseEdo(date)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(
        (res: any) => {
          this.stagecreated = res.stagecreated;
        },
        err => {
          this.stagecreated = 2;
        }
      );
  }
  async validacionFirst() {
    const params = new FilterParams();
    params.addFilter('numberDelegation2', this.delegation, SearchFilter.EQ);

    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: async (data: any) => {
        console.log('datarNomen', data);
        if (data.count > 1) {
          this.globalGstRecAdm = 'FILTRAR';
        } else {
          this.globalGstRecAdm = this.delegation;
        }
        await this.consulREG_DEL_ADMIN(new ListParams());
      },
      error: async error => {
        this.globalGstRecAdm = 'NADA';
        await this.consulREG_DEL_ADMIN(new ListParams());
      },
    });
  }
  // -------------- PUP_INICIALIZA_FORMA END ------------- //
  // ------ TABLA BIENES RELACIONADOS AL EXPEDIENTE ------ // START
  async getGoodsByExpedient(id: number) {
    this.loading = true;
    let params: any = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    params['sortBy'] = `goodNumber:ASC`;
    let body = {
      proceedingsNumber: id,
      typeMinutes: 'RIF',
    };
    this.goodprocessService
      .GetTypeMinuteDetailDelivery(body, params)
      .subscribe({
        next: data => {
          let result = data.data.map(async (item: any) => {
            let obj = {
              vcScreen: 'FACTDESACTASRIF',
              pNumberGood: item.goodNumber,
            };
            const di_dispo = await this.getStatusScreen(obj);
            item['di_disponible'] = di_dispo;
            if (item.minutesKey) {
              item.di_disponible = 'N';
            }
            item['quantity'] = item.amount;
            item['di_acta'] = item.minutesKey;
            item['id'] = item.goodNumber;
          });

          Promise.all(result).then(item => {
            this.data1.load(data.data);
            this.data1.refresh();
            this.totalItems1 = data.count;
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
          this.data1.load([]);
          this.data1.refresh();
          this.totalItems1 = 0;
        },
      });
  }
  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.goodprocessService_.getScreenGood(body).subscribe({
        next: async (state: any) => {
          if (state.data) {
            // console.log('di_dispo', state);
            resolve('S');
          } else {
            // console.log('di_dispo', state);
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }
  // ------ TABLA BIENES RELACIONADOS AL EXPEDIENTE ------ // END
  // ---------- TABLA BIENES RELACIONADOS AL ACTA -------- // START
  async getDetailProceedingsDevollution(id: any) {
    this.loading2 = true;
    let params: any = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    return new Promise((resolve, reject) => {
      this.serviceDetailProc.getGoodsByProceedings(id, params).subscribe({
        next: data => {
          let result = data.data.map((item: any) => {
            item['description'] = item.good ? item.good.description : null;
          });

          Promise.all(result).then(item => {
            // this.ocultarPaginado = true;
            this.dataRecepcion = data.data;
            this.data2.load(this.dataRecepcion);
            this.data2.refresh();
            this.totalItems2 = data.count;
            this.loading2 = false;
          });
        },
        error: error => {
          this.dataRecepcion = [];
          this.data2.load([]);
          this.data2.refresh();
          this.loading2 = false;
          // this.ocultarPaginado = false;
        },
      });
    });
  }
  // ---------- TABLA BIENES RELACIONADOS AL ACTA -------- // END
  onCambioActa(event: any) {
    let actaSeleccionada = event.target.value;
    this.actaSelected = event.target.value;

    const elemento: any = this.listaActas.filter(
      data => data.id == actaSeleccionada
    );

    this.statusActa = elemento[0].statusProceedings;

    this.form.controls['type'].setValue(elemento[0].typeProceedings);
    this.form.controls['witness1'].setValue(elemento[0].witness1);
    this.form.controls['witness2'].setValue(elemento[0].witness2);
    this.form.controls['folioScan'].setValue(elemento[0].universalFolio);
    this.form.controls['observations'].setValue(elemento[0].observations);
    this.form.controls['caseNumb'].setValue(elemento[0].comptrollerWitness);
    this.form.controls['sessionNumb'].setValue(elemento[0].destructionMethod);
    this.form.controls['del'].setValue(elemento[0].receiveBy);
    this.form.controls['trans'].setValue(elemento[0].numTransfer.key || null);
    this.form.controls['folio'].setValue(elemento[0].numeraryFolio);
    this.form.controls['elabDate'].setValue(elemento[0].elaborationDate);
    this.form.controls['responsible'].setValue(elemento[0].responsible);
    this.form.controls['act'].setValue(elemento[0].id);
  }

  initForm() {
    this.formExpedient = this.fb.group({
      id: [null],
      transferNumber: [null],
      preliminaryInquiry: [null],
      criminalCase: [null],
      expedientType: [null],
      expTransferNumber: [null],
    });

    this.formActCreate = this.fb.group({
      acta: [null],
      type: [null],
      claveTrans: [null],
      cveReceived: [null, Validators.required],
      consec: [null],
      anio: [null],
      mes: [null],
    });

    this.formActReception = this.fb.group({
      keysProceedings: [null],
      elaborationDate: [null, Validators.required],
      statusProceedings: [null],
      elaborate: [null],
      numFile: [null],
      witness1: [null, Validators.pattern(STRING_PATTERN)],
      witness2: [null, Validators.pattern(STRING_PATTERN)],
      typeProceedings: [null],
      responsible: [null],
      claveTrans: [null],
      destructionMethod: [null, Validators.pattern(STRING_PATTERN)],
      observations: [null, Validators.pattern(STRING_PATTERN)],
      captureDate: [null],
      numDelegation1: [null],
      numDelegation2: [null],
      universalFolio: [null],
      idTypeProceedings: [null],
      comptrollerWitness: [null, Validators.pattern(STRING_PATTERN)],
      closeDate: [null],
      affair: [null, Validators.pattern(STRING_PATTERN)],
    });

    this.formFolio = this.fb.group({
      folioUniversal: [null],
    });

    this.form2 = this.fb.group({
      estatusBien: [null],
    });
  }

  expedientChange() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  getDisponible(goodNumber: number) {
    return new Promise((res, _rej) => {
      const model = {
        vcScreen: 'FACTDESACTASRIF',
        goodNumber,
      };
      this.goodprocessService.getDisponible(model).subscribe({
        next: response => {
          res('S');
        },
        error: err => {
          res('N');
        },
      });
    });
  }

  selectFila1(event: any) {
    this.bienSelecionado = {
      id: event.data.id,
      description: event.data.description,
      quantity: event.data.quantity,
      act: event.data.act,
      disponible: event.data.disponible,
    };

    this.formTable1.controls['detail'].setValue(event.data.description);
  }

  async getScreenStatusFinal() {
    let cUSUVAL: any = await this.valCargo();
    if (cUSUVAL != 'ATES')
      return this.alert(
        'warning',
        'Usuario sin privilegios para mantenimiento de estatus.',
        ''
      );
    this.modalService.show(ModalMantenimientoEstatusActComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  searchExpediente() {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {};

    let modalRef = this.modalService.show(
      SearchExpedientComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any) => {
      if (next) {
        this.resetForm();
        this.dataExpediente = next;
        this.formExpedient.patchValue(next);
        this.getGoodsByExpedient(this.dataExpediente.id);
        this.params1.getValue().page = 1;
        this.params2.getValue().page = 1;
      }
    });
  }

  searchActa() {
    const expedienteNumber = this.dataExpediente.id;
    const actaActual = this.actaDefault;
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      expedienteNumber,
      actaActual,
      valRif: true,
      ACTASRIF: this.COLUMNS_ACTARIF,
    };

    let modalRef = this.modalService.show(SearchActsComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        console.log('next', next);
        this.actaDefault = next;

        if (this.actaDefault.statusProceedings == 'CERRADA')
          this.actaCerrada = false;
        else this.actaCerrada = true;
        this.formActReception.reset();
        this.formActCreate.reset();
        next.elaborationDate = !next.elaborationDate
          ? null
          : this.datePipe.transform(
              await this.correctDate(next.elaborationDate),
              'dd/MM/yyyy'
            );
        this.formActReception.patchValue(next);
        // this.formActReception.get('responsible').setValue(next.responsible)
        this.valClave = false;
        this.formActCreate.get('anio').setValue(this.currentYear);

        this.getDetailProceedingsDevollution(this.actaDefault.id);
        this.valClave = false;
        this.btnSave = true;
        // let clave = await this.obtenerValores(this.actaDefault.keysProceedings);
        // this.getDetailProceedingsDevollution(this.actaDefault.id);
      }
    });
    modalRef.content.onDelete.subscribe(async (next: any) => {
      this.ejecutarFuncion();
    });
  }
  ejecutarFuncion() {
    this.cleanActa();
  }
  async resetForm() {
    this.dataExpediente = null;
    this.actaDefault = null;
    this.selectData = null;
    this.selectData2 = null;
    this.formExpedient.reset();
    this.formActReception.reset();
    this.form2.reset();
    this.formActCreate.reset();
    this.totalItems1 = 0;
    this.totalItems2 = 0;
    this.data1.load([]);
    this.data2.load([]);
    this.actaCerrada = false;
    this.valClave = false;
    this.btnSave = false;
    this.formActCreate.get('anio').setValue(this.currentYear);
    this.consulREG_DEL_ADMIN(new ListParams());
    this.consultREG_TRANSFERENTES(new ListParams());
    this.responsablesList(new ListParams());
  }
  save() {
    const { statusProceedings } = this.formActReception.value;
    if (!this.actaDefault) {
      if (statusProceedings == 'CERRADA')
        return this.alert(
          'warning',
          'No se puede crear un acta con estatus cerrado',
          ''
        );
      this.agregarActa();
    } else {
      this.actualizarActa();
    }
  }
  async agregarActa() {
    let { acta, type, claveTrans, cveReceived, consec, anio, mes } =
      this.formActCreate.value;
    if (!cveReceived)
      return (
        this.formActCreate.get('cveReceived').markAllAsTouched(),
        this.alert(
          'warning',
          'Debe ingresar primero la Delegación en la clave',
          ''
        )
      );

    const month = this.datePipe.transform(new Date(), 'MM');
    const year = this.datePipe.transform(new Date(), 'yy');
    acta = !acta ? 'AC' : acta;
    type = !type ? 'RIF' : type;
    claveTrans = !claveTrans ? '' : claveTrans;
    cveReceived = !cveReceived ? '' : cveReceived;
    consec = !consec ? '' : consec;
    anio = !anio ? '' : anio;
    mes = !mes ? '' : mes;

    const miCadenaAnio = anio.toString();
    let miSubcadena = '';
    if (miCadenaAnio) miSubcadena = miCadenaAnio.slice(2, 5);

    let consec_ = '';
    if (consec) {
      consec_ = consec.toString().padStart(4, '0');
      if (consec_.length > 4) {
        consec_ = consec_.toString().slice(0, 4);
      }
    }

    const cveActa = `${acta}/${type}/${cveReceived}/${claveTrans}/${consec_}/${
      !miSubcadena ? year : miSubcadena.toString().padStart(2, '0')
    }/${!mes ? month : mes.value.toString().padStart(2, '0')}`;
    let valFolio_: any = await this.valFolio(cveReceived, consec_);
    if (valFolio_ == 1) {
      return this.alert(
        'warning',
        'Ya se cuenta un Acta con este folio.',
        'Verifique e intente nuevamente'
      );
    } else if (valFolio_ > 1) {
      return this.alert(
        'warning',
        'Se tiene más de un Acta con este folio',
        'Verifique e intente nuevamente'
      );
    }
    if (cveActa) {
      const params = new ListParams();
      params['filter.keysProceedings'] = `$eq:${cveActa}`;
      this.proceedingsDelivery.getByFilter_(params).subscribe({
        next: (data: any) => {
          if (data.data.length == 1) {
            this.alert(
              'warning',
              'El Acta ya se tiene registrada',
              `${cveActa}`
            );
          } else {
            this.alert(
              'warning',
              'Actas duplicadas en ACTAS_ENTREGA_RECEPCION',
              ''
            );
          }
          return;
        },
        error: error => {
          this.guardarRegistro(cveActa);
        },
      });
    }
  }
  valFolio(cveRecibe: string, folio: number | string) {
    const params = new ListParams();
    params['filter.typeProceedings'] = `$eq:RIF`;
    params[
      'filter.keysProceedings'
    ] = `$ilike:AC/RIF/${cveRecibe}/%/${folio}/%/%`;
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .getStatusDeliveryCveExpendienteAll(params)
        .subscribe({
          next: data => {
            resolve(data.count);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  async guardarRegistro(cveActa: any) {
    let body: IProccedingsDeliveryReception = {};
    body.affair = this.formActReception.value.affair;
    body.numDelegation1 = this.dataUser.department;
    body.numDelegation2 = this.dataUser.department;
    body.witness1 = this.formActReception.value.witness1;
    body.witness2 = this.formActReception.value.witness2;
    body.numFile = this.dataExpediente.id;
    body.statusProceedings = 'ABIERTA';
    body.elaborationDate = this.formActReception.value.elaborationDate;
    body.keysProceedings = cveActa;
    body.typeProceedings = 'RIF';
    body.idTypeProceedings = 'RIF';
    body.elaborate = this.dataUser.preferred_username;
    body.responsible = this.formActReception.value.responsible;
    body.destructionMethod = this.formActReception.value.destructionMethod;
    body.comptrollerWitness = this.formActReception.value.comptrollerWitness;
    body.observations = this.formActReception.value.observations;
    body.universalFolio = this.formActReception.value.universalFolio;
    body.captureDate = new Date();

    this.proceedingsDeliveryReceptionService
      .createDeliveryReception(body)
      .subscribe({
        next: async (data: any) => {
          console.log('DATA', data);
          this.actaDefault = data;
          this.alert('success', 'El Acta se ha creado correctamente', '');
          this.formActReception.reset();
          data.elaborationDate = !data.elaborationDate
            ? null
            : this.datePipe.transform(
                await this.correctDate(data.elaborationDate),
                'dd/MM/yyyy'
              );
          this.formActReception.patchValue(data);
          this.valClave = false;
          this.formActCreate.get('anio').setValue(this.currentYear);

          this.getDetailProceedingsDevollution(this.actaDefault.id);
        },
        error: error => {
          this.alert('error', 'El Acta no se puede crear', '');
        },
      });
  }

  async actualizarActa(folio?: string | number) {
    const { elaborationDate } = this.formActReception.value;
    if (!elaborationDate)
      return (
        this.formActReception.controls['elaborationDate'].markAllAsTouched(),
        this.alert('warning', 'La fecha de elaboración no puede ser vacía', '')
      );
    let dateElaboration: Date | string;
    if (typeof elaborationDate == 'string') {
      dateElaboration = elaborationDate.split('/').reverse().join('-');
    } else {
      dateElaboration = elaborationDate;
    }
    let body: IProccedingsDeliveryReception = {};
    body.affair = this.formActReception.value.affair;
    body.witness1 = this.formActReception.value.witness1;
    body.witness2 = this.formActReception.value.witness2;
    body.elaborationDate = dateElaboration;
    body.responsible = this.formActReception.value.responsible;
    body.destructionMethod = this.formActReception.value.destructionMethod;
    body.comptrollerWitness = this.formActReception.value.comptrollerWitness;
    body.observations = this.formActReception.value.observations;
    body.universalFolio = folio
      ? folio
      : this.formActReception.value.universalFolio;
    this.proceedingsDeliveryReceptionService
      .editProceeding(this.actaDefault.id, body)
      .subscribe({
        next: async resp => {
          if (!folio) {
            this.alertInfo('success', 'Acta actualizada correctamente', '');
            await this.getDetailProceedingsDevollution(this.actaDefault.id);
          }
        },
        error: error => {
          this.alert('error', 'Ocurrió un error al actualizar el Acta', '');
        },
      });
  }
  cleanActa() {
    this.formActReception.reset();
    this.formActCreate.reset();
    this.data2.load([]);
    this.data2.refresh();
    this.totalItems2 = 0;
    this.selectData = null;
    this.selectData2 = null;
    this.actaDefault = null;
    this.valClave = true;
    this.btnSave = true;
    this.actaCerrada = true;
    this.formActCreate.get('anio').setValue(this.currentYear);
    this.consulREG_DEL_ADMIN(new ListParams());
    this.consultREG_TRANSFERENTES(new ListParams());
  }
  async correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  // --------------- LISTAS --------------- //
  // REG_DEL_ADMIN
  globalGstRecAdm: any = null;
  async consulREG_DEL_ADMIN(lparams: ListParams) {
    const params = new FilterParams();

    params.page = 1;
    params.limit = 50;

    let obj = {
      globalGstAll: this.globalGstRecAdm,
      globalGnuDelegation: this.delegation,
      globalGstRecAdm: this.globalGstRecAdm,
    };

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('delegationNumber2', this.delegation, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.text, SearchFilter.ILIKE);
      }

    params.addFilter('stageEdo', this.stagecreated, SearchFilter.EQ);
    this.parametersService
      .GetDelegationGlobal(obj, params.getParams())
      .subscribe({
        next: (data: any) => {
          console.log('REG_DEL_ADMIN', data);
          let result = data.data.map(async (item: any) => {
            item['cveReceived'] =
              item.delegationNumber2 + ' - ' + item.delegation;
          });
          Promise.all(result).then(resp => {
            this.dele = new DefaultSelect(data.data, data.count);
          });
        },
        error: error => {
          this.dele = new DefaultSelect();
        },
      });
  }

  async consultREG_TRANSFERENTES(lparams: ListParams) {
    if (!this.dataExpediente) return;
    if (!this.dataExpediente.transferNumber) return;
    //  this.dataExpediente.transferNumber,

    const params = new ListParams();
    params.page = 1;
    params.limit = 50;

    params[
      'filter.id'
    ] = `${SearchFilter.EQ}:${this.dataExpediente.transferNumber}`;
    if (lparams.text)
      params['filter.id'] = `${SearchFilter.ILIKE}:${lparams.text}`;
    // params.addFilter('filter.keyTransferent', lparams.text, SearchFilter.ILIKE);

    this.transferenteService.getAll(params).subscribe({
      next: (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['transfer'] = item.id + ' - ' + item.keyTransferent;
        });
        Promise.all(result).then(resp => {
          this.trans = new DefaultSelect(data.data, data.count);
        });
      },
      error: error => {
        this.trans = new DefaultSelect([], 0);
      },
    });
  }

  async responsablesList(lparams: ListParams) {
    const params = new ListParams();
    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params['filter.user'] = `${SearchFilter.ILIKE}:${lparams.text}`;

    this.usersService
      .getApplicationPhysicalNonexistence(this.dataUser.department, params)
      .subscribe({
        next: (data: any) => {
          let result = data.data.map(async (item: any) => {});
          Promise.all(result).then(resp => {
            this.responsables = new DefaultSelect(data.data, data.count);
          });
        },
        error: error => {
          this.responsables = new DefaultSelect();
        },
      });
  }
  // --------------- LISTAS --------------- //
  async addSelect() {
    if (this.data1.count() == 0) return null;
    if (this.selectData) {
      if (this.actaDefault == null) {
        this.alert(
          'warning',
          'No existe un Acta en la cual asignar el Bien.',
          'Debe capturar un acta.'
        );
        return;
      } else {
        if (!this.actaCerrada) {
          this.alert(
            'warning',
            'El Acta ya está cerrada, no puede realizar modificaciones a esta',
            ''
          );
          return;
        } else {
          if (this.selectData.di_acta != null) {
            this.alert(
              'warning',
              `Ese Bien ya se encuentra en el Acta ${this.selectData.di_acta}`,
              ''
            );
          } else if (this.selectData.di_disponible == 'N') {
            this.alert(
              'warning',
              `El Bien ${this.selectData.id} tiene un estatus inválido para ser asignado a algún acta`,
              ''
            );
            return;
          } else {
            this.loading2 = true;

            await this.createDET(this.selectData);
            await this.getGoodsByExpedient(this.dataExpediente.id);
            await this.getDetailProceedingsDevollution(this.actaDefault.id);
          }
        }
      }
    } else {
      this.alert('warning', 'Seleccione primero el Bien a asignar.', '');
    }
  }
  async createDET(good: any) {
    let obj: IDetailProceedingsDeliveryReception_ = {};
    obj.amount = good.quantity;
    obj.numberGood = good.id;
    obj.numberProceedings = this.actaDefault.id;
    let result = await this.saveGoodActas(obj);
    return result;
  }

  async saveGoodActas(body: any) {
    return new Promise((resolve, reject) => {
      this.serviceDetailProc.addGoodToProceedings_(body).subscribe({
        next: data => {
          resolve(true);
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }

  async removeSelect() {
    if (this.data2.count() == 0) {
      return;
    }
    if (!this.actaCerrada) {
      this.alert(
        'warning',
        'El Acta ya está cerrada, no puede realizar modificaciones a esta',
        ''
      );
      return;
    } else {
      if (!this.selectData2) {
        this.alert(
          'warning',
          'Debe seleccionar un Bien que forme parte del Acta primero',
          'Debe capturar un Acta.'
        );
        return;
      } else {
        this.loading2 = true;
        let result = await this.deleteDET(this.selectData2);
        if (!result) {
          this.alert('error', 'No se pudo eliminar el bien del acta', '');
        } else {
          this.alert('success', 'Bien eliminado correctamente', '');
          await this.getGoodsByExpedient(this.dataExpediente.id);
          await this.getDetailProceedingsDevollution(this.actaDefault.id);
        }
      }
    }
  }
  async rowSelectedOne(event: any) {
    const { data } = event;
    this.selectData = data;
    await this.getStatusGoodService(this.selectData.status);
  }
  rowSelectedTwo(event: any) {
    const { data } = event;
    this.selectData2 = data;
  }
  async getStatusGoodService(status: any) {
    this.statusGoodService.getById(status).subscribe({
      next: async (resp: any) => {
        // this.statusGood_ = resp.description;
        this.form2.patchValue({
          estatusBien: resp.description,
        });
        // this.statusGoodForm.get('statusGood').setValue(resp.description)
      },
      error: err => {
        this.statusGood_ = '';
        this.form2.patchValue({
          estatusBien: null,
        });
        // this.statusGoodForm.get('statusGood').setValue('')
      },
    });
  }

  async deleteDET(good: any) {
    const valid: any = await this.getGoodsDelete(good.numberGood);
    if (valid != null) {
      let obj: any = {
        numberGood: good.numberGood,
        numberProceedings: this.actaDefault.id,
      };

      let result = await this.deleteDetailProcee(obj);
      return result;
    } else {
      return false;
    }
  }

  async getGoodsDelete(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.goodService
        .getByExpedient_(this.dataExpediente.id, params)
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

  async deleteDetailProcee(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceDetailProc.deleteDetailProcee(params).subscribe({
        next: data => {
          // console.log('data', data);
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

  initSolicitud() {
    const { statusProceedings, universalFolio } = this.formActReception.value;
    if (
      statusProceedings != 'CERRADA' &&
      statusProceedings &&
      !this.pufValidaClave()
    ) {
      if (!universalFolio) {
        this.alertQuestion(
          'question',
          'Se generará un nuevo folio de escaneo para el Acta abierta',
          '¿Deseas continuar?'
        ).then(res => {
          if (res.isConfirmed) {
            this.notificationService
              .getByFileNumber(this.dataExpediente.id)
              .subscribe({
                next: async resp => {
                  await this.generateDocument(
                    this.formActReception.value,
                    resp.data[0].max,
                    true
                  );
                  await this.generateDocument(
                    this.formActReception.value,
                    resp.data[0].max,
                    false
                  );
                  await this.getReport();
                },
                error: err => {
                  this.alert(
                    'error',
                    'Ocurrió un error al obtener el Número de Volante máximo',
                    ''
                  );
                },
              });
          }
        });
      } else {
        this.alertQuestion(
          'question',
          'El acta ya tiene folio de escaneo',
          '¿Quiere reimprimir la solicitud de digitalización?'
        ).then(res => {
          if (res.isConfirmed) {
            this.getReport();
          }
        });
      }
    } else {
      if (statusProceedings == 'CERRADA') {
        this.alertQuestion(
          'question',
          'Se reimprimirá la solicitud de digitalización',
          '¿Deseas continuar?'
        ).then(res => {
          if (res.isConfirmed) {
            this.getReport();
          }
        });
      } else {
        this.alert(
          'warning',
          'No se puede generar el folio de escaneo en un acta ya cerrada o clave inválida',
          ''
        );
      }
    }
  }
  async generateDocument(
    form: any,
    flyerNumber: number | string,
    valFolio?: boolean
  ) {
    const documents: IDocuments = {
      numberProceedings: this.dataExpediente.id,
      keySeparator: 60,
      keyTypeDocument: 'RIF',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `ACTA ${form.keysProceedings}`,
      significantDate: this.datePipe.transform(new Date(), 'MM/yyyy'),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.dataUser.preferred_username,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: flyerNumber,
      goodNumber: null,
      numberDelegationRequested: this.delegation,
      numberDepartmentRequest: this.departamentNumber,
      numberSubdelegationRequests: this.subdelegationNumber,
    };
    this.documentsService.create(documents).subscribe({
      next: async response => {
        console.log(response);
        if (valFolio) {
          this.formActReception.patchValue({
            universalFolio: response.id,
          });
          await this.actualizarActa(response.id);
          this.alert('success', `Folio de Escaneo generado correctamente`, ``);
        }
      },
      error: err => {
        console.log(err);
        this.alert('warning', 'No se pudo generar el folio', err.error.message);
      },
    });
  }
  openScannerPage() {
    const { universalFolio, statusProceedings, keysProceedings } =
      this.formActReception.value;
    if (
      (statusProceedings != 'CERRADA' && statusProceedings != null) ||
      !keysProceedings
    ) {
      if (universalFolio) {
        this.alertQuestion(
          'question',
          'Se abrirá la pantalla de escaneo para el folio de escaneo del Acta abierta',
          '¿Deseas continuar?'
        ).then(res => {
          if (res.isConfirmed) {
            this.router.navigate([`/pages/general-processes/scan-documents`], {
              queryParams: {
                origin: 'FACTDESACTASRIF',
                folio: universalFolio,
                expedient: this.dataExpediente.id,
                cveActa: this.actaDefault.id,
              },
            });
          }
        });
      } else {
        this.alert('warning', 'No existe folio de escaneo a escanear', '');
      }
    } else {
      this.alert(
        'warning',
        'No se puede escanear para un Acta que no esté abierta',
        ''
      );
    }
  }

  async getReport() {
    const { universalFolio } = this.formActReception.value;
    if (!universalFolio) {
      return this.alert(
        'warning',
        'No tiene folio de escaneo para imprimir',
        ''
      );
    }

    let params = {
      pn_folio: universalFolio,
    };
    this.siabService.fetchReport('RGERGENSOLICDIGIT', params).subscribe({
      next: res => {
        const blob = new Blob([res], { type: 'application/pdf' });
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
      },
      error: (error: any) => {
        this.alert('warning', 'No se pudo generar el reporte', '');
      },
    });
  }
  openScannerPageView() {
    const { universalFolio } = this.formActReception.value;
    if (!universalFolio) {
      return this.alert(
        'warning',
        'No tiene folio de escaneo para imprimir',
        ''
      );
    }
    this.documentsForDictumService.getByFolio(universalFolio).subscribe({
      next: response => {
        if (response.data[0].scanStatus == 'ESCANEADO') {
          this.alertQuestion(
            'question',
            'Se abrirá la pantalla de escaneo para visualizar las imágenes',
            '¿Deseas continuar?'
          ).then(res => {
            if (res.isConfirmed) {
              this.router.navigate(
                [`/pages/general-processes/scan-documents`],
                {
                  queryParams: {
                    origin: 'FACTDESACTASRIF',
                    folio: universalFolio,
                    expedient: this.dataExpediente.id,
                    cveActa: this.actaDefault.id,
                  },
                }
              );
            }
          });
        } else {
          this.alert('warning', 'El Folio no se encuentra escaneado', '');
        }
      },
      error: err => {
        this.alert('warning', 'El Folio no existe', '');
      },
    });
  }

  async cerrarActa() {
    const {
      statusProceedings,
      affair,
      destructionMethod,
      comptrollerWitness,
      responsible,
      universalFolio,
    } = this.formActReception.value;
    if (statusProceedings == 'CERRADA')
      return this.alert('warning', 'El acta ya está cerrada', '');
    // OBTENCIÓN DE CARGO //
    let cUSUVAL: any = await this.valCargo();
    console.log(cUSUVAL);
    if (cUSUVAL != 'ATES')
      return this.alert(
        'warning',
        'Usuario sin privilegios para cerrar el Acta.',
        ''
      );
    // PUF_VALIDA_CLAVE
    if (this.pufValidaClave())
      return this.alert(
        'warning',
        'Clave de Acta inconsistente',
        'Verifique e intente nuevamente'
      );
    if (!affair)
      return this.alert(
        'warning',
        'Debe especificar la entidad que Autoriza',
        'Verifique e intente nuevamente'
      );
    if (!destructionMethod)
      return this.alert(
        'warning',
        'Debe especificar el Número de Sesión',
        'Verifique e intente nuevamente'
      );
    if (!comptrollerWitness)
      return this.alert(
        'warning',
        'Debe especificar el Número de caso',
        'Verifique e intente nuevamente'
      );
    if (!responsible)
      return this.alert(
        'warning',
        'Debe especificar el Responsable',
        'Verifique e intente nuevamente'
      );
    if (!universalFolio)
      return this.alert(
        'warning',
        'No se tiene Folio de Escaneo',
        'Verifique e intente nuevamente'
      );

    // VALIDAMOS DOCUMENTOS //
    let lnuContador: any = await this.getValScaningFolio(universalFolio);
    if (lnuContador == 0)
      return this.alert(
        'warning',
        'El acta no tiene documentos escaneados',
        'No se puede cerrar'
      );
    if (this.data2.count() == 0)
      return this.alert(
        'warning',
        'El acta no tiene ningún bien asignado',
        'No se puede cerrar'
      );
    this.alertQuestion(
      'question',
      'Se cerrará el Acta',
      '¿Desea Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        const { elaborationDate } = this.formActReception.value;
        if (!elaborationDate)
          return (
            this.formActReception.controls[
              'elaborationDate'
            ].markAllAsTouched(),
            this.alert(
              'warning',
              'La fecha de elaboración no puede ser vacía',
              ''
            )
          );
        let dateElaboration: Date | string;
        if (typeof elaborationDate == 'string') {
          dateElaboration = elaborationDate.split('/').reverse().join('-');
        } else {
          dateElaboration = elaborationDate;
        }
        let body: IProccedingsDeliveryReception = {};
        body.affair = this.formActReception.value.affair;
        body.witness1 = this.formActReception.value.witness1;
        body.witness2 = this.formActReception.value.witness2;
        body.elaborationDate = dateElaboration;
        body.statusProceedings = 'CERRADA';
        body.responsible = this.formActReception.value.responsible;
        body.destructionMethod = this.formActReception.value.destructionMethod;
        body.comptrollerWitness =
          this.formActReception.value.comptrollerWitness;
        body.observations = this.formActReception.value.observations;
        body.universalFolio = this.formActReception.value.universalFolio;
        this.loadingBtn = true;
        this.proceedingsDeliveryReceptionService
          .editProceeding(this.actaDefault.id, body)
          .subscribe({
            next: async data => {
              this.formActReception.patchValue({
                statusProceedings: 'CERRADA',
              });

              let obj = {
                pActaNumber: this.actaDefault.id,
                pStatusActa: 'CERRADA',
                pVcScreen: 'FACTDESACTASRIF',
                pUser: this.authService.decodeToken().preferred_username,
              };

              await this.updateGoodEInsertHistoric(obj);

              this.alertInfo(
                'success',
                'Se cerró el Acta correctamente',
                'También se realizó el cambio de estatus de los bienes'
              );
              this.loadingBtn = false;
              this.actaCerrada = false;
              this.getGoodsByExpedient(this.dataExpediente.id);
              this.getDetailProceedingsDevollution(this.actaDefault.id);
            },
            error: error => {
              this.loadingBtn = false;
              this.alert('error', 'Ocurrió un error al cerrar el Acta', '');
            },
          });
      }
    });
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
  // PUF_VALIDA_CLAVE
  pufValidaClave(): boolean {
    const { keysProceedings } = this.formActReception.value;
    let val = false;
    for (const part of keysProceedings.split('/')) {
      if (!part) {
        val = true;
      }
    }
    return val;
  }
  // VALIDAMOS EL CARGO //
  async valCargo() {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;

    params[
      'filter.user'
    ] = `${SearchFilter.EQ}:${this.dataUser.preferred_username}`;
    return new Promise<string>((resolve, reject) => {
      this.securityService.getAllUsersTracker(params).subscribe({
        next: (data: any) => {
          resolve(
            data.data[0].postKey ? data.data[0].postKey.substring(0, 4) : 'XX'
          );
        },
        error: error => {
          resolve('XX');
        },
      });
    });
  }

  // VALIDAMOS FOLIOS ESCANEADOS //
  async getValScaningFolio(folio: number | string) {
    return new Promise((resolve, reject) => {
      this.documentsService.getByFolio(folio).subscribe({
        next: (response: any) => {
          if (response.data[0].scanStatus == 'ESCANEADO') {
            resolve(1);
          } else {
            resolve(0);
          }
        },
        error(err) {
          resolve(0);
        },
      });
    });
  }
  async goBackScanning(
    idActa: number,
    idExpedient: string | number,
    folio: number | string
  ) {
    this.formActReception.patchValue({
      universalFolio: folio,
    });
    await this.getExpedient(idExpedient);
    await this.getActa(idActa);
  }
  async getExpedient(id: string | number) {
    this.expedientService.getById(id).subscribe({
      next: response => {
        this.formExpedient.patchValue(response);
        this.dataExpediente = response;
        this.getGoodsByExpedient(this.dataExpediente.id);
      },
      error: error => {
        this.dataExpediente = null;
      },
    });
  }

  async getActa(idActa: string | number) {
    this.proceedingsDeliveryReceptionService
      .getProceedingsById2(idActa)
      .subscribe({
        next: async response => {
          this.actaDefault = response.data[0];
          if (this.actaDefault.statusProceedings == 'CERRADA')
            this.actaCerrada = false;
          else this.actaCerrada = true;
          let date = response.data[0].elaborationDate;
          response.data[0].elaborationDate = !date
            ? null
            : this.datePipe.transform(
                await this.correctDate(date.toString()),
                'dd/MM/yyyy'
              );
          this.formActReception.patchValue(response.data[0]);

          this.getDetailProceedingsDevollution(this.actaDefault.id);
        },
      });
  }
}
