import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';
import { SearchActasComponent } from '../../donation-acts/donation-acts/search-actas/search-actas.component';
import { SearchExpedientComponent } from '../../donation-acts/donation-acts/search-expedient/search-expedient.component';
import { COLUMNS1 } from './columns1';
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
  constructor(
    private fb: FormBuilder,
    private proceedingsDelivery: ProceedingsDeliveryReceptionService,
    private goodsService: GoodService,
    private modalService: BsModalService,
    private goodprocessService: GoodProcessService,
    private expedientService: ExpedientService,
    private proceedingsDetailDelivery: ProceedingsDeliveryReceptionService,
    private parametersService: ParametersService,
    private rNomenclaService: RNomenclaService,
    private transferenteService: TransferenteService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      rowClassFunction: (row: any) => {
        if (row.data.disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-danger text-white';
        }
      },
    };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS1;
  }

  ngOnInit(): void {
    this.initForm();
    this.delegationWhere();
    // this.params1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   this.getGoods(this.expedienteBuscado);
    // });

    // this.data2.load(this.dataTabla2);
  }
  delegationWhere() {
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

  search(event: any) {
    this.expedienteBuscado = event;

    this.proceedingsDelivery.getProceeding(event).subscribe({
      next: data => {
        this.response = true;
        this.alert('success', 'Expediente Encontrado', '');

        this.listaActas = data.data;
        this.getGoods(event, data.data[0].id);
      },
      error: err => {
        this.alert('error', 'Error', 'El expediente ingresado no existe');
        this.response = false;
        return;
      },
    });

    this.expedientService.getById(event).subscribe({
      next: (data: any) => {
        this.form.controls['preliminaryAscertainment'].setValue(
          data.preliminaryInquiry
        );
        this.form.controls['causePenal'].setValue(data.criminalCase);
      },
      error: err => console.log(err),
    });
  }

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
    this.form = this.fb.group({
      preliminaryAscertainment: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      causePenal: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      actSelect: [null, [Validators.required]],
      type: [null],
      del: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      elabDate: [null, [Validators.required]],
      authorization: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      sessionNumb: [null, [Validators.required, Validators.maxLength(200)]],
      caseNumb: [null, [Validators.required, Validators.maxLength(100)]],
      folioScan: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      responsible: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      witness1: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      witness2: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      observations: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

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
      administra: [null],
      cveReceived: [null, Validators.required],
      consec: [null],
      anio: [null],
      mes: [null],
    });

    this.formActReception = this.fb.group({
      keysProceedings: [null],
      elaborationDate: [null],
      datePhysicalReception: [null],
      address: [null],
      statusProceedings: [null],
      elaborate: null,
      numFile: [null],
      witness1: [null],
      witness2: [null],
      typeProceedings: [null],
      dateElaborationReceipt: [null],
      dateDeliveryGood: [null],
      responsible: [null],
      destructionMethod: [null],
      observations: [null],
      approvedXAdmon: [null],
      approvalDateXAdmon: [null],
      approvalUserXAdmon: [null],
      numRegister: [null],
      captureDate: [null],
      numDelegation1: [null],
      numDelegation2: [null],
      identifier: [null],
      label: [null],
      universalFolio: [null],
      numeraryFolio: [null],
      numTransfer: [null],
      idTypeProceedings: [null],
      receiptKey: [null],
      comptrollerWitness: [null],
      numRequest: [null],
      closeDate: [null],
      maxDate: [null],
      indFulfilled: [null],
      dateCaptureHc: [null],
      dateCloseHc: [null],
      dateMaxHc: [null],
      receiveBy: [null],
      affair: [null],
      numDelegation_1: [null],
      numDelegation_2: [null],
      file: [null],
    });

    this.formFolio = this.fb.group({
      folioUniversal: [null],
    });

    this.form2 = this.fb.group({
      estatusBien: [null],
    });
  }

  onSubmit() {
    if (this.statusActa === 'CERRADA') {
      this.alert('warning', 'Atención', 'El acta ya esta cerrada.');
      this.form.reset();
      return;
    } else {
      this.cerrarActa(this.actaSelected);

      this.form.reset();
    }
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

  getGoods(id: number, actaRecibida?: any) {
    this.loading = true;

    const params1 = {
      ...this.params1.getValue(),
    };

    this.goodsService.getByExpedient_(id, params1).subscribe({
      next: async data => {
        let dataTabla1Creada: any[] = [];

        for (let ficha of data.data) {
          let fichaObjeto: any = {};

          fichaObjeto.id = ficha.id;
          fichaObjeto.description = ficha.description.toLowerCase();
          fichaObjeto.quantity = ficha.quantity;
          fichaObjeto.act = actaRecibida;
          fichaObjeto.disponible = await this.getDisponible(ficha.id);
          dataTabla1Creada.push(fichaObjeto);
        }
        this.totalItems1 = data.count;
        this.data1.load(dataTabla1Creada);
        this.data1.refresh();

        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
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

  agregar() {
    const filtra = this.dataTabla2.filter(
      item => item.id === this.bienSelecionado.id
    );

    if (this.bienSelecionado.disponible === 'N') {
      this.alert(
        'error',
        'ATENCIÓN',
        'El bien tiene un estatus invalido para ser asignado a alguna acta.'
      );
      return;
    }
    if (filtra.length < 1 && this.bienSelecionado.id) {
      this.dataTabla2 = [...this.dataTabla2, this.bienSelecionado];
      this.data2.load(this.dataTabla2);

      this.alert('success', 'AGREGADO', 'El bien ha sido agregado.');
      this.formTable1.controls['detail'].setValue('');
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
    } else {
      this.formTable1.controls['detail'].setValue('');
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
      return;
    }

    this.totalItems2 = this.dataTabla2.length;
  }

  selectFila2(event: any) {
    this.bienSelecionado2 = {
      id: event.data.id,
      description: event.data.description,
      quantity: event.data.quantity,
      act: event.data.act,
    };

    this.formTable1.controls['detail'].setValue(event.data.description);
  }

  retirar() {
    if (this.bienSelecionado2.id) {
      const filtra2 = this.dataTabla2.filter(
        item => item.id !== this.bienSelecionado2.id
      );
      this.alert('success', 'ELIMINADO', 'El bien ha sido eliminado.');

      this.dataTabla2 = filtra2;
      this.data2.load(this.dataTabla2);
      this.totalItems2 = this.dataTabla2.length;
      this.formTable1.controls['detail'].setValue('');
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
    } else {
      this.bienSelecionado = {};
      this.bienSelecionado2 = {};
      this.formTable1.controls['detail'].setValue('');
      this.alert(
        'warning',
        'ATENCIÓN',
        'Debe seleccionar un bien que forme parte del acta primero.'
      );
    }
  }

  getScreenStatusFinal() {
    this.modalService.show(ModalMantenimientoEstatusActComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cerrarActa(idActa?: any) {
    const model: IProccedingsDeliveryReception = {};
    model.closeDate = this.getCurrentDate();
    model.statusProceedings = 'CERRADA';
    model.id = idActa;

    this.proceedingsDetailDelivery.update(idActa, model).subscribe({
      next: resp => {
        this.alert('success', 'ACTA CERRADA', 'El acta ha sido cerrada.');
        // this.disableClosedAct = true;
        // this.searchByExp(this.expediente);
      },
      error: err => {
        this.alert('error', 'HUBO UN ERROR', 'No se ha podido cerrar la acta.');
      },
    });
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
        // this.getGoodsByStatus(this.dataExpediente.id);
        // this.paramsOne.getValue().page = 1;
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
    };

    let modalRef = this.modalService.show(SearchActasComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        console.log('next', next);
        this.actaDefault = next;

        if (this.actaDefault.statusProceedings == 'CERRADA')
          this.actaCerrada = false;
        else this.actaCerrada = true;

        // this.selectData2 = null;
        // this.actaRecepttionForm.reset();

        this.formActReception.patchValue(next);
        this.valClave = false;
        this.btnSave = true;
        // let clave = await this.obtenerValores(this.actaDefault.keysProceedings);
        // this.getDetailProceedingsDevollution(this.actaDefault.id);
      }
    });
  }

  resetForm() {}
  save() {}
  cleanActa() {
    this.formActReception.reset();
    this.formActCreate.reset();
    this.data2.load([]);
    this.data2.refresh();
    this.totalItems2 = 0;
    // this.selectData2 = null;
    this.actaDefault = null;
    // this.actaRecepttionForm.patchValue({
    //   elaboradate: await this.getDate(),
    //   datePhysicalReception: await this.getDate(),
    // });
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

  async consultREG_TRANSFERENTES(lparams: ListParams) {
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
        params.addFilter3('filter.TransfereeNumber', lparams.text);
      } else {
        params.addFilter3('filter.password', lparams.text);
      }

    this.transferenteService
      .appsGetPassword(obj, params.getParams())
      .subscribe({
        next: (data: any) => {
          let result = data.data.map(async (item: any) => {
            item['transfer'] = item.password + ' - ' + item.number;
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

  initSolicitud() {}
  openScannerPage() {}

  getReport() {}
  openScannerPageView() {}

  addSelect() {}
  removeSelect() {}
  rowSelectedOne(event: any) {}
  rowSelectedTwo(event: any) {}
}
