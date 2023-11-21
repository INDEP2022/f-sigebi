import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  filter,
  Observable,
  skip,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ITransfActaEntrec } from 'src/app/core/models/ms-notification/notification.model';
import { IDetailWithIndEdo } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AbandonmentsDeclarationTradesService } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from './../../../../common/repository/interfaces/list-params';
import { GOODSEXPEDIENT_COLUMNS_GOODS } from './columns1';
import { COLUMNS2 } from './columns2';
import { ConfirmationDonationActsComponent } from './confirmation-donation-acts/confirmation-donation-acts.component';
import { SearchActasComponent } from './search-actas/search-actas.component';
import { SearchExpedientComponent } from './search-expedient/search-expedient.component';
import { ActasConvertionCommunicationService } from './services/services';
export class GoodsToReception {
  numberProceedings: string;
  numberGood: number;
  amount: number;
}

@Component({
  selector: 'app-donation-acts',
  templateUrl: './donation-acts.component.html',
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
export class DonationActsComponent extends BasePage implements OnInit {
  //

  actForm: FormGroup;
  formTable1: FormGroup;
  claveActaForm: FormGroup;
  actaRecepttionForm: FormGroup;
  form: FormGroup;
  form2: FormGroup;
  goodPDS: IGood[] = [];
  selectData: any = null;
  //DATOS DE USUARIO
  act2Valid = false;
  delUser: string;
  subDelUser: string;
  departmentUser: string;
  totalItems3: number = 0;
  loadingGoods = false;
  initialdisabled = true;

  navigateProceedings = false;
  goodPDS1: LocalDataSource = new LocalDataSource();
  show: boolean = false;
  minDateFecElab = new Date();
  show2: boolean = false;
  idProceeding: string;
  research = false;
  columnFilters: any = [];
  columnFilters2: any = [];
  proceedingData: any[] = [];
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsNavigate: number = 0;
  newLimitparamsActNavigate = new FormControl(1);
  params8 = new BehaviorSubject<ListParams>(new ListParams());
  dataGoodAct = new LocalDataSource();
  paramsDataGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDataGoods: number = 0;
  limitDataGoods = new FormControl(10);
  settings1: any;
  records = new DefaultSelect(['A', 'NA', 'D', 'NS']);
  isEnableActa: boolean = true;
  isEnableActacvc: boolean = true;
  isEnableEstado: boolean = true;
  isEnableDon: boolean = true;
  isEnableObservaciones: boolean = true;
  isEnableFecElaboracion: boolean = true;
  isEnableNombreEntrega: boolean = true;
  isEnableFecDonacion: boolean = true;
  isEnableNombreRecibe: boolean = true;
  isEnableDireccion: boolean = true;
  isEnableAuditor: boolean = true;
  isEnableFolio: boolean = true;
  isEnableTestigo: boolean = true;
  response: boolean = false;
  transferSelect = new DefaultSelect();
  totalItems: number = 0;
  recibeSelect = new DefaultSelect();
  adminSelect = new DefaultSelect();
  paramsOne = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  noExpe: string = '';
  avPrevia: string = '';
  caPenal: string = '';
  noTranferente: string = '';
  //NAVEGACION DE TABLA DE BIENES DE ACTA
  paramsDataGoodsAct = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDataGoodsAct: number = 0;
  limitDataGoodsAct = new FormControl(10);
  tiExpe: string = '';
  columns: any[] = [];
  columns2: any[] = [];
  settings2: any = [];
  private numSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  loadingOne: boolean = false;
  loadingTwo: boolean = false;
  num$: Observable<number> = this.numSubject.asObservable();
  datas: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  varOne: string;
  varTwo: string;
  varThree: string;
  varFour: string;
  varFive: string;
  varObjectFinal: any[] = [];
  varObjectFinalModal: any[] = [];
  varCreateObject: any;
  varDeleteObject: any;

  private actSelectSubscription: Subscription = new Subscription();

  //

  dataExpediente: any = null;
  actaDefault: any = null;
  loading2: boolean = false;
  dataRecepcion: any[] = [];
  statusGood_: any;
  disabledSend: boolean = false;
  delegation: any = null;
  subdelegation: any = null;
  areaDict: any = null;
  newRegister: any;
  arrayDele = new DefaultSelect<any>();
  dele = new DefaultSelect<any>();
  trans = new DefaultSelect<any>();
  actaCerrada: boolean = true;
  loadingBtn: boolean = false;

  years: number[] = [];
  currentYear: number = new Date().getFullYear();
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
  valClave: boolean = true;
  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private serviceGood: GoodService,
    private serviceDetailProceeding: DetailProceeDelRecService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    private goodService: GoodService,
    private serviceNotification: NotificationService,
    private modalService: BsModalService,
    private authService: AuthService,
    private serviceUser: UsersService,
    private serviceRNomencla: ParametersService,
    private serviceDetailProc: DetailProceeDelRecService,
    private goodprocessService: GoodprocessService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private GoodprocessService_: GoodprocessService,
    private statusGoodService: StatusGoodService,
    private rNomenclaService: RNomenclaService,
    private transferenteService: TransferenteService,
    private parametersService: ParametersService,
    private abandonmentsService: AbandonmentsDeclarationTradesService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: GOODSEXPEDIENT_COLUMNS_GOODS,
      rowClassFunction: (row: any) => {
        const di_disponible = row.data.di_disponible;
        if (di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    this.settings2 = { ...this.settings, actions: false, columns: COLUMNS2 };
  }

  controls() {
    return this.actForm.controls;
  }

  ngOnInit(): void {
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }

    this.initForm();
    this.initFilters();
    this.getDataSelectInitial();
    this.actasConvertionCommunicationService.ejecutarFuncion$.subscribe(
      (next: any) => {
        // console.log('SI WILM', next);
        this.ejecutarFuncion();
      }
    );

    this.form.get('year').setValue(moment(new Date()).format('YYYY'));
    this.form.get('mes').setValue(moment(new Date()).format('MM'));
  }

  initFilters() {
    // FILTRO PARA PRIMERA TABLA **** BIENES **** //
    this.datas
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

            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              amount: () => (searchFilter = SearchFilter.EQ),
              minutesKey: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsOne = this.pageFilter(this.paramsOne);
          this.getGoodsByStatus(this.dataExpediente.id);
        }
      });

    this.paramsOne
      .pipe(
        skip(1),
        tap(() => {
          this.getGoodsByStatus(this.dataExpediente.id);
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

  async getGoodsByStatus(id: number) {
    this.loading = true;
    let params: any = {
      ...this.paramsOne.getValue(),
      ...this.columnFilters,
    };
    params['sortBy'] = `goodNumber:ASC`;
    let body = {
      proceedingsNumber: id,
      typeMinutes: 'DONACION',
    };
    this.goodprocessService
      .GetTypeMinuteDetailDelivery(body, params)
      .subscribe({
        next: data => {
          let result = data.data.map(async (item: any) => {
            let obj = {
              vcScreen: 'FACTDESACTASDONAC',
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
            // this.dataTableGood_ = data.data;
            this.datas.load(data.data);
            this.datas.refresh();
            // Define la función rowClassFunction para cambiar el color de las filas en función del estado de los bienes
            this.totalItems = data.count;
            this.loading = false;
            // // console.log(this.bienes);
          });
        },
        error: error => {
          this.loading = false;
          this.datas.load([]);
          this.datas.refresh();
          this.totalItems = 0;
        },
      });
  }

  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.goodprocessService.getScreenGood(body).subscribe({
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

  async initForm() {
    this.form = this.fb.group({
      no_expediente: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      no_transferente: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      av_previa: [null, [Validators.pattern(STRING_PATTERN)]],
      ca_penal: [null, [Validators.pattern(STRING_PATTERN)]],
      ti_expediente: [null, [Validators.pattern(STRING_PATTERN)]],
      acta: [null],
      transfer: [null],
      ident: [null],
      recibe: [null],
      admin: [null],
      folio: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      year: [null],
      mes: [null],
    });

    this.form2 = this.fb.group({
      estatusPrueba: [null],
    });

    this.claveActaForm = this.fb.group({
      acta: [null],
      type: [null],
      claveTrans: [null],
      administra: [null],
      cveReceived: [null, Validators.required],
      consec: [null],
      anio: [null],
      mes: [null],
    });

    this.actForm = this.fb.group({
      actSelect: [],
      status: [],
      trans: [],
      don: [],
      es_acta: [null],
      cv_acta: [],
      observations: [],
      fec_elaboracion: [],
      nom_entrega: [],
      fec_don: [],
      nom_rec: [],
      dir: [],
      audit: [],
      fol_esc: [],
      tes_con: [],
    });

    this.actaRecepttionForm = this.fb.group({
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
      datePhysicalReception: [null],
      elaboradate: [null, Validators.required],
      statusActa: [null],
      folio: [null],
    });

    this.actaRecepttionForm.patchValue({
      elaboradate: await this.getDate(),
      datePhysicalReception: await this.getDate(),
    });
  }

  async resetForm() {
    this.dataExpediente = null;
    this.actaDefault = null;
    this.selectData = null;
    this.selectData2 = null;
    this.form.reset();
    this.actForm.reset();
    this.form2.reset();
    this.actaRecepttionForm.reset();
    this.claveActaForm.reset();
    this.totalItems = 0;
    this.totalItems2 = 0;
    this.totalItems3 = 0;
    this.datas.load([]);
    this.data2.load([]);

    this.actaRecepttionForm.patchValue({
      elaboradate: await this.getDate(),
      datePhysicalReception: await this.getDate(),
    });
    this.claveActaForm.get('anio').setValue(this.currentYear);
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  getAllBLKByFilters() {
    this.resCloseForm();
    this.paramsActNavigate.next(new ListParams());
    this.resetFormTwo();
    if (this.noExpe == null || '') {
      this.alert('warning', 'Advertencia', `Por favor ingrese un expediente`);
    } else {
      if (this.noExpe == '' || undefined || null) {
        this.form.reset();
      }
      let params = new HttpParams();
      const newParams = new ListParams();
      newParams.limit = 1;
      this.paramsActNavigate.next(newParams);
      if (this.noExpe != null) {
        params = params.append('filter.id', this.noExpe);
        this.expedientService.getExpeidentByFilters(params).subscribe({
          next: response => {
            this.form.controls['av_previa'].setValue(
              response.data[0].preliminaryInquiry
            );
            this.form.controls['no_transferente'].setValue(
              response.data[0].transferNumber
            );
            this.form.controls['ca_penal'].setValue(
              response.data[0].criminalCase
            );
            this.form.controls['ti_expediente'].setValue(
              response.data[0].expedientType
            );
            this.navigateProceedings = true;
            this.getGoodsByExpedient();
          },
          error: error => {
            if (error.status == 400) {
              this.alert(
                'warning',
                'Advertencia',
                `No se encontraron expedientes asociados al número -${this.noExpe}-`
              );
              this.form.reset();
            } else {
              this.alert('error', 'Error', 'Ha ocurrido un error');
              this.form.reset();
            }
          },
        });

        let paramsGoodTwo = new HttpParams();
        paramsGoodTwo = paramsGoodTwo.append('filter.fileNumber', this.noExpe);
        this.getDataTableOne(paramsGoodTwo);

        let paramsRecep = new HttpParams();
        paramsRecep = paramsRecep.append('filter.numFile', this.noExpe);
        this.serviceDetailProceeding
          .getGoodsByProceeding(paramsRecep)
          .subscribe({
            next: response => {
              console.log('Aqui va todo el arreglo inicial: ', response.data);
              this.varObjectFinalModal = response.data;
              this.varObjectFinal = response.data[0];
              this.actForm.controls['actSelect'].setValue(
                response.data[0].keysProceedings
              );
              this.actForm.controls['status'].setValue(response.data[0].id);
              this.numSubject.next(response.data[0].id);
              // this.actForm.controls['trans'].setValue(response.data[0].numTransfer);
              this.actForm.controls['don'].setValue(
                response.data[0].receiptKey
              );
              this.actForm.controls['es_acta'].setValue(
                response.data[0].statusProceedings
              );

              this.varOne = response.data[0].keysProceedings;
              this.varTwo = response.data[0].universalFolio;
              this.varThree = response.data[0].comptrollerWitness;
              this.varFour = response.data[0].statusProceedings;
              this.varFive = response.data[0].id;

              this.actForm.controls['cv_acta'].setValue(
                response.data[0].keysProceedings
              );
              this.actForm.controls['observations'].setValue(
                response.data[0].observations
              );

              let elaborationDate = new Date(response.data[0].elaborationDate);
              let formattedDate = this.datePipe.transform(
                elaborationDate,
                'dd/MM/yyyy'
              );
              this.actForm.controls['fec_elaboracion'].setValue(formattedDate);
              this.actForm.controls['nom_entrega'].setValue(
                response.data[0].witness1
              );

              let elaborationDateTwo = new Date(
                response.data[0].elaborationDate
              );
              let formattedDateTwo = this.datePipe.transform(
                elaborationDateTwo,
                'dd/MM/yyyy'
              );
              this.actForm.controls['fec_don'].setValue(formattedDateTwo);

              this.actForm.controls['nom_rec'].setValue(
                response.data[0].witness2
              );
              this.actForm.controls['dir'].setValue(response.data[0].address);
              this.actForm.controls['audit'].setValue(
                response.data[0].responsible
              );
              this.actForm.controls['fol_esc'].setValue(
                response.data[0].universalFolio
              );
              this.actForm.controls['tes_con'].setValue(
                response.data[0].comptrollerWitness
              );
            },
            error: error => {
              if (error.status == 400) {
                this.alert(
                  'warning',
                  'Advertencia',
                  `No se encontraron registros de actas de entrega recepción`
                );
                this.alert(
                  'warning',
                  'Advertencia',
                  `No se encontraron registros de detalles actas de entrega recepción`
                );
                this.data2.load([]);
                this.actForm.reset();
              } else {
                this.alert('error', 'Error', 'Ha ocurrido un error');
                this.actForm.reset();
                this.data2.load([]);
              }
            },
          });
      }
    }
  }

  closeExp() {
    if (this.noExpe == null || '') {
      this.alert('warning', 'Advertencia', `Por favor ingrese un expediente`);
    } else {
      if (this.varOne == null) {
        this.alert('warning', 'Advertencia', `No existe acta para cerrar`);
      } else if (
        this.actForm.controls['actSelect'].value == null ||
        undefined ||
        ''
      ) {
        this.alert('warning', 'Advertencia', `No existe acta para cerrar`);
      } else if (this.data2.count() === 0) {
        this.alert(
          'warning',
          'Advertencia',
          `El acta no tiene ningun bien asignado, no se puede cerrar`
        );
      } else if (this.varFour == 'CERRADA') {
        this.alert('warning', 'Advertencia', `El acta ya esta cerrada`);
      } else {
        let data: any[] = this.varObjectFinalModal;
        let config: ModalOptions = {
          initialState: {
            data,
            callback: (next: boolean) => {
              if (next) console.log('');
            },
          },
          class: 'modal-sl modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        // console.log('Config: ', config);
        const modalRef = this.modalService.show(
          ConfirmationDonationActsComponent,
          config
        );
        modalRef.onHidden.subscribe(() => {
          this.getAllBLKByFilters();
        });
      }
    }
  }

  async rowSelectedOne(event: any) {
    // this.varCreateObject = event;
    const { data } = event;
    this.selectData = data;
    await this.getStatusGoodService(this.selectData.status);
    // this.form2.get('estatusPrueba').setValue(data.description);
  }

  async desSelectRow(event: any) {
    // this.selectData = null;
    // this.form2.get('estatusPrueba').reset();
  }
  selectData2: any = null;
  rowSelectedTwo(event: any) {
    this.varDeleteObject = event;
    this.selectData2 = event.data;
    // console.log("Este es el objeto ELIMINADO: ", event);
  }

  createTableTwo() {
    if (this.varCreateObject == null) {
      this.alert(
        'warning',
        'Advertencia',
        `Seleccione primero el bien a asignar`
      );
    } else {
      if (this.varOne == null) {
        this.alert(
          'warning',
          'Advertencia',
          `No existe un acta, en la cual asignar el bien. capture primero el acta`
        );
      } else {
        if (this.varFour == 'CERRADA') {
          this.alert(
            'warning',
            'Advertencia',
            `El acta ya esta cerrada, no puede realizar modificaciones a esta`
          );
        } else {
          let body: GoodsToReception = new GoodsToReception();
          body.numberGood = this.varCreateObject.data?.id;
          body.numberProceedings = this.varFive;
          body.amount = this.varCreateObject.data?.quantity;
          // console.log("El objeto antes de que se vaya: ", body, " - esto se recibe- ", this.varCreateObject);
          this.serviceDetailProceeding.postRegister(body).subscribe({
            next: response => {
              this.varCreateObject = null;
              this.alert('success', 'Registro creado correctamente', '');
              this.getAllBLKByFilters();
              this.getDataTableTwo();
            },
            error: error => {
              if (error.status == 400) {
                this.alert('warning', 'Advertencia', `El registro ya existe`);
              } else {
                this.alert('error', 'Error', 'Ha ocurrido un error');
              }
            },
          });
        }
      }
    }
  }

  deleteTableTwo() {
    if (this.varDeleteObject == null) {
      this.alert('warning', 'Advertencia', `Debe seleccionar un detalle acta`);
    } else {
      if (this.varDeleteObject.data.numberGood == null) {
        this.alert(
          'warning',
          'Advertencia',
          `Debe seleccionar un bien que forme parte del acta primero`
        );
      } else {
        if (this.varOne == null) {
          this.alert(
            'warning',
            'Advertencia',
            `Debe especificar/buscar el acta para despues eliminar el bien de esta`
          );
        } else {
          if (this.varFour == 'CERRADA') {
            this.alert(
              'warning',
              'Advertencia',
              `El Acta ya Esta cerrada, no puede realizar modificaciones a esta`
            );
          } else {
            let body: GoodsToReception = new GoodsToReception();
            body.numberGood = this.varDeleteObject.data?.numberGood;
            body.numberProceedings =
              this.varDeleteObject.data?.numberProceedings;
            // console.log("El objeto antes de que se vaya: ", body, " - esto se recibe- ", this.varDeleteObject);
            this.serviceDetailProceeding.deleteRegister(body).subscribe({
              next: response => {
                this.varDeleteObject = null;
                this.alert('success', 'Registro eliminado correctamente', '');
                this.getAllBLKByFilters();
                if (this.data2.count() == 1 || 0) {
                  this.data2.load([]);
                }
              },
              error: error => {
                this.alert('error', 'Error', 'Ha ocurrido un error');
              },
            });
          }
        }
      }
    }
  }

  getDataTableOne(param?: HttpParams, filter?: any) {
    if (this.noExpe != '') {
      this.loadingOne = true;
      this.serviceGood.getByFilter(param, filter).subscribe({
        next: response => {
          this.columns = response.data;
          this.datas.load(this.columns);
          this.totalItems = response.count | 0;
          this.datas.refresh();
          this.loadingOne = false;
        },
        error: error => {
          if (error.status == 400) {
            this.alert(
              'warning',
              'Advertencia',
              `No se encontraron registros de bienes`
            );
            this.datas.load([]);
          } else {
            this.alert('error', 'Error', 'Ha ocurrido un error');
            this.datas.load([]);
          }
          this.loadingOne = false;
        },
      });
    }
  }

  getDataTableTwo(params?: any) {
    this.num$
      .pipe(
        filter(num => num !== null),
        switchMap(num =>
          this.serviceDetailProceeding.getGoodsByProceedings(num, params)
        )
      )
      .subscribe({
        next: response => {
          this.varObjectFinal = response.data;
          this.columns2 = response.data;
          this.data2.load(this.columns2);
          this.totalItems2 = response.count || 0;
          this.data2.refresh();
          this.loadingOne = false;
        },
        error: error => {
          this.loadingOne = false;
        },
      });
  }

  resetFormTwo() {
    this.actForm.reset();
    this.datas.load([]);
    this.data2.load([]);
  }

  resCloseForm() {
    this.isEnableActa = true;
    this.isEnableEstado = true;
    this.isEnableDon = true;
    this.isEnableObservaciones = true;
    this.isEnableFecElaboracion = true;
    this.isEnableNombreEntrega = true;
    this.isEnableActacvc = true;
    this.isEnableFecDonacion = true;
    this.isEnableNombreRecibe = true;
    this.isEnableDireccion = true;
    this.isEnableAuditor = true;
    this.isEnableFolio = true;
    this.isEnableTestigo = true;
  }

  resNewForm() {
    this.actForm.reset();
    this.checkChange();
    this.verifyActAndTransfer();
    this.isEnableActa = false;
    this.isEnableEstado = false;
    this.isEnableDon = false;
    this.isEnableObservaciones = false;
    this.isEnableFecElaboracion = false;
    this.isEnableNombreEntrega = false;
    this.isEnableActacvc = false;
    this.isEnableFecDonacion = false;
    this.isEnableNombreRecibe = false;
    this.isEnableDireccion = false;
    this.isEnableAuditor = false;
    this.isEnableFolio = false;
    this.isEnableTestigo = false;
  }

  getRecibe(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        this.recibeSelect = new DefaultSelect(res.data, res.count);
      },
      err => console.log(err)
    );
  }
  getAdmin(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        this.adminSelect = new DefaultSelect(res.data, res.count);
      },
      err => {
        this.adminSelect = new DefaultSelect();
      }
    );
  }

  clearInputs() {}

  async getGoodByStatusPDS() {
    this.loadingGoods = true;

    let params = {
      ...this.params8.getValue(),
      ...this.columnFilters,
    };

    params['filter.status'] = `$ilike:ADA`;
    this.serviceGood.getGoodByStatusPDS(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FACTDESACTASDONAC',
            goodNumber: item.id,
          };
          const di_dispo = await this.goodStatus(obj);
          item['di_disponible'] = di_dispo;
        });
        await Promise.all(result);
        this.show2 = false;
        this.goodPDS = response.data;
        this.goodPDS1.load(response.data);
        this.totalItems3 = response.count;
        this.loadingGoods = false;
      },
      error: error => (this.loadingGoods = false),
    });
  }

  //StatusBien
  async goodStatus(id: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.goodprocessService.getScreenGood2(id).subscribe({
        next: async (response: any) => {
          if (response.data) {
            resolve('S');
          } else {
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }

  getGoodsByExpedient() {
    //Validar si hay un acta abiert
    const paramsF = new FilterParams();
    paramsF.limit = 1;
    paramsF.addFilter('numFile', this.form.get('no_expediente').value);
    paramsF.addFilter('typeProceedings', 'DONACION', SearchFilter.IN); //!Un in
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        if (res.data.length > 0) {
          console.log('Entró');
          this.proceedingData = res.data;
          this.totalItemsNavigate = res.count;
          console.log(this.proceedingData);
          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.idProceeding = dataRes.id;
          console.log(dataRes);
          this.fillIncomeProceeding(dataRes, '');
          console.log(typeof dataRes);
        } else {
          console.log('Entro en else de res');
          this.initialdisabled = false;
          this.loading = false;
          this.minDateFecElab = new Date();
        }
      },
      err => {
        console.log('Entro a error');
        console.log(err);
        this.loading = false;
        this.initialdisabled = false;
        this.minDateFecElab = new Date();
      }
    );
  }

  fillIncomeProceeding(dataRes: any, action: string) {
    console.log(dataRes.id);
    console.log('AAAAAA', dataRes.keysProceedings);
    console.log({ msg: 'Respuesta fill', data: dataRes });
    const realDate = new Date(dataRes.elaborationDate).toLocaleString('en-US', {
      timeZone: 'GMT',
    });
    console.log({
      msg: 'Fecha de la BD',
      data: new Date(
        new Date(dataRes.elaborationDate).toLocaleString('en-US', {
          timeZone: 'GMT',
        })
      ),
    });
    console.log({ msg: 'Fecha de la BD', data: dataRes.datePhysicalReception });

    const modelDetail: IDetailWithIndEdo = {
      no_acta: dataRes.id,
      page: this.paramsDataGoodsAct.getValue().page,
      perPage: this.paramsDataGoodsAct.getValue().limit,
    };
    this.serviceDetailProc.getAllwithEndFisico(modelDetail).subscribe(
      async res => {
        console.log(res);
        const incomeData = res.data;
        this.totalItemsDataGoodsAct = res.count;
        this.actForm.get('es_acta').setValue(dataRes.statusProceedings);
        console.log('ACTA: ', this.actForm.get('es_acta').value);
        this.actForm.get('dir').setValue(dataRes.address);
        console.log('DIRECCION:', this.actForm.get('dir').value);
        this.actForm.get('nom_entrega').setValue(dataRes.witness1);
        let elaborationReceipt = new Date(dataRes.dateElaborationReceipt);
        let formattedDate1 = this.datePipe.transform(
          elaborationReceipt,
          'dd/MM/yyyy'
        );
        this.actForm.get('fec_don').setValue(formattedDate1);

        let elaborationDate = new Date(dataRes.elaborationDate);
        let formattedDate = this.datePipe.transform(
          elaborationDate,
          'dd/MM/yyyy'
        );
        this.actForm.get('fec_elaboracion').setValue(formattedDate);
        this.actForm.get('observations').setValue(dataRes.observations);
        this.actForm.get('nom_rec').setValue(dataRes.witness2);
        this.actForm.get('tes_con').setValue(dataRes.comptrollerWitness);
        this.actForm.get('fol_esc').setValue(dataRes.universalFolio);
        this.actForm.get('actSelect').setValue(dataRes.keysProceedings);
        this.actForm.get('cv_acta').setValue(dataRes.keysProceedings);
        this.actForm.get('don').setValue(dataRes.idTypeProceedings);
        this.actForm.get('audit').setValue(dataRes.responsible);
        const splitActa = dataRes.keysProceedings.split('/');
        console.log(splitActa);
        if (['NA', 'ND'].includes(splitActa[0])) {
        }

        this.navigateProceedings = true;
        this.loading = false;
      },
      err => {}
    );
  }

  saveActa() {
    let newProceeding: IProccedingsDeliveryReception = {
      keysProceedings: this.actForm.get('actSelect').value,
      statusProceedings: 'ABIERTA',
      elaborationDate: new Date(this.form.get('fecElab').value).getTime(),
      datePhysicalReception: new Date(
        this.form.get('fecReception').value
      ).getTime(),
      address: this.form.get('direccion').value,
      elaborate:
        localStorage.getItem('username') == 'sigebiadmon'
          ? localStorage.getItem('username')
          : localStorage.getItem('username').toLocaleUpperCase(),
      numFile: this.form.get('expediente').value,
      witness1: this.form.get('entrega').value,
      witness2: this.form.get('recibe2').value,
      typeProceedings: ['D', 'ND'].includes(this.form.get('acta').value)
        ? 'DECOMISO'
        : 'ENTREGA',
      dateElaborationReceipt: new Date(
        this.form.get('fecElabRec').value
      ).getTime(),
      dateDeliveryGood: new Date(this.form.get('fecEntBien').value).getTime(),
      responsible: null,
      destructionMethod: null,
      observations: this.form.get('observaciones').value,
      approvalDateXAdmon: null,
      approvalUserXAdmon: null,
      numRegister: null,
      captureDate: new Date().getTime(),
      numDelegation1: this.form.get('admin').value.numberDelegation2,
      numDelegation2:
        this.form.get('admin').value.numberDelegation2 == 11 ? '11' : null,
      identifier: null,
      label: null,
      universalFolio: null,
      numeraryFolio: null,
      numTransfer: null,
      idTypeProceedings: this.form.get('acta').value,
      receiptKey: null,
      comptrollerWitness: this.form.get('testigo').value,
      numRequest: null,
      closeDate: null,
      maxDate: null,
      indFulfilled: null,
      dateCaptureHc: null,
      dateCloseHc: null,
      dateMaxHc: null,
      receiveBy: null,
      affair: null,
    };
  }

  fillActTwo() {
    let countAct: Number =
      0 +
      (this.form.get('acta').value != null ? 1 : 0) +
      (this.form.get('transfer').value != null ? 1 : 0) +
      (this.form.get('ident').value != null ? 1 : 0) +
      (this.form.get('recibe').value != null ? 1 : 0) +
      (this.form.get('admin').value != null ? 1 : 0) +
      (this.form.get('folio').value != null ? 1 : 0) +
      (this.form.get('year').value != null ? 1 : 0) +
      (this.form.get('mes').value != null ? 1 : 0);

    console.log(countAct);

    const nameAct =
      (this.form.get('acta').value != null ? this.form.get('acta').value : '') +
      '/' +
      (this.form.get('transfer').value != null
        ? this.form.get('transfer').value.clave_transferente
        : '') +
      '/' +
      (this.form.get('ident').value != null
        ? this.form.get('ident').value
        : '') +
      '/' +
      (this.form.get('recibe').value != null
        ? this.form.get('recibe').value.delegation
        : '') +
      '/' +
      (this.form.get('admin').value != null
        ? this.form.get('admin').value.delegation
        : '') +
      '/' +
      (this.form.get('folio').value != null
        ? this.zeroAdd(this.form.get('folio').value.toString(), 5)
        : '') +
      '/' +
      (this.form.get('year').value != null
        ? this.form.get('year').value.toString().substr(2, 2)
        : '') +
      '/' +
      (this.form.get('mes').value != null
        ? this.zeroAdd(this.form.get('mes').value, 2)
        : '');
    this.actForm.get('actSelect').setValue(nameAct);
    this.subscribeToActSelectChanges();
    //Validar Acta 2
    if (countAct === 8) {
      console.log('Está activando aquí');
      countAct = 0;
      this.act2Valid = true;
      this.searchKeyProceeding();
    } else {
      this.act2Valid = false;
    }
  }

  calculateCountAct(): number {
    return (
      (this.form.get('acta').value != null ? 1 : 0) +
      (this.form.get('transfer').value != null ? 1 : 0) +
      (this.form.get('ident').value != null ? 1 : 0) +
      (this.form.get('recibe').value != null ? 1 : 0) +
      (this.form.get('admin').value != null ? 1 : 0) +
      (this.form.get('folio').value != null ? 1 : 0) +
      (this.form.get('year').value != null ? 1 : 0) +
      (this.form.get('mes').value != null ? 1 : 0)
    );
  }

  zeroAdd(number: number, lengthS: number) {
    if (number != null) {
      const stringNum = number.toString();
      let newString = '';
      if (stringNum.length < lengthS) {
        lengthS = lengthS - stringNum.length;
        for (let i = 0; i < lengthS; i++) {
          newString = newString + '0';
        }
        newString = newString + stringNum;
        return newString;
      } else {
        return stringNum;
      }
    } else {
      return null;
    }
  }

  checkChange() {
    if (this.research) {
      console.log('No');
    } else {
      this.actForm.get('actSelect').valueChanges.subscribe(res => {
        if (res != null && res != undefined) {
          this.verifyActAndTransfer();
          this.fillActTwo();
        }
      });
      this.form
        .get('transfer')
        .valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('ident').valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('recibe').valueChanges.subscribe(res => {
        console.log(res);
        console.log(this.delUser);
        if (res != null && res != undefined && res.numberDelegation2) {
          if (res.numberDelegation2 != this.delUser) {
            this.form.get('recibe').reset();
            this.recibeSelect = new DefaultSelect();
            this.alert(
              'warning',
              'La delegación es diferente a la del usuario',
              ''
            );
            return;
          } else {
            this.fillActTwo();
          }
        }
      });
      this.form.get('admin').valueChanges.subscribe(res => {
        const acta = this.actForm.get('actSelect').value;
        const arrAct = acta.split('/');
        const valAct = arrAct[0];
        if (!['NA', 'ND'].includes(valAct)) {
          if (res != null && res != undefined && res.numberDelegation2) {
            if (res.numberDelegation2 != this.delUser) {
              this.alert(
                'warning',
                'La delegación seleccionada es diferente a la del usuario',
                ''
              );
              this.adminSelect = new DefaultSelect();
              this.form.get('admin').reset();
            } else {
              this.fillActTwo();
            }
          }
        } else {
          const paramsF = new FilterParams();
          paramsF.addFilter('delegation', 'CCB', SearchFilter.ILIKE);
          this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
            res => {
              this.adminSelect = new DefaultSelect(res.data, res.count);
              this.form.get('admin').setValue(res.data[0]);
            },
            err => {
              this.adminSelect = new DefaultSelect();
            }
          );
          /* if (res.delegation != 'CCB') {
            if (res != null && res != undefined && res.numberDelegation2) {
              if (res.numberDelegation2 != this.delUser) {
                this.alert(
                  'warning',
                  'La delegación seleccionada es diferente a la del usuario',
                  ''
                );
                this.adminSelect = new DefaultSelect();
                this.form.get('admin').reset();
              } else {
                this.fillActTwo();
              }
            }
          } */
        }
      });
      this.form.get('folio').valueChanges.subscribe(res => {
        if (
          this.form.get('folio').value != null &&
          this.form.get('folio').value.toString().length <= 5
        ) {
          this.fillActTwo();
        }
      });
      this.form.get('year').valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('mes').valueChanges.subscribe(res => this.fillActTwo());
    }
  }

  verifyActAndTransfer() {
    let modelTransf: ITransfActaEntrec = {
      indcap: '',
      no_expediente: this.form.get('no_expediente').value,
      id_tipo_acta: this.form.get('acta').value,
    };

    this.serviceNotification.getTransferenteentrec(modelTransf).subscribe(
      res => {
        this.transferSelect = new DefaultSelect(res.data);
      },
      err => {
        this.transferSelect = new DefaultSelect();
        this.loading = false;
        this.alert('warning', 'No se encontraron transferentes', '');
      }
    );
  }

  getDataUser() {
    const token = this.authService.decodeToken();
    const routeUser = `?filter.id=$eq:${token.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      console.log(res);
      const resJson = JSON.parse(JSON.stringify(res.data[0]));
      this.delUser = resJson.usuario.delegationNumber;
      this.subDelUser = resJson.usuario.subdelegationNumber;
      this.departmentUser = resJson.usuario.departamentNumber;
    });
  }

  private subscribeToActSelectChanges() {
    this.actSelectSubscription = this.actForm
      .get('actSelect')
      .valueChanges.subscribe(res => {
        // Lógica que se debe ejecutar cuando cambia el valor de actSelect
        // Por ejemplo, podrías llamar a fillActTwo() si es necesario
        this.fillActTwo();
      });
  }

  searchKeyProceeding() {}

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
        this.form.controls['no_expediente'].setValue(next.id);
        this.form.controls['av_previa'].setValue(next.preliminaryInquiry);
        this.form.controls['no_transferente'].setValue(next.transferNumber);
        this.form.controls['ca_penal'].setValue(next.criminalCase);
        this.form.controls['ti_expediente'].setValue(next.expedientType);
        this.consultREG_TRANSFERENTES(new ListParams());
        this.getGoodsByStatus(this.dataExpediente.id);
      }
    });
  }

  async searchActa() {
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
    };

    let modalRef = this.modalService.show(SearchActasComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.actaDefault = next;

        if (this.actaDefault.statusProceedings == 'CERRADA')
          this.actaCerrada = false;
        else this.actaCerrada = true;

        this.selectData2 = null;
        this.actaRecepttionForm.reset();

        this.actaRecepttionForm.patchValue({
          cveActa: this.actaDefault.keysProceedings,
          direccion: this.actaDefault.address,
          observaciones: this.actaDefault.observations,
          testigoOIC: this.actaDefault.comptrollerWitness,
          testigoTwo: this.actaDefault.witness1,
          testigoTree: this.actaDefault.witness2,
          respConv: this.actaDefault.responsible,
          datePhysicalReception: new Date(
            this.actaDefault.datePhysicalReception
          ),
          elaboradate: new Date(this.actaDefault.elaborationDate),
          statusActa: this.actaDefault.statusProceedings,
          folio: this.actaDefault.universalFolio,
        });

        this.valClave = false;
        let clave = await this.obtenerValores(this.actaDefault.keysProceedings);
        // this.claveActaForm.patchValue({
        //   acta: clave[0],
        //   type: clave[1],
        //   claveTrans: clave[2],
        //   administra: clave[3],
        //   cveReceived: clave[4],
        //   consec: clave[5],
        //   anio: clave[6],
        //   mes: clave[7],
        // })
        this.getDetailProceedingsDevollution(this.actaDefault.id);
      }
    });
  }

  ejecutarFuncion() {
    this.cleanActa();
  }

  async cleanActa() {
    this.actaRecepttionForm.reset();
    this.claveActaForm.reset();
    this.data2.load([]);
    this.data2.refresh();
    this.totalItems2 = 0;
    this.selectData2 = null;
    this.actaDefault = null;
    this.actaRecepttionForm.patchValue({
      elaboradate: await this.getDate(),
      datePhysicalReception: await this.getDate(),
    });
    this.valClave = true;
    this.claveActaForm.get('anio').setValue(this.currentYear);
  }

  actualizarActa() {
    if (!this.actaDefault) {
      this.alertInfo('warning', 'Debe seleccionar un Acta', '');
      return;
    }
    if (this.actaDefault.statusProceedings == 'CERRADA') {
      this.alertInfo('warning', 'No puede actualizar un Acta cerrada', '');
      return;
    }

    if (!this.actaRecepttionForm.value.elaboradate)
      return (
        this.actaRecepttionForm.get('elaboradate').markAsTouched(),
        this.alert('warning', 'La fecha de elaboración no puede ser vacía', '')
      );

    let obj: any = {
      // keysProceedings: ,
      elaborationDate: this.actaRecepttionForm.value.elaboradate,
      datePhysicalReception:
        this.actaRecepttionForm.value.datePhysicalReception,
      address: this.actaRecepttionForm.value.direccion,
      statusProceedings: 'ABIERTA',
      elaborate: this.authService.decodeToken().preferred_username,
      numFile: this.dataExpediente.id,
      witness1: this.actaRecepttionForm.value.testigoTwo,
      witness2: this.actaRecepttionForm.value.testigoTree,
      typeProceedings: 'DONACION',
      dateElaborationReceipt: null,
      dateDeliveryGood: null,
      responsible: this.actaRecepttionForm.value.respConv,
      destructionMethod: null,
      observations: this.actaRecepttionForm.value.observaciones,
      approvedXAdmon: null,
      approvalDateXAdmon: null,
      approvalUserXAdmon: null,
      numRegister: null,
      captureDate: new Date(),
      numDelegation1: this.delegation,
      numDelegation2: null,
      identifier: null,
      label: null,
      universalFolio: this.actaRecepttionForm.value.folio,
      numeraryFolio: null,
      numTransfer: null,
      idTypeProceedings: 'DON',
      receiptKey: null,
      comptrollerWitness: this.actaRecepttionForm.value.testigoOIC,
      numRequest: null,
      closeDate: null,
      maxDate: null,
      indFulfilled: null,
      dateCaptureHc: null,
      dateCloseHc: null,
      dateMaxHc: null,
      receiveBy: null,
      affair: null,
      numDelegation_1: null,
      numDelegation_2: null,
      file: this.dataExpediente.id,
    };

    this.proceedingsDeliveryReceptionService
      .editProceeding(this.actaDefault.id, obj)
      .subscribe({
        next: async data => {
          this.alertInfo('success', 'Acta actualizada correctamente', '');
        },
        error: error => {
          this.alert('error', 'Ocurrió un error al actualizar el Acta', '');
          // this.loading = false
        },
      });
  }

  returnParseDate_(data: Date) {
    console.log('DATEEEE', data);
    if (!data) return null;
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return formattedDate;
  }

  // OBTENER DATOS DE LA TABLA DET
  async getDetailProceedingsDevollution(id: any) {
    this.loading2 = true;
    // const params = new ListParams();
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
          this.loading2 = false;
          // this.ocultarPaginado = false;
        },
      });
    });
  }

  async getStatusGoodService(status: any) {
    this.statusGoodService.getById(status).subscribe({
      next: async (resp: any) => {
        // console.log('resp.data', resp);
        this.statusGood_ = resp.description;
        // this.statusGoodForm.get('statusGood').setValue(resp.description)
      },
      error: err => {
        this.statusGood_ = '';
        // this.statusGoodForm.get('statusGood').setValue('')
      },
    });
  }

  async getDate() {
    // const formattedDate = moment(date).format('DD-MM-YYYY');

    const fechaEscritura: any = new Date();
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    return _fechaEscritura;
    // { authorizeDate: formattedDate }
    // { emitEvent: false }
  }

  // REG_DEL_ADMIN
  globalGstRecAdm: any = null;
  async consulREG_DEL_ADMIN(lparams: ListParams) {
    // let obj = {
    //   gst_todo: 'TODO',
    //   gnu_delegacion: 0,
    //   gst_rec_adm: 'FILTRAR',
    // };
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let obj = {
      globalGstAll: 'NADA',
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

  // REG_DEL_DESTR
  async consulREG_DEL_DESTR(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');

        params.addFilter('numberDelegation2', lparams.text, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.text, SearchFilter.ILIKE);
      }

    params.addFilter('stageedo', this.stagecreated, SearchFilter.EQ);
    params.sortBy = 'numberDelegation2:ASC';

    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('REG_DEL_DESTR', data);
        let result = data.data.map(async (item: any) => {
          item['cveAdmin'] = item.numberDelegation2 + ' - ' + item.delegation;
        });

        Promise.all(result).then(resp => {
          this.arrayDele = new DefaultSelect(data.data, data.count);
        });
      },
      error: error => {
        this.arrayDele = new DefaultSelect([], 0);
      },
    });
  }

  consultREG_TRANSFERENTES(lparams: ListParams) {
    if (!this.dataExpediente) return;
    if (!this.dataExpediente.transferNumber) return;
    let obj = {
      transfereeNumber: this.dataExpediente.transferNumber,
      expedientType: this.dataExpediente.expedientType,
    };

    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams.text))) {
        console.log('SI');

        params.addFilter3('filter.TransfereeNumber', lparams.text);
      } else {
        params.addFilter3('filter.password', lparams.text);
      }

    this.transferenteService
      .appsGetPassword(obj, params.getParams())
      .subscribe({
        next: (data: any) => {
          console.log('Transferentes', data);
          let result = data.data.map(async (item: any) => {
            item['transfer'] =
              item.password + ' - ' + item.number + ' - ' + item.name;
          });

          Promise.all(result).then(resp => {
            this.trans = new DefaultSelect(data.data, data.count);
          });
          console.log('data222', data);
        },
        error: error => {
          this.trans = new DefaultSelect([], 0);
        },
      });
  }

  agregarActa() {
    if (!this.claveActaForm.value.cveReceived)
      return (
        this.actaRecepttionForm.get('cveReceived').markAsTouched(),
        this.alert('warning', 'El campo Admin no puede ir vacío', '')
      );

    if (!this.actaRecepttionForm.value.elaboradate)
      return (
        this.actaRecepttionForm.get('elaboradate').markAsTouched(),
        this.alert('warning', 'La fecha de elaboración no puede ser vacía', '')
      );

    const acta = !this.claveActaForm.value.acta
      ? ''
      : this.claveActaForm.value.acta;
    const type = !this.claveActaForm.value.type
      ? ''
      : this.claveActaForm.value.type;
    const claveTrans = !this.claveActaForm.value.claveTrans
      ? ''
      : this.claveActaForm.value.claveTrans;
    const cveReceived = !this.claveActaForm.value.cveReceived
      ? ''
      : this.claveActaForm.value.cveReceived;
    const administra = !this.claveActaForm.value.administra
      ? ''
      : this.claveActaForm.value.administra;
    const consec = !this.claveActaForm.value.consec
      ? ''
      : this.claveActaForm.value.consec;

    const anio = !this.claveActaForm.value.anio
      ? ''
      : this.claveActaForm.value.anio;
    const mes = !this.claveActaForm.value.mes
      ? ''
      : this.claveActaForm.value.mes;

    const miCadenaAnio = anio + '';
    let miSubcadena = '';
    if (miCadenaAnio) miSubcadena = miCadenaAnio.slice(2, 5);

    let consec_ = '';
    if (consec) {
      consec_ = consec.toString().padStart(4, '0');
      if (consec_.length > 4) {
        consec_ = consec_.toString().slice(0, 4);
      }
    }

    const cveActa = `${acta}/${type}/${claveTrans}/${cveReceived}/${administra}/${consec_}/${
      !miSubcadena ? '' : miSubcadena.toString().padStart(2, '0')
    }/${!mes ? '' : mes.value.toString().padStart(2, '0')}`;
    console.log(cveActa);

    if (cveActa) {
      const params = new ListParams();
      params['filter.keysProceedings'] = `$eq:${cveActa}`;
      this.proceedingsDeliveryReceptionService.getByFilter_(params).subscribe({
        next: (data: any) => {
          if (data.data.length == 1) {
            this.alert('warning', 'Esa Acta ya se tiene registrada', '');
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

  guardarRegistro(cveActa: any) {
    let obj: any = {
      keysProceedings: cveActa,
      elaborationDate: this.actaRecepttionForm.value.elaboradate,
      datePhysicalReception:
        this.actaRecepttionForm.value.datePhysicalReception,
      address: this.actaRecepttionForm.value.direccion,
      statusProceedings: !this.actaRecepttionForm.value.statusActa
        ? 'ABIERTA'
        : this.actaRecepttionForm.value.statusActa,
      elaborate: this.authService.decodeToken().preferred_username,
      numFile: this.dataExpediente.id,
      witness1: this.actaRecepttionForm.value.testigoTwo,
      witness2: this.actaRecepttionForm.value.testigoTree,
      typeProceedings: 'DONACION',
      dateElaborationReceipt: null,
      dateDeliveryGood: null,
      responsible: this.actaRecepttionForm.value.respConv,
      destructionMethod: null,
      observations: this.actaRecepttionForm.value.observaciones,
      approvedXAdmon: null,
      approvalDateXAdmon: null,
      approvalUserXAdmon: null,
      numRegister: null,
      captureDate: new Date(),
      numDelegation1: this.delegation,
      numDelegation2: null,
      identifier: null,
      label: null,
      universalFolio: null,
      numeraryFolio: null,
      numTransfer: null,
      idTypeProceedings: 'DON',
      receiptKey: null,
      comptrollerWitness: this.actaRecepttionForm.value.testigoOIC,
      numRequest: null,
      closeDate: null,
      maxDate: null,
      indFulfilled: null,
      dateCaptureHc: null,
      dateCloseHc: null,
      dateMaxHc: null,
      receiveBy: null,
      affair: null,
      numDelegation_1: null,
      numDelegation_2: null,
      file: this.dataExpediente.id,
    };
    this.proceedingsDeliveryReceptionService
      .createDeliveryReception(obj)
      .subscribe({
        next: (data: any) => {
          console.log('DATA', data);
          this.actaDefault = data;
          this.alert('success', 'El Acta se ha creado correctamente', '');
          this.actualizarData();
        },
        error: error => {
          this.alert('error', 'El Acta no se puede crear', '');
        },
      });
  }

  actualizarData() {
    this.actaRecepttionForm
      .get('cveActa')
      .setValue(this.actaDefault.keysProceedings);
    this.getDetailProceedingsDevollution(this.actaDefault.id);
  }

  stagecreated: any = null;
  async get___Senders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    // params.addFilter('assigned', 'S');
    if (lparams?.text) params.addFilter('user', lparams.text, SearchFilter.EQ);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: async (data: any) => {
        this.delegation = data.data[0].delegationNumber;
        this.subdelegation = data.data[0].subdelegationNumber;
        this.areaDict = data.data[0].departamentNumber;
        this.stagecreated = await this.delegationWhere();
        console.log('aaaaaaaaa', this.stagecreated);
        await this.validacionFirst();
        await this.consulREG_DEL_DESTR(new ListParams());
        await this.consulREG_DEL_ADMIN(new ListParams());
      },
      error: async () => {
        await this.consulREG_DEL_DESTR(new ListParams());
        await this.consulREG_DEL_ADMIN(new ListParams());
        await this.validacionFirst();
      },
    });
  }
  async delegationWhere() {
    return new Promise((resolve, reject) => {
      if (this.delegation != null) {
        this.parametersService
          .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(
            (res: any) => {
              console.log('REESS', res);
              resolve(res.stagecreated);
            },
            err => {
              resolve(null);
              console.log(err);
            }
          );
      }
    });
  }
  async getDataSelectInitial() {
    this.delegation = this.authService.decodeToken().department;
    this.stagecreated = await this.delegationWhere();
    console.log('aaaaaaaaa', this.stagecreated);
    await this.validacionFirst();
    this.consulREG_DEL_DESTR(new ListParams());
    // this.consulREG_DEL_ADMIN(new ListParams());
  }

  save() {
    if (!this.actaDefault) {
      if (this.actaRecepttionForm.value.statusActa == 'CERRADA')
        return this.alert(
          'warning',
          'No se puede crear un acta con estatus cerrado',
          ''
        );
      this.agregarActa();
    } else {
      if (this.actaRecepttionForm.value.statusActa == 'CERRADA') {
        this.alertQuestion(
          'warning',
          'Se cerrará el acta',
          '¿Desea continuar?'
        ).then(resp => {
          if (resp.isConfirmed) {
            this.cerrarActa();
          }
        });
      } else {
        this.actualizarActa();
      }
    }
  }

  cerrarActa() {
    if (this.actaDefault != null) {
      if (this.actaDefault.keysProceedings == null) {
        this.alert('warning', 'No existe acta para cerrar', '');
        return;
      }

      if (this.data2.count() == 0) {
        this.alertInfo(
          'warning',
          'El Acta no tiene ningún Bien asignado, no se puede cerrar.',
          ''
        );
        return;
      }

      if (!this.actaRecepttionForm.value.folio) {
        this.alert('warning', 'Indique el folio de escaneo', '');
        return;
      }

      if (!this.actaRecepttionForm.value.testigoOIC) {
        this.alert('warning', 'Indique el testigo de la contraloría', '');
        return;
      }

      const toolbar_user = this.authService.decodeToken().preferred_username;
      // console.log('cadena', cadena);

      this.alertQuestion('question', '¿Desea cerrar el Acta?', '').then(
        async question => {
          if (question.isConfirmed) {
            // await this.createDET();
            let obj: any = {
              // keysProceedings: cveActa,
              elaborationDate: this.actaRecepttionForm.value.elaboradate,
              datePhysicalReception:
                this.actaRecepttionForm.value.datePhysicalReception,
              address: this.actaRecepttionForm.value.direccion,
              statusProceedings: 'CERRADA',
              elaborate: this.authService.decodeToken().preferred_username,
              numFile: this.dataExpediente.id,
              witness1: this.actaRecepttionForm.value.testigoTwo,
              witness2: this.actaRecepttionForm.value.testigoTree,
              typeProceedings: 'DONACION',
              dateElaborationReceipt: null,
              dateDeliveryGood: null,
              responsible: this.actaRecepttionForm.value.respConv,
              destructionMethod: null,
              observations: this.actaRecepttionForm.value.observaciones,
              approvedXAdmon: null,
              approvalDateXAdmon: null,
              approvalUserXAdmon: null,
              numRegister: null,
              captureDate: new Date(),
              numDelegation1: this.delegation,
              numDelegation2: null,
              identifier: null,
              label: null,
              universalFolio: null,
              numeraryFolio: null,
              numTransfer: null,
              idTypeProceedings: 'DON',
              receiptKey: null,
              comptrollerWitness: this.actaRecepttionForm.value.testigoOIC,
              numRequest: null,
              closeDate: null,
              maxDate: null,
              indFulfilled: null,
              dateCaptureHc: null,
              dateCloseHc: null,
              dateMaxHc: null,
              receiveBy: null,
              affair: null,
              numDelegation_1: null,
              numDelegation_2: null,
              file: this.dataExpediente.id,
            };
            // this.actaDefault.statusProceedings = 'CERRADA';
            // delete this.actaDefault.numDelegation1Description;
            // delete this.actaDefault.numDelegation2Description;
            // delete this.actaDefault.numTransfer_;
            this.loadingBtn = true;
            this.proceedingsDeliveryReceptionService
              .editProceeding(this.actaDefault.id, obj)
              .subscribe({
                next: async data => {
                  let obj = {
                    pActaNumber: this.actaDefault.id,
                    pStatusActa: 'CERRADA',
                    pVcScreen: 'FACTDESACTASDONAC',
                    pUser: this.authService.decodeToken().preferred_username,
                  };

                  await this.updateGoodEInsertHistoric(obj);

                  this.alertInfo(
                    'success',
                    'Se cerró el Acta correctamente',
                    ''
                  );
                  this.loadingBtn = false;
                  this.actaCerrada = false;
                  // this.disabledBtnActas = false;
                  this.getGoodsByStatus(this.dataExpediente.id);
                  await this.getDetailProceedingsDevollution(
                    this.actaDefault.id
                  );
                },
                error: error => {
                  this.loadingBtn = false;
                  this.alert('error', 'Ocurrió un error al cerrar el Acta', '');
                  // this.loading = false
                },
              });
          }
        }
      );
    } else {
      this.alert(
        'warning',
        'No existe ningún Acta a cerrar.',
        // 'El Usuario no está autorizado para cerrar acta',
        ''
      );
    }
  }

  disabledFields() {}

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

  async removeSelect() {
    if (this.datas.count() == 0) {
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
          this.alert('error', 'No se eliminar el bien del acta', '');
        } else {
          this.alert('success', 'Bien eliminado correctamente', '');
          await this.getGoodsByStatus(this.dataExpediente.id);
          await this.getDetailProceedingsDevollution(this.actaDefault.id);
        }
      }
    }
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

  async addSelect() {
    if (this.datas.count() == 0) return null;
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
          // console.log('aaa', this.selectedGooods);

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
            await this.getGoodsByStatus(this.dataExpediente.id);
            await this.getDetailProceedingsDevollution(this.actaDefault.id);
          }
        }
      }
    } else {
      this.alert('warning', 'Seleccione primero el Bien a asignar.', '');
    }
  }

  async createDET(good: any) {
    let obj: any = {
      numberProceedings: this.actaDefault.id,
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

    let result = await this.saveGoodActas(obj);
    return result;
  }

  async saveGoodActas(body: any) {
    return new Promise((resolve, reject) => {
      this.serviceDetailProc.addGoodToProceedings(body).subscribe({
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

  async getDate2(fecha: any) {
    // const formattedDate = moment(date).format('DD-MM-YYYY');

    const today = fecha;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${year}/${month}/${day}`;
    return SYSDATE;
    // { authorizeDate: formattedDate }
    // { emitEvent: false }
  }

  async obtenerValores(cadena: any) {
    var valores = cadena.split('/');
    return valores;
  }
}
