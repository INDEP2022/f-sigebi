import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import {
  IExportDetail,
  IGoodDonation,
} from 'src/app/core/models/ms-donation/donation.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import {
  IFmComDanc,
  IProcedureFmCom,
} from 'src/app/core/services/ms-good/good-process-model';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { CreateActaComponent } from '../create-acta/create-acta.component';
import { FindActaComponent } from '../find-acta/find-acta.component';
import { GoodErrorComponent } from '../good-error/good-error.component';
import { RopIdComponent } from '../rop-id/rop-id.component';
import { ModalApprovalDonationComponent } from './../modal-approval-donation/modal-approval-donation.component';
import { COPY } from './columns-approval-donation';

interface NotData {
  id: number;
  reason: string;
}
interface IDs {
  No_bien: number;
}
@Component({
  selector: 'app-capture-approval-donation',
  templateUrl: './capture-approval-donation.component.html',
  styles: [
    `
      .form-radio input[type='radio'] {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }

      .form-radio {
        padding: 10px 20px;
      }
      @media screen and (max-width: 767px) {
        #column {
          border-right: 0px !important;
        }
      }
    `,
  ],
})
export class CaptureApprovalDonationComponent
  extends BasePage
  implements OnInit
{
  regisForm: FormGroup;
  delForm: FormGroup;
  siabForm: FormGroup;
  idsNotExist: NotData[] = [];
  $trackedGoods = this.store.select(getTrackedGoods);
  foolio: number;
  statusGood_: any;
  deleteO: boolean = false;
  goods: any[] = [];
  totalCant: any[] = [];
  selectedOption: string = '';
  showError: boolean = true;
  availableToAssing: boolean = true;
  files: any = [];
  radio: boolean = false;
  bienesVaild: boolean = false;
  changeDescription: string;
  dataTableGood_: any[] = [];
  body: IExportDetail;
  ngGlobal: any;
  valueChange: number = 0;
  totalItems: number = 0;
  errorSumInvalidos: number = 0;
  errorSumValidos: number = 0;
  deleteG: boolean = false;
  loading3: boolean = false;
  Exportdate: boolean = false;
  inputVisible: boolean = false;
  status: string = '';
  idAct: number = 0;
  disabledBtnActas: boolean = true;
  totalItems2: number = 0;
  activeRadio: boolean = true;
  cveActa: string = '';
  goodError: IDonationGoodError[];
  dataDetailDonation: any;
  data1: any;
  columnFilterDet: any[] = [];
  consec: string = '';
  data: LocalDataSource = new LocalDataSource();
  excelLoading: boolean = false;
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  bsValueToYear: Date = new Date();
  TOTAL_REPORTE: number = 0;
  BIEN_ERROR: number = 0;
  SUM_BIEN: number = 0;
  validChange: number = 0;
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  dataTableGood: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  estatus: string;
  selectedRow: IGood;
  origin2: 'FCONGENRASTREADOR';
  fileNumber: number = 0;
  columnFilters: any = [];
  columnFilterDetail: any = [];
  columnFilters2: any = [];
  settings2;
  to: string = '';
  annio: string = '';
  userName: string = '';
  // @Input() getDetailComDonation: Function;
  // @Input() idActa: number | string;
  type = 'COMPDON';
  eventDonacion: IGoodDonation;
  origin = 'FMCOMDONAC_1';

  donationGood: IGoodDonation;
  paramsScreen: IParamsDonac = {
    origin: '',
  };

  //AGREGADOS POR GRIGORK
  //SETEA BLK_CONTROL
  cCantidad = 0;
  cEvento = 0;
  cBien = 0;
  cantBien = 0;
  cantRegi = 0;
  cCanrkg = 0;
  cantRerr = 0;
  areaD: any;
  //LABELS DE BOTONES
  pb_label: string = 'Consulta Bienes';
  VALIDA_B: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodService: GoodService,
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef,
    private statusGoodService: StatusGoodService,
    private goodProcessService: GoodProcessService,
    private datePipe: DatePipe,
    private usersService: UsersService,
    private readonly goodServices: GoodService,
    private goodTrackerService: GoodTrackerService,
    private globalVarService: GlobalVarsService,
    private store: Store
  ) {
    super();
    /* this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        title: 'Acciones',
        edit: false,
        add: false,
        delete: false,
      },
      selectedRowIndex: -1,
      mode: 'external',
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
        proposalKey: {
          title: 'Ref.',
          type: 'number',
          sort: false,
        },
        goodNumber: {
          title: 'No. Bien',
          type: 'number',
          sort: false,
        },
        description: {
          title: 'Descripción del Bien',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.description;
          },
        },
        quantity: {
          title: 'Cantidad',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.quantity;
          },
        },
      },
    }; */
    this.TOTAL_REPORTE = 0;
    this.BIEN_ERROR = 0;
    this.SUM_BIEN = 0;
    //console.log(this.authService.decodeToken());
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
        if (row.data.error === '') {
          return '';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
  }

  ngOnInit(): void {
    //AGREGADO POR GRIGORK
    //LLENA LOS DATOS DEL ACTA
    //VERIFICA SI HAY DATOS DEL RASTREADOR
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            const newData = JSON.parse(localStorage.getItem('save_data'));
            const body: IProcedureFmCom = {
              areaD: newData.areaD,
              cAmount: newData.cAmount,
              cCanrkg: newData.cCanrkg,
              cEvent: newData.cEvent,
              minutesNumber: newData.no_acta,
              goodsRel: this.ngGlobal.REL_BIENES,
            };
            this.validateGoodTracker(body);
          }
        },
      });

    this.$trackedGoods.subscribe({
      next: response => {
        if (response !== undefined) {
          this.loadGood(response);
        }
        this.loading = false;
      },
      error: err => {
        console.log(err);
      },
    });

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('Se disparo el evento de cambio de datos...onChanged');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            const search: any = {
              numberGood: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.EQ),
              unit: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.EQ),
              noExpediente: () => (searchFilter = SearchFilter.EQ),
              noEtiqueta: () => (searchFilter = SearchFilter.EQ),
              idNoWorker1: () => (searchFilter = SearchFilter.EQ),
              idExpWorker1: () => (searchFilter = SearchFilter.EQ),
              noClasifBien: () => (searchFilter = SearchFilter.EQ),
              procesoExtDom: () => (searchFilter = SearchFilter.EQ),
              warehouseNumb: () => (searchFilter = SearchFilter.EQ),
              warehouse: () => (searchFilter = SearchFilter.EQ),
              warehouseLocat: () => (searchFilter = SearchFilter.EQ),
              coordAdmin: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();
            if (filter.search !== '') {
              this.columnFilterDet[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilterDet[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.log('Se disparó aquí: filter');
          this.getDetailProceedingsDevollution(localStorage.getItem('actaId'));
        }
      });

    console.log('2.Se disparo el evento de cambio de datos...onChanged');
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getDetailProceedingsDevollution(localStorage.getItem('actaId'));
      console.log('Se disparó aquí: params');
    });
    console.log('3.Se disparo el evento de cambio de datos...onChanged');
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        if (this.origin == 'FMCOMDONAC_1') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          this.origin2 = paramsQuery['origin2'] ?? null;
        }
        if (this.origin !== null) {
          console.log('traigo parametros');
        }
      });
    this.initForm();
  }
  addStatus() {
    /* this.data.load(this.goods); */
    this.paginator();
    this.data.refresh();
  }
  paginator(noPage: number = 1, elementPerPage: number = 10) {
    const indiceInicial = (noPage - 1) * elementPerPage;
    const indiceFinal = indiceInicial + elementPerPage;

    let paginateData = this.goods.slice(indiceInicial, indiceFinal);
    this.data.load(paginateData);
  }
  // async goodById() {
  //   this.goodService.getGoodByIds(this.ngGlobal.REL_BIENES).subscribe({
  //     next: data => {
  //       this.isGoodSelected(data.data);
  //     },
  //     error: () => console.log('no hay bienes'),
  //   });
  // }

  enableButtons() {
    if (this.regisForm.get('activeRadio').value !== null) {
      const value = this.regisForm.get('activeRadio').value;
      if (value == 0) {
        this.pb_label = 'Consulta Bienes';
        this.VALIDA_B = false; //0 es false y 1 es true
      } else {
        this.pb_label = 'Carga Bienes';

        if (this.VALIDA_B) {
          this.VALIDA_B = false; //0 es false y 1 es true
        }

        if ([2, 3].includes(parseInt(value)) && this.estatus == 'ABIERTA') {
          this.regisForm.get('observaciones').disable();
        } else {
          this.regisForm.get('observaciones').enable();
        }
      }
      console.log(this.pb_label);
      this.radio = true;
      const nameT = this.regisForm.get('activeRadio').value;
      localStorage.setItem('nameT', nameT);
    }
  }
  //this.authService.decodeToken().siglasnivel1
  initForm() {
    console.log('entra a initForm');
    this.regisForm = this.fb.group({
      type: [null, []],
      area: [null, [Validators.pattern(STRING_PATTERN)]],
      year: [null, []],
      folio: [null],
      captureDate: [null, []],
      keyEvent: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      observaciones: [null],
      activeRadio: [null],
    });
    this.delForm = this.fb.group({
      observaElimina: [null, [Validators.required]],
    });
    console.log('antes de llamar a getComerDonation');
    this.getComerDonation();
    this.configDatePicker();
  }

  createDon(donationGood: IGoodDonation) {
    this.loading = true;
    const folio = this.regisForm.value.folio;
    // const acta = this.regisForm.value.type;
    let year = localStorage.getItem('anio');
    const area = this.regisForm.value.area;
    const cveActa = `${'COMPDON'}/${area}/${year}/${this.foolio}/${this.type}`;
    console.log('cveActa -->', cveActa);
    this.donationService.createD(donationGood).subscribe({
      next: resp => {
        console.log('guardado');
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  getComerDonation() {
    this.TOTAL_REPORTE = 0;
    this.BIEN_ERROR = 0;
    this.SUM_BIEN = 0;
    console.log('...entrando a getComerDonation');
    this.idAct = Number(localStorage.getItem('actaId'));
    const token = this.authService.decodeToken();
    this.donationService.getByIdEvent(this.idAct).subscribe({
      next: (data: any) => {
        console.log('0.data:getComerDonation::::' + data);
        this.eventDonacion = data;
        this.fileNumber = data.fileNumber;
        //this.regisForm.get('type').setValue('COMPDON');
        this.regisForm.get('type').setValue('CPD');
        this.regisForm.get('area').setValue(localStorage.getItem('area'));
        this.estatus = this.eventDonacion.estatusAct;
        console.log('1.data:getComerDonation::::');
        this.areaD =
          data.noDelegation2 != null ? data.noDelegation2 : data.noDelegation1;
        this.areaD = this.areaD == null ? token.department : 0;

        const dateCapture =
          this.eventDonacion.captureDate != null
            ? new Date(this.eventDonacion.captureDate)
            : null;
        const formattedfecCapture =
          dateCapture != null ? this.formatDate(dateCapture) : null;
        console.log('2.data:getComerDonation::::');
        console.log(this.eventDonacion);
        if (this.estatus != 'ABIERTA') {
          this.deleteO = true;
          // this.generarClave(this.regisForm.value.area, )
        }
        this.deleteO = false;
        const ultimosCincoDigitos = this.eventDonacion.cveAct.slice(-5);
        //var anio = parseInt(ultimosCincoDigitos.substring(0, 2), 10);
        console.log('3.data:getComerDonation::::');
        var pos = this.eventDonacion.cveAct.lastIndexOf('/');
        var anio = parseInt(this.eventDonacion.cveAct.substring(pos - 4, pos));
        var folio = this.eventDonacion.cveAct.substring(pos + 1);
        console.log('txtAnio::' + anio);
        var pos1 = this.eventDonacion.cveAct.indexOf('/');
        //var pos1 = this.eventDonacion.cveAct.indexOf('/', pos);
        console.log('pos::' + pos + ' - pos1::' + pos1);
        var area = this.eventDonacion.cveAct.substring(pos1 + 1, pos - 5);
        console.log('area::' + area);
        this.regisForm.get('area').setValue(area);
        console.log('4.data:getComerDonation::::');
        /*
        if(unsigned == anio || anio==null || isNaN(anio)){
          anio = parseInt(this.eventDonacion.cveAct.substring(pos - 4, pos));
          console.log('txtAnio::' + anio);
        }
        */

        // const mesNumero = parseInt(ultimosCincoDigitos.substring(3, 5), 10);
        if (isNaN(anio)) {
          return null;
        }
        console.log('5.data:getComerDonation::::');
        //this.regisForm.get('year').setValue(localStorage.getItem('anio'));
        this.regisForm.get('year').setValue(anio);
        this.regisForm
          .get('folio')
          .setValue(data.folioUniversal == null ? folio : data.folioUniversal);
        this.regisForm.get('keyEvent').setValue(this.eventDonacion.cveAct);
        this.regisForm.get('captureDate').setValue(formattedfecCapture);
        console.log('Se disparó aquí: getComerDonation');
        this.getDetailProceedingsDevollution(this.idAct);
        this.regisForm.get('observaciones').setValue(data.observations);
      },
      error: () => {
        console.error('error');
      },
    });
  }

  //Consultar bie
  ubicaGood() {
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden consultar bienes',
        ''
      );
      return;
    } else {
      this.alertQuestion('warning', '', '¿Desea continuar con  proceso?').then(
        question => {
          if (question.isConfirmed) {
            //this.consultgoods();
            const value = this.regisForm.get('activeRadio').value;
            if (value == 0) {
              this.queryDonationGoods();
            } else {
              this.getDetailProceedingsDevollution(this.idAct);
            }
          } else {
            // goBlock('DETALLE_EVENT_COM_DON');
            if (this.dataDetailDonation.length === 0) {
              this.alert('warning', 'No hay bienes a validar.', '');
            } else {
              // PUP_CARGA_BIENES;
              this.getDetailProceedingsDevollution(this.idAct);
            }
          }
        }
      );
    }
  }
  eventdetailDefault: any = null;
  consultgoods(provider?: any) {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      provider,
      radioButton: this.regisForm.get('activeRadio').value,
    };

    let modalRef = this.modalService.show(
      ModalApprovalDonationComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any[] = []) => {
      console.log('aaaa', next);
      this.selectedGooodsValid = next;
      this.addSelect();
      this.data.load(next);
      this.data.refresh();

      // this.status = next.statusAct;
    });
  }

  generarClave(lvArea: number, lvCons: number, anio: number): string {
    // Validamos que los datos sean del tipo correcto
    if (
      typeof lvArea !== 'number' ||
      typeof lvCons !== 'number' ||
      typeof anio !== 'number'
    ) {
      throw new Error('Los datos ingresados no son del tipo correcto');
    }
    const clave = `${this.type}${lvArea.toString().padStart(2, '0')}${lvCons
      .toString()
      .padStart(4, '0')}${anio.toString().padStart(4, '0')}`;
    return clave;
  }

  configDatePicker() {
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.minModeToYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onSubmit() {}

  openModal(title: string, op: string, subTitle: string = '') {
    const initialState: ModalOptions = {
      initialState: {
        title,
        op,
        subTitle,
        radioButton: this.regisForm.get('activeRadio').value,
      },
      class: 'modal-xl modal-dialog-centered',
    };
    this.bsModalRef = this.modalService.show(
      ModalApprovalDonationComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  goBackDonation() {
    this.router.navigate(['/pages/general-processes/scan-documents'], {
      queryParams: {
        // origin: this.origin,
        // acta: this.actaRecepttionForm.get('type').value,
      },
    });
  }
  ValidGoods(): void {
    console.log('this.bienes1 -->');
  }

  async getDetailProceedingsDevollution(id: any) {
    this.loading3 = true;
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilterDet,
    };
    params['filter.recordId'] = `$eq:${this.idAct}`;
    const value = this.regisForm.get('activeRadio').value;
    console.log('activeRadio::' + value);
    if (value > 0) {
      params['filter.valcambio'] = `$eq:${value}`;
    }
    console.log('params::' + JSON.stringify(params));
    //params['filter.good.status'] !== `$eq:ROP`; //! No encuentro que sea diferente de ROP en la forma
    return new Promise((resolve, reject) => {
      this.donationService.getEventComDonationDetail(params).subscribe({
        next: data => {
          console.log(data);
          /*
          let result = data.data.map((item: any) => {
            
            this.SUM_BIEN += parseInt(item.amount);
            parseFloat(this.SUM_BIEN.toString());
            item['description'] = item.good.description
              ? item.good.description
              : null;
            const status = item.good.status || null;
            if (status !== null) {
              this.errorSumValidos += status.length;
            } else {
              this.errorSumInvalidos++;
            }
            this.BIEN_ERROR += item['error'];
            console.log(this.SUM_BIEN);
            
          });
          Promise.all(result).then(items => {
            this.dataDetailDonation = data.data;
            this.data.load(this.dataDetailDonation);
            this.data.refresh();
            this.totalItems2 = data.count ?? 0;
            this.TOTAL_REPORTE = this.totalItems2;
            console.log('getDetailProceedingsDevollution', data);
            this.loading3 = false;
            this.Exportdate = true;
          });
          */
          this.data.load(data.data);
          this.data.refresh();
          this.loading3 = false;
          this.totalItems2 = data.count ?? 0;
          this.getQuantityProceedingsDevollution(this.idAct);
        },
        error: error => {
          this.dataDetailDonation = [];
          this.data.load([]);
          this.loading3 = false;
        },
      });
    });
  }

  async getQuantityProceedingsDevollution(id: any) {
    this.loading3 = true;
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilterDet,
    };
    this.TOTAL_REPORTE = 0;
    this.BIEN_ERROR = 0;
    this.SUM_BIEN = 0;

    params['recordId'] = `$eq:${this.idAct}`;
    const value = this.regisForm.get('activeRadio').value;
    console.log('activeRadio::' + value);
    if (value > 0) {
      params['filter.valcambio'] = `$eq:${value}`;
    }
    //params['filter.good.status'] !== `$eq:ROP`; //! No encuentro que sea diferente de ROP en la forma
    return new Promise((resolve, reject) => {
      this.donationService
        .getQuantityEventComDonationDetail(id + '|' + value)
        .subscribe({
          next: data => {
            //console.log(data);
            let result = data.data.map((item: any) => {
              this.TOTAL_REPORTE += parseInt(item.count);

              if (item.er !== '') {
                this.BIEN_ERROR += parseInt(item.count);
              }
              if (item.er === '') {
                this.SUM_BIEN += parseFloat(item.sum);
              }

              console.log(this.SUM_BIEN);
            });
            this.loading3 = false;
          },
          error: error => {
            //this.dataDetailDonation = [];
            //this.data.load([]);
            this.loading3 = false;
          },
        });
    });
  }
  /*
    async getErrorProceedingsDevollution(id: any) {
      this.loading3 = true;
      let params: any = {
        ...this.params.getValue(),
        ...this.columnFilterDet,
      };
      params['filter.recordId'] = `$eq:${this.idAct}`;
      return new Promise((resolve, reject) => {
        this.donationService.getErrorEventComDonationDetail(params).subscribe({
          next: data => {
            console.log(data);
            this.data.load(data.data);
            this.data.refresh();
            this.loading3 = false;
            this.totalItems2 = data.count ?? 0;
          },
          error: error => {
            this.dataDetailDonation = [];
            this.data.load([]);
            this.loading3 = false;
          },
        });
      });
    }
    */
  rowsSelected(event: any) {
    this.selectedGooodsValid = event.selected;
    console.log('seleccionados::' + JSON.stringify(this.selectedGooodsValid));
  }
  exportAll(): void {
    this.body = {
      recordId: this.idAct,
      typeActa: 'COMPDON',
      delegationId: Number(localStorage.getItem('noDelegation1')),
      nombre_transferente: null,
    };

    this.getEventComDonationExcel(this.body);
  }

  getEventComDonationExcel(body: IExportDetail): void {
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se puede descargar el archivo',
        ''
      );
      return;
    }
    if (this.data.count() == 0) {
      this.alert('warning', 'No hay bienes para descargar', '');
      return;
    } else {
      this.excelLoading = true;
      this.donationService.getExcel(body).subscribe({
        next: data => {
          this.excelLoading = false;
          this.alert(
            'warning',
            'El archivo se esta generando, favor de esperar la descarga',
            ''
          );
          this.downloadDocument('-Detalle-Donacion', 'excel', data.base64File);
        },
        error: error => {
          this.excelLoading = false;
          this.alert('warning', 'No hay Datos para Exportar', '');
        },
      });
    }
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.excelLoading = true;
    this.alert('success', 'El reporte se ha descargado', '');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
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
  async parseCurrrency(amount: string) {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      return numericAmount.toLocaleString('en-US', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return amount;
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
      console.log(this.selectedGooodsValid);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  async addSelect() {
    if (this.selectedGooods.length > 0) {
      if (this.dataDetailDonation.recordId == null) {
        this.alert(
          'warning',
          'No existe un evento en la cual asignar el bien.',
          'Debe capturar un evento.'
        );
        return;
      } else {
        if (this.estatus == 'CERRADA') {
          this.alert(
            'warning',
            'El evento ya está cerrado, no puede realizar modificaciones',
            ''
          );
          return;
        } else {
          // console.log('aaa', this.goods);
          let result = this.selectedGooods.map(async (good: any) => {
            if (good.di_acta != null) {
              this.alert(
                'warning',
                `Ese bien ya se encuentra en el evento ${good.di_acta}`,
                'Debe capturar un evento.'
              );
            } else if (this.dataDetailDonation.error === 1) {
              this.onLoadToast(
                'warning',
                `El bien ${good.id} tiene un estatus Inválido para ser asignado a algún evento`
              );
              return;
            } else {
              // console.log('GOOD', good);
              this.loading = true;

              if (!this.dataDetailDonation.some((v: any) => v === good)) {
                let indexGood = this.dataTableGood_.findIndex(
                  _good => _good.id == good.id
                );
                this.Exportdate = true;
                console.log('indexGood', indexGood);
                if (indexGood != -1)
                  this.dataTableGood_[indexGood].di_disponible = 'N';
                this.dataTableGood_[indexGood].error = 1;
                await this.createDET(good);
                await this.updateBienDetalle(good.goodId, 'CPD');
              }
            }
          });
          Promise.all(result).then(async item => {
            //ACTUALIZA EL COLOR
            this.dataTableGood_ = [];
            this.data.load(this.dataTableGood_);
            this.data.refresh();
            await this.getDetailProceedingsDevollution(
              this.dataDetailDonation.recordId
            );
          });
          //this.actasDefault = null;
        }
      }
    }
    // else {
    //   this.alert('warning', 'Seleccione Primero el Bien a Asignar.', '');
    // }
  }
  removeSelect() {
    this.inputVisible = true;
    // this.elementRef.nativeElement = this.delForm.get('observaElimina').value;
    // this.elementRef.nativeElement.focus();
    if (this.estatus == 'CERRADA') {
      this.alert(
        'warning',
        'El evento ya está cerrado, no puede realizar modificaciones',
        ''
      );
      return;
    } else {
      // console.log('this.actasDefault ', this.actasDefault);
      if (this.dataDetailDonation == null) {
        this.alert(
          'warning',
          'Debe especificar/buscar el evento para despues eliminar el bien.',
          ''
        );
        return;
      }
      if (this.data.count() == 0) {
        this.alert('warning', 'No hay bienes para eliminar', '');
        return;
      }
      if (this.selectedGooodsValid.length == 0) {
        this.alert(
          'warning',
          'Debe seleccionar un bien que Forme parte del evento primero',
          'Debe capturar un evento.'
        );
        return;
      } else if (this.delForm.get('observaElimina').value === null) {
        this.alert(
          'warning',
          'Debe llenar las obervaciones de la eliminación primero',
          ''
        );
        return;
      } else {
        this.alertQuestion(
          'question',
          '¿Seguro que desea eliminar el bien del evento?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            this.loading = true;
            if (this.selectedGooodsValid.length > 0) {
              // this.goods = this.goods.concat(this.selectedGooodsValid);
              let result = this.selectedGooodsValid.map(async good => {
                console.log('good', good);
                this.dataDetailDonation = this.dataDetailDonation.filter(
                  (_good: any) => _good.id != good.goodId
                );
                let index = this.dataTableGood_.findIndex(
                  g => g.id === good.goodId
                );

                await this.updateBienDetalle(good.goodId, 'ROP');
                await this.deleteDET(good);
                // this.selectedGooods = [];
                //ACTUALIZA COLOR
                this.dataTableGood_ = [];
                this.dataTableGood.load(this.dataTableGood_);
                this.dataTableGood.refresh();
              });

              Promise.all(result).then(async item => {
                await this.getDetailProceedingsDevollution(
                  this.dataDetailDonation.recordId
                );

                // this.getGoodsByStatus(Number(this.fileNumber));
              });
              this.Exportdate = false;
              this.selectedGooodsValid = [];
            }
          }
        });
      }
    }
  }
  async updateBienDetalle(idGood: string | number, status: string) {
    this.goodService.updateStatusActasRobo(idGood, status).subscribe({
      next: data => {
        console.log(data);
        this.getDetailProceedingsDevollution(idGood);
      },
      error: () => (this.loading = false),
    });
  }
  async deleteDET(good: any) {
    console.log(good);
    const valid: any = await this.getGoodsDelete(good.goodId);
    if (valid != null) {
      let obj: any = {
        recordId: this.idAct,
        goodId: good.goodId,
        amount: good.amount,
        received: good.received,
        exchangeValue: good.exchangeValue | 0,
        registrationId: good.registreNumber,
      };

      await this.deleteDetailProcee(obj);
    }
  }
  async deleteDetailProcee(params: any) {
    return new Promise((resolve, reject) => {
      this.donationService.putDetailDona(params).subscribe({
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

  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      recordId: this.idAct,
      goodId: good.goodId,
      amount: good.amount,
      received: 1,
      exchangeValue: this.regisForm.get('activeRadio').value | 0,
      registrationId: good.registrationId,
    };

    await this.saveGoodDetail(obj);
  }
  async saveGoodDetail(body: any) {
    return new Promise((resolve, reject) => {
      this.donationService.createDetail(body).subscribe({
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
  async getGoodsDelete(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.goodService
        .getByExpedient_(Number(this.fileNumber), params)
        .subscribe({
          next: data => {
            this.inputVisible = true;
            resolve(true);
          },
          error: error => {
            resolve(null);
          },
        });
    });
  }

  removeAll() {}

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

  loadGood(data: any[]) {
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodServices.getById(good.No_bien).subscribe({
        next: response => {
          this.goods.push({
            ...JSON.parse(JSON.stringify(response)).data[0],
            avalaible: null,
          });
          console.log(this.goods);
          this.addStatus();
          /* this.validGood(JSON.parse(JSON.stringify(response)).data[0]); */ //!SE TIENE QUE REVISAR
        },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({
              id: good.goodNumber,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
        this.showError = true;
        this.availableToAssing = true;
      }
    });
  }
  cleanActa() {
    this.regisForm.reset();
    this.dataTableGood.load([]);
    this.data.load([]);
    this.eventDonacion = null;
    this.estatus = null;
    this.selectedGooods = [];
    this.Exportdate = false;
    this.idAct = 0;
    this.TOTAL_REPORTE = 0;
    this.BIEN_ERROR = 0;
    this.SUM_BIEN = 0;
    localStorage.removeItem('nameT');
    localStorage.removeItem('actaId');
  }

  formatCurrency(amount: string) {
    const numericAmount = parseFloat(amount);

    if (!isNaN(numericAmount)) {
      const a = numericAmount.toLocaleString('en-US', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return '<p class="cell_right">' + a + '</p>';
    } else {
      return amount;
    }
  }

  searchActas(actas?: string) {
    this.consec = null;
    actas = this.cveActa;
    const expedienteNumber = this.fileNumber;
    const actaActual = this.eventDonacion;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      actas,
      actaActual,
      expedienteNumber,
    };

    let modalRef = this.modalService.show(FindActaComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.alert(
          'success',
          'Se cargó la información del evento',
          next.cveAct
        );
      }
      // Limpiar formulario una vez consulte
      this.regisForm.reset();
      //this.formScan.reset();
      this.eventDonacion = next;
      this.SUM_BIEN = 0;
      this.BIEN_ERROR = 0;
      const dateElabora =
        next.elaborationDate != null ? new Date(next.elaborationDate) : null;
      const formattedfecElaborate =
        dateElabora != null ? this.formatDate(dateElabora) : null;

      const dateActa =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecActa =
        dateActa != null ? this.formatDate(dateActa) : null;

      const dateCapture =
        next.captureDate != null ? new Date(next.captureDate) : null;
      const formattedfecCapture =
        dateCapture != null ? this.formatDate(dateCapture) : null;

      this.to = this.datePipe.transform(
        this.regisForm.controls['year'].value,
        'yyyy'
      );

      this.estatus = next.estatusAct;
      if (this.estatus == 'CERRADA') {
        //this.disabledBtnCerrar = false;
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
        //this.disabledBtnCerrar = true;
      }
      console.log('acta NEXT ', next);

      console.log('3.data:getComerDonation::::');
      var pos = next.cveAct.lastIndexOf('/');
      var anio = parseInt(next.cveAct.substring(pos - 4, pos));
      var folio = next.cveAct.substring(pos + 1);
      console.log('txtAnio::' + anio);
      var pos1 = next.cveAct.indexOf('/');
      //var pos1 = this.eventDonacion.cveAct.indexOf('/', pos);
      console.log('pos::' + pos + ' - pos1::' + pos1);
      var area = next.cveAct.substring(pos1 + 1, pos - 5);
      console.log('area::' + area);
      this.regisForm.get('area').setValue(area);
      console.log('4.data:getComerDonation::::');

      this.idAct = next.actId;
      localStorage.setItem('actaId', next.actId);
      this.regisForm.patchValue({
        folio: next.folioUniversal == null ? folio : next.folioUniversal,
        type: this.type,
        area:
          localStorage.getItem('area') == null
            ? area
            : localStorage.getItem('area'),
        keyEvent: next.cveAct,
        year:
          localStorage.getItem('anio') == null
            ? anio
            : localStorage.getItem('anio'),
        testigoOne: next.witness1,
        testigoTree: next.witness2,
        elaboradate: formattedfecElaborate,
        captureDate: formattedfecActa,
        fechacap: formattedfecCapture,
      });
      this.paramsScreen = {
        origin: 'FMCOMDONAC_1',
      };
      this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);
      await this.getDetailProceedingsDevollution(next.actId);
    });
    modalRef.content.cleanForm.subscribe(async (next: any) => {
      if (next) {
        this.cleanActa();
      }
    });
  }
  generarDatosDesdeUltimosCincoDigitos(
    claveActa: string
  ): { anio: number } | null {
    // Verificar que la longitud de la clave sea la esperada
    if (claveActa.length < 5) {
      return null; // Clave no válida
    }

    const ultimosCincoDigitos = claveActa.slice(-5);
    const anio = parseInt(ultimosCincoDigitos.substring(0, 2), 10);
    const mesNumero = parseInt(ultimosCincoDigitos.substring(3, 5), 10);
    if (isNaN(anio) || anio < 0) {
      return null;
    }

    const fechaActual = new Date();
    const sigloActual = Math.floor(fechaActual.getFullYear() / 100) * 100;
    const anioCompleto = anio < 100 ? sigloActual + anio : anio;

    this.regisForm.patchValue({
      year: anioCompleto,
    });

    return { anio: anioCompleto };
  }

  agregarCaptura(create?: any) {
    // const testigoOne = this.regisForm.get('testigoOne').value;
    // const testigoTree = this.regisForm.get('testigoTree').value;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      delegationToolbar: this.delegationToolbar,
      fileNumber: this.fileNumber,
      expedient: this.fileNumber,
      create,
      // testigoOne,
    };

    let modalRef = this.modalService.show(CreateActaComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.alert(
          'success',
          'Se cargó la información del Evento',
          next.cveAct
        );
        console.log('acta NEXT ', next);
        this.idAct = next.actId;
        localStorage.setItem('actaId', next.actId);
        const dateElabora =
          next.elaborationDate != null ? new Date(next.elaborationDate) : null;
        const formattedfecElaborate =
          dateElabora != null ? this.formatDate(dateElabora) : null;

        const dateCapture =
          next.captureDate != null ? new Date(next.captureDate) : null;
        const formattedfecCapture =
          dateCapture != null ? this.formatDate(dateCapture) : null;

        this.regisForm.patchValue({
          folio: next.folioUniversal,
          type: next.actType,
          area: localStorage.getItem('area'),
          keyEvent: next.cveAct,
          anio: localStorage.getItem('anio'),
          testigoOne: next.witness1,
          testigoTree: next.witness2,
          elaboradate: next.captureDate,
          captureDate: formattedfecCapture,
        });
      }
      this.SUM_BIEN = 0;
      this.BIEN_ERROR = 0;
      this.totalItems2 = 0;
      this.eventdetailDefault = next;
      this.estatus = next.estatusAct;
      if (this.estatus == 'CERRADA') {
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
      }
      // this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);

      await this.getDetailProceedingsDevollution(next.actId);
    });
  }
  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter(
      'elaborated',
      this.authService.decodeToken().username,
      SearchFilter.EQ
    );
    return this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: (value: any) => {
        const data = value.data[0].username;
        if (data) this.delegationToolbar = data.delegationNumber;

        console.log('SI', this.delegationToolbar);
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
    if (this.eventDonacion != null) {
      if (this.eventDonacion.estatusAct == 'CERRADA') {
        this.alert('warning', 'el evento ya se encuentra cerrado', '');
        return;
      }
      if (this.data.count() == 0) {
        this.alert(
          'warning',
          'Para cerrar un evento debe contener al menos un bien.',
          ''
        );
        return;
      }

      const toolbar_user = this.authService.decodeToken().preferred_username;
      const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;

      if (
        cadena != 0 &&
        this.authService.decodeToken().preferred_username == toolbar_user
      ) {
        null;
      } else {
        this.alertQuestion(
          'question',
          '¿Seguro que desea realizar el cierre de ésta evento?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            let obj: any = {
              actId: this.idAct,
              cveAct: this.eventDonacion.cveAct,
              elaborationDate: this.eventDonacion.elaborationDate,
              estatusAct: 'CERRADA',
              elaborated: this.authService.decodeToken().preferred_username,
              witness1: this.eventDonacion.witness1,
              witness2: this.eventDonacion.witness2,
              actType: 'COMPDON',
              observations: this.eventDonacion.observations,
              registreNumber: null,
              noDelegation1: this.authService.decodeToken().department,
              fileId: 0, //Number(this.eventDonacion.fileId),
              noDelegation2: null,
              identifier: this.eventDonacion.identifier,
              folioUniversal: this.eventDonacion.folioUniversal,
              closeDate: new Date(),
            };
            this.donationService.putEvent(obj, this.idAct).subscribe({
              next: async data => {
                this.loading = false;

                let obj = {
                  pActaNumber: this.idAct,
                  pStatusActa: 'CERRADA',
                  pVcScreen: 'FMCOMDONAC_1',
                  pUser: this.authService.decodeToken().preferred_username,
                };

                await this.updateGoodEInsertHistoric(obj);

                this.alert('success', 'El evento Ha sido cerrado', '');
                this.alert('success', 'Evento cerrado', '');
                this.data1 = 'CERRADA';
                //this.disabledBtnCerrar = false;
                this.disabledBtnActas = false;
                this.dataTableGood.refresh();
                this.getComerDonation();
                await this.cleanProcessDonationGoods();
                /*
                await this.getDetailProceedingsDevollution(
                  localStorage.getItem('actaId')
                );
                */
              },
              error: error => {
                this.alert('error', 'Ocurrió un error al cerrar el evento', '');
              },
            });
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'No existe ningún evento a cerrar.',
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

  validaGood() {
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden validar bienes',
        ''
      );
      return;
    }
    if (this.data.count() == 0) {
      this.alert('warning', 'No hay bienes a validar', '');
      return;
    } else {
      console.log(this.params.getValue());
      this.validateDonationGoods();
      /*
      this.donationService.getApprove(this.params.getValue()).subscribe({
        next: data => {
          console.log(this.dataDetailDonation);
          console.log(data.data);
          this.alert(
            'success',
            `Bienes válidos ${this.errorSumValidos}, Bienes inválidos ${this.errorSumInvalidos}`,
            ''
          );
        },
      });
      */
    }
  }
  findRast() {
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden cargar bienes del rastreador',
        ''
      );
      return;
    }
    const newBody = {
      no_acta: this.idAct,
      areaD: this.areaD,
      cAmount: this.cCantidad,
      cCanrkg: this.cCanrkg,
      cEvent: this.cEvento,
    };
    localStorage.setItem('save_data', JSON.stringify(newBody));
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FMCOMDONAC_1' },
    });
  }

  searchGoodError(provider?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };
    let modalRef = this.modalService.show(GoodErrorComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        console.log(next);
      }
    });
  }
  actualizarActa() {
    if (this.idAct === null) {
      this.alertInfo('warning', 'Debe seleccionar un evento', '');
      return;
    }
    if (this.estatus === 'CERRADA') {
      this.alertInfo('warning', 'No puede actualizar un evento cerrado', '');
      return;
    }
    this.selectedGooodsValid.forEach(good => {
      let obj: any = {
        recordId: localStorage.getItem('actaId'),
        goodId: good.goodid,
        amount: good.cantidad,
        received: '1',
        exchangeValue: good.exchangeValue ?? 0,
        registrationId: good.registrationId,
      };
      console.log('actualizarActa::' + JSON.stringify(obj));

      this.updateBienDetalle(good.goodid, 'CPD');
      // delete this.eventdetailDefault.numDelegation1Description;
      // delete this.eventdetailDefault.numDelegation2Description;
      // delete this.eventdetailDefault.numTransfer_;
      this.donationService.putDetailDona(obj).subscribe({
        next: async data => {
          this.alertInfo('success', 'Se actualizó el evento correctamente', '');
          await this.generaRepote();
        },
        error: error => {
          this.alert('error', 'Ocurrió un error al actualizar el evento', '');
          // this.loading = false
        },
      });
    });
  }
  generaRepote() {}
  actualizarEvento() {
    const toolbar_user = this.authService.decodeToken().username;
    const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;

    if (
      cadena != 0 &&
      this.authService.decodeToken().username == toolbar_user
    ) {
      null;
    } else {
      let obj: any = {
        cveAct: this.eventDonacion.cveAct,
        elaborationDate: this.eventDonacion.elaborationDate,
        estatusAct: 'CERRADA',
        elaborated: this.authService.decodeToken().username,
        witness1: this.eventDonacion.witness1,
        witness2: this.eventDonacion.witness2,
        actType: 'COMPDON',
        observations: this.eventDonacion.observations,
        registreNumber: null,
        noDelegation1: localStorage.getItem('area'),
        fileId: this.eventDonacion.fileId,
        noDelegation2: null,
        identifier: this.eventDonacion.identifier,
        folioUniversal: this.eventDonacion.folioUniversal,
        closeDate: null,
      };
      this.donationService.putEvent(obj, this.idAct).subscribe({
        next: async data => {
          this.loading = false;

          let obj = {
            pActaNumber: this.idAct,
            pStatusActa: 'ABIERTA',
            pVcScreen: 'FMCOMDONAC_1',
            pUser: this.authService.decodeToken().username,
          };

          await this.updateGoodEInsertHistoric(obj);

          // this.alertInfo('success', 'El Evento Ha Sido Actualizado', '');
          this.alert('success', 'evento actualizado', '');
          this.data1 = 'ABIERTA';
          //this.disabledBtnCerrar = false;
          this.disabledBtnActas = false;
          this.dataTableGood.refresh();
          await this.getDetailProceedingsDevollution(this.idAct);
        },
        error: error => {
          console.log('error', 'Ocurrió un Error al actualizar el evento', '');
        },
      });
    }
  }
  searchRopaId(rop?: string) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      rop,
    };

    let modalRef = this.modalService.show(RopIdComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      if (next) {
        this.alert(
          'success',
          'Se actualizó la información del Bien',
          next.goodNumber
        );
      }
      await this.updateGood(next.goodNumber);
    });
  }
  updateGood(goodNumber: number | string) {}

  //AGREGADO POR GRIGORK
  getEventComDonation() {
    const idProcedure = localStorage.getItem('actaId');
    const params = new FilterParams();
    params.addFilter('actId', idProcedure, SearchFilter.EQ);
    this.donationService
      .getEventComDonationFilter(params.getParams())
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }

  validateGoodFirst(goodNumber: any, noDelegation: any, noDelegation2: any) {
    const token = this.authService.decodeToken();
    console.log(token);
    const newBody: IFmComDanc = {
      user: token.preferred_username,
      goodNumber: 0,
      NO_DELEGACION_2: 0,
      NO_DELEGACION_1: 0,
      TOOLBAR_NO_DELEGACION: parseInt(token.department),
    };
  }

  validateGoodTracker(body: IProcedureFmCom) {
    console.log(body);
    this.goodProcessService.procedureFmcom(body).subscribe(
      res => {
        console.log(res);
        console.log(res.data);
      },
      err => {
        console.log(err);
      }
    );
  }

  //consulta de bienes
  queryDonationGoods() {
    const token = this.authService.decodeToken();
    /*
    const body: IFmComDanc = {
      user: token.preferred_username,
      goodNumber: -1,
      NO_DELEGACION_2: 0,
      NO_DELEGACION_1: 0,
      TOOLBAR_NO_DELEGACION: 0,
    };
    */
    const idAct = Number(localStorage.getItem('actaId'));
    const body = {
      AREA_D: this.areaD, //10
      user: token.preferred_username,
      no_acta: idAct,
    };
    console.log(body);
    this.goodProcessService.queryDonationGoods(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.data);
        await this.getDetailProceedingsDevollution(this.idAct);
      },
      err => {
        console.log(err);
      }
    );
  }

  cleanProcessDonationGoods() {
    const token = this.authService.decodeToken();
    const idAct = Number(localStorage.getItem('actaId'));
    const body = {
      AREA_D: 10, //this.areaD,
      user: token.preferred_username,
      no_acta: idAct,
    };
    console.log(body);
    this.goodProcessService.detailProcessClean(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.data);
        await this.getDetailProceedingsDevollution(this.idAct);
      },
      err => {
        console.log(err);
      }
    );
  }

  loadDonationGoods() {
    const token = this.authService.decodeToken();
    /*
    const body: IFmComDanc = {
      user: token.preferred_username,
      goodNumber: -1,
      NO_DELEGACION_2: 0,
      NO_DELEGACION_1: 0,
      TOOLBAR_NO_DELEGACION: 0,
    };
    */
    const idAct = Number(localStorage.getItem('actaId'));
    const body = {
      AREA_D: 10, //this.areaD,
      user: token.preferred_username,
      no_acta: idAct,
    };
    console.log(body);
    this.goodProcessService.queryDonationGoods(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.data);
        await this.getDetailProceedingsDevollution(this.idAct);
      },
      err => {
        console.log(err);
      }
    );
  }

  //consulta de bienes
  validateDonationGoods() {
    const token = this.authService.decodeToken();
    /*
    const body: IFmComDanc = {
      user: token.preferred_username,
      goodNumber: -1,
      NO_DELEGACION_2: 0,
      NO_DELEGACION_1: 0,
      TOOLBAR_NO_DELEGACION: 0,
    };
    */
    const idAct = Number(localStorage.getItem('actaId'));
    const body = {
      minutesNumber: idAct, //this.areaD,
      transferorNumber: 0,
      classificationNumber: 0,
      goodNumber: 0,
      status: '',
      unit: '',
    };
    console.log(body);
    this.goodProcessService.validateDonationGoods(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.data);
        await this.getDetailProceedingsDevollution(this.idAct);
      },
      err => {
        console.log(err);
      }
    );
  }
}

export interface IParamsDonac {
  origin: string;
}

export interface IDonationGoodError {
  goodId: number;
  des_error: string;
}
