import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ITransfActaEntrec } from 'src/app/core/models/ms-notification/notification.model';
import { IDetailWithIndEdo } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from './../../../../common/repository/interfaces/list-params';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';
import { ConfirmationDonationActsComponent } from './confirmation-donation-acts/confirmation-donation-acts.component';

export class GoodsToReception {
  numberProceedings: string;
  numberGood: number;
  amount: number;
}

@Component({
  selector: 'app-donation-acts',
  templateUrl: './donation-acts.component.html',
  styles: [],
})
export class DonationActsComponent extends BasePage implements OnInit {
  //

  actForm: FormGroup;
  formTable1: FormGroup;
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
    private serviceProcVal: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: COLUMNS1,
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
    this.initForm();
    this.form.get('year').setValue(moment(new Date()).format('YYYY'));
    this.form.get('mes').setValue(moment(new Date()).format('MM'));
    // this.startCalendars();
    this.paramsOne
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log('Aqui se manda a llamar cuando cambia de pagina');
        this.getDataTableOne(params, `filter.fileNumber=${this.noExpe}`);
      });
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe((params: any) => {
      this.getDataTableTwo(params);
    });

    this.paramsActNavigate
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.loading = true;
        this.dataGoodAct.load([]);
        this.clearInputs();
        const paramsF = new FilterParams();
        paramsF.page = params.page;
        paramsF.limit = 1;
        paramsF.addFilter('numFile', this.form.get('no_expediente').value);
        paramsF.addFilter('typeProceedings', 'DONACION', SearchFilter.IN); //!Un in
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            this.totalItemsNavigate = res.count;
            const dataRes = JSON.parse(JSON.stringify(res.data[0]));
            console.log(dataRes);
            this.fillIncomeProceeding(dataRes, '');
          },
          err => {
            this.loading = false;
          }
        );
      });

    this.paramsDataGoods
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log(params);
        this.limitDataGoods = new FormControl(params.limit);
      });
  }

  //

  initForm() {
    this.form = this.fb.group({
      no_expediente: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
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
        // if (this.varTwo == null) {
        //   this.alert('warning', 'Advertencia', `Indique el folio de escaneo`);
        // }
        // if (this.varThree == null) {
        //   this.alert('warning', 'Advertencia', `Indique el Testigo de la Contraloría`);
        // }

        this.alert('warning', 'Advertencia', `No existe acta para cerrar`);
      } else if (this.data2.count() === 0) {
        // if (this.varTwo == null) {
        //   this.alert('warning', 'Advertencia', `Indique el folio de escaneo`);
        // }
        // if (this.varThree == null) {
        //   this.alert('warning', 'Advertencia', `Indique el Testigo de la Contraloría`);
        // }
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

  rowSelectedOne(event: any) {
    this.varCreateObject = event;
    const { data } = event;
    this.selectData = data;
    this.form2.get('estatusPrueba').setValue(data.description);
  }

  desSelectRow() {
    this.selectData = null;
    this.form2.get('estatusPrueba').reset();
  }

  rowSelectedTwo(event: any) {
    this.varDeleteObject = event;
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

  resetForm() {
    this.form.reset();
    this.actForm.reset();
    this.datas.load([]);
    this.data2.load([]);
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
      err => {
        //   this.form.get('statusProceeding').setValue(dataRes.statusProceedings);
        //   this.form.get('direccion').setValue(dataRes.address);
        //   this.form.get('entrega').setValue(dataRes.witness1);
        //   this.form
        //     .get('fecElabRec')
        //     .setValue(addDays(new Date(dataRes.dateElaborationReceipt), 1));
        //   this.form
        //     .get('fecEntBien')
        //     .setValue(addDays(new Date(dataRes.dateDeliveryGood), 1));
        //   this.form.get('fecElab').setValue(
        //     new Date(
        //       new Date(dataRes.elaborationDate).toLocaleString('en-US', {
        //         timeZone: 'GMT',
        //       })
        //     )
        //   );
        //   console.log({
        //     msg: 'Fecha ya guardada',
        //     data: this.form.get('fecElab').value,
        //   });
        //   this.form
        //     .get('fecReception')
        //     .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        //   this.form
        //     .get('fecCaptura')
        //     .setValue(addDays(new Date(dataRes.captureDate), 1));
        //   this.form.get('observaciones').setValue(dataRes.observations);
        //   this.form.get('recibe2').setValue(dataRes.witness2);
        //   this.form.get('testigo').setValue(dataRes.comptrollerWitness);
        //   this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        //   this.form.get('acta2').setValue(dataRes.keysProceedings);
      }
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

  searchKeyProceeding() {
    /*     const acta2Input = this.form.get('folio');
    console.log({acta: this.act2Valid});
    console.log(
      !['CERRADA', 'ABIERTA', 'CERRADO'].includes(
        this.form.get('statusProceeding').value
      )
    );
    if (
      this.act2Valid &&
      !['CERRADA', 'ABIERTA', 'CERRADO'].includes(
        this.form.get('statusProceeding').value
      )
    ) {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          console.log(res.data[0]['typeProceedings']);
          this.form.get('folio').reset();
          this.alert(
            'warning',
            'El acta ya existe',
            'El acta registrado ya exista, por favor modifique el número de folio o revise los datos.'
          );
        },
        err => {
          console.log('No existe');
        }
      );
    } */
  }
}
