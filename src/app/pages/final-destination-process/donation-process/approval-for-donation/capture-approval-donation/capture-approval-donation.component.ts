import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
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
import { BehaviorSubject, lastValueFrom, map, takeUntil } from 'rxjs';
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
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import {
  IFmComDanc,
  IProcedureFmCom,
  IPupValidGood,
} from 'src/app/core/services/ms-good/good-process-model';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { ApprovalDelegationComponent } from '../approval-delegation/approval-delegation.component';
import { CreateActaComponent } from '../create-acta/create-acta.component';
import { FindActaComponent } from '../find-acta/find-acta.component';
import { GoodErrorComponent } from '../good-error/good-error.component';
import { RopIdComponent } from '../rop-id/rop-id.component';
import { ModalApprovalDonationComponent } from './../modal-approval-donation/modal-approval-donation.component';
import { COPY } from './columns-approval-donation';

import { format } from 'date-fns';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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

      .row > * {
        flex-shrink: 0;
        width: 100%;
        max-width: 100%;
        padding-right: calc(var(--bs-gutter-x) * 0.5);
        padding-left: calc(var(--bs-gutter-x) * 1);
        margin-top: var(--bs-gutter-y);
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
export class CaptureApprovalDonationComponent
  extends BasePage
  implements OnInit
{
  regisForm: FormGroup;
  delForm: FormGroup;
  idsNotExist: NotData[] = [];
  $trackedGoods = this.store.select(getTrackedGoods);
  foolio: number;
  statusGood_: any;
  deleteO: boolean = false;
  goods: any[] = [];

  showError: boolean = true;
  availableToAssing: boolean = true;

  showMessageRast: boolean = false;

  activeRadio: boolean = true;
  showPbDelete: boolean = false;
  showPbTracker: boolean = false;

  radio: boolean = false;
  bienesVaild: boolean = false;
  changeDescription: string;
  dataTableGood_: any[] = [];
  body: IExportDetail;
  ngGlobal: any;

  loadingVal: boolean = false;
  loading3: boolean = false;
  Exportdate: boolean = false;
  inputVisible: boolean = false;

  maxDate = new Date();

  //proceding identifier (no_acta)
  idAct: number = 0;
  disabledBtnActas: boolean = true;
  totalItems2: number = 0;

  cveActa: string = '';
  goodError: IDonationGoodError[];
  dataDetailDonation: any;
  data1: any;
  columnFilterDet: any[] = [];
  consec: string = '';
  data: LocalDataSource = new LocalDataSource();
  excelLoading: boolean = false;

  total_report: number = 0;
  total_bien_error: number = 0;
  total_sum_bien: number = 0;

  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  dataTableGood: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  estatus: string;
  selectedRow: IGood;
  origin2: 'FCONGENRASTREADOR';
  fileNumber: number = 0;

  settings2;
  to: string = '';
  annio: string = '';
  type = 'COMPDON';
  eventDonacion: IGoodDonation;
  origin = 'FMCOMDONAC_1';

  paramsScreen: IParamsDonac = {
    origin: '',
  };

  //Etapa estado para buscar delegación
  stagecreated: any = 2;
  areas$ = new DefaultSelect<any>();
  typeProcedding: string = 'CPD';

  //SETEA BLK_CONTROL
  v_usuario: string;
  v_rastr: boolean = false;
  area_d: any; //-->AREA_D
  no_delegacion_1: number = null; //--> NO_DELEGACION_1
  no_delegacion_2: number = null; //-->NO_DELEGACION_2
  nivel_usuario: number = 0;
  //LABELS DE BOTONES
  pb_label: string = 'Consulta Bienes';
  VALIDA_B: boolean = true;
  V_RASTR: boolean = false;

  c_evento: number = 0;
  c_cantidad: number = 0;
  c_Canrkg: number = 0;
  sel_todo: number = 0;

  //disable all buttons
  disableAllButtons: boolean = false;

  //declaradas para resolver conflictos
  valida_b: number;
  val_cambio: number;

  years: number[] = [];
  currentYear: number = new Date().getFullYear();

  @ViewChild('grdDetail') grdDetail;

  columnFilters: any = [];
  carga: number = 0;
  rop_div: number = 0;
  tracker_iter: number = 0;

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
    private store: Store,
    private delegationService: DelegationService,
    private serviceUser: UsersService,
    private parametersService: ParametersService,
    private rNomenclaService: RNomenclaService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private gParameterService: GoodParametersService,
    private massiveGoodService: MassiveGoodService,
    private renderer2: Renderer2,
    private e: ElementRef
  ) {
    super();

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
    this.v_usuario = this.authService.decodeToken().username.toUpperCase();
    localStorage.setItem('area', this.authService.decodeToken().siglasnivel3);
    //this.stagecreated = await this.delegationWhere();
    //getStage
    //console.log('capture-app::stagecreated::' + this.stagecreated);
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.initialize();

    this.initForm();
    this.tracker_iter = 0;
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          console.log('DESPUES DE REGRESAR DE RASTREADOR::0::' + this.ngGlobal);
          if (this.ngGlobal.REL_BIENES) {
            const newData = JSON.parse(localStorage.getItem('save_data'));
            const body: IProcedureFmCom = {
              areaD: newData.area_d,
              cAmount: newData.cAmount,
              cCanrkg: newData.cCanrkg,
              cEvent: newData.cEvent,
              minutesNumber: newData.no_acta,
              goodsRel: this.ngGlobal.REL_BIENES,
            };

            console.log(
              'DESPUES DE REGRESAR DE RASTREADOR::' + this.tracker_iter
            );
            if (this.tracker_iter == 0) {
              this.showMessageRast = true;
              this.validateGoodTracker(body);
            }
            this.tracker_iter++;
          }
        },
      });

    this.$trackedGoods.subscribe({
      next: response => {
        if (response !== undefined) {
          //this.loadGood(response);
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
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'recordid':
                searchFilter = SearchFilter.EQ;
                break;
              case 'goodid':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cantidad':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noexpediente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'noetiqueta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idnoworker1':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idexpworker1':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noclasifbien':
                searchFilter = SearchFilter.EQ;
                break;
              case 'procesoextdom':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'warehousenumb':
                searchFilter = SearchFilter.EQ;
                break;
              case 'warehouse':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'warehouselocat':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'coordadmin':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDetailProceedingsDevollution();
        }

        console.log('Se disparo el evento de cambio de datos...onChanged');
        // if (change.action === 'filter') {
        //   let filters = change.filter.filters;
        //   filters.map((filter: any) => {
        //     let field = '';
        //     let searchFilter = SearchFilter.ILIKE;
        //     field = `filter.${filter.field}`;
        //     const search: any = {
        //       numberGood: () => (searchFilter = SearchFilter.EQ),
        //       amount: () => (searchFilter = SearchFilter.EQ),
        //       description: () => (searchFilter = SearchFilter.EQ),
        //       unit: () => (searchFilter = SearchFilter.EQ),
        //       status: () => (searchFilter = SearchFilter.EQ),
        //       noExpediente: () => (searchFilter = SearchFilter.EQ),
        //       noEtiqueta: () => (searchFilter = SearchFilter.EQ),
        //       idNoWorker1: () => (searchFilter = SearchFilter.EQ),
        //       idExpWorker1: () => (searchFilter = SearchFilter.EQ),
        //       noClasifBien: () => (searchFilter = SearchFilter.EQ),
        //       procesoExtDom: () => (searchFilter = SearchFilter.EQ),
        //       warehouseNumb: () => (searchFilter = SearchFilter.EQ),
        //       warehouse: () => (searchFilter = SearchFilter.EQ),
        //       warehouseLocat: () => (searchFilter = SearchFilter.EQ),
        //       coordAdmin: () => (searchFilter = SearchFilter.EQ),
        //     };
        //     search[filter.field]();
        //     if (filter.search !== '') {
        //       this.columnFilterDet[field] = `${searchFilter}:${filter.search}`;
        //     } else {
        //       delete this.columnFilterDet[field];
        //     }
        //   });

        //   this.params = this.pageFilter(this.params);
        //   console.log('Se disparó aquí: filter');

        //   this.getDetailProceedingsDevollution(localStorage.getItem('actaId'));
        // }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailProceedingsDevollution());

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
  }

  onSelectChangeYear(event: any) {
    console.log(event);
    this.generarClave_();
  }

  generarClave_() {
    const acta = this.regisForm.value.acta;
    const area = this.regisForm.value.area;
    const consec = this.regisForm.value.folio;
    const anio = this.regisForm.value.year;

    this.cveActa = `${acta}/${area}/${anio}/${consec}`;

    this.regisForm.patchValue({
      keyEvent: this.cveActa,
    });
  }

  getRowSelec(event: any) {
    this.typeProcedding = event;
    console.log('this.typeProcedding:::' + this.typeProcedding);
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
        this.getDetailProceedingsDevollution(this.idAct);
      } else {
        this.pb_label = 'Carga Bienes';

        if (this.valida_b == 1) {
          this.valida_b = 0; //0 es false y 1 es true
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
    this.configDatePicker();

    this.regisForm = this.fb.group({
      type: ['CPD', []],
      area: [
        localStorage.getItem('area'),
        [Validators.pattern(STRING_PATTERN)],
      ],
      year: [{ value: null, disabled: true }, []],
      folio: [null],
      captureDate: [{ value: null, disabled: true }, []],
      keyEvent: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      observaciones: [null],
      activeRadio: ['-1'],
    });
    //this.regisForm.get('activeRadio').setValue('0');
    this.delForm = this.fb.group({
      observaElimina: [null, [Validators.required]],
    });
    console.log('antes de llamar a getComerDonation');
    this.getComerDonation(this.nivel_usuario);
  }
  /*
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
    */

  getComerDonation(nivel_usuario: number) {
    this.total_report = 0;
    this.total_bien_error = 0;
    this.total_sum_bien = 0;

    this.idAct = Number(localStorage.getItem('actaId'));
    console.log('...entrando a getComerDonation:: acta::' + this.idAct);
    if (this.idAct == null || this.idAct == 0) {
      return;
    }
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
        this.no_delegacion_2 = data.noDelegation2;
        this.no_delegacion_1 = data.noDelegation1;

        if (nivel_usuario == 1) {
          this.area_d =
            data.noDelegation2 != null
              ? data.noDelegation2
              : data.noDelegation1;
        } else if (nivel_usuario == 2) {
          this.area_d =
            data.noDelegation1 != null ? data.noDelegation1 : token.department;
        }
        console.log('1.data:getComerDonation::::this.area_d:::' + this.area_d);
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
        } else {
          this.deleteO = false;
        }
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
              this.cleanData();
              this.getDetailProceedingsDevollution(this.idAct);
            }
          } else {
            // goBlock('DETALLE_EVENT_COM_DON');
            if (this.dataDetailDonation.length === 0) {
              this.alert('warning', 'No hay bienes a validar.', '');
            } else {
              // PUP_CARGA_BIENES;
              this.cleanData();
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

  async getDetailProceedingsDevollution(id?: any) {
    this.total_report = 0;
    this.total_bien_error = 0;
    this.total_sum_bien = 0;

    const token = this.authService.decodeToken();

    this.loading3 = true;

    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.recordId'] = `$eq:${this.idAct}`;
    const value = this.regisForm.get('activeRadio').value;
    //console.log('activeRadio::' + value);
    if (value > 0) {
      params['filter.valcambio'] = `$eq:${value}`;
    }
    //this.area_d = data.noDelegation1 != null ? data.noDelegation1 : token.department;
    params['filter.idArea'] = `$eq:${
      this.area_d == null ? token.department : this.area_d
    }`;
    //console.log('params::' + JSON.stringify(params));
    //params['filter.good.status'] !== `$eq:ROP`; //! No encuentro que sea diferente de ROP en la forma
    return new Promise((resolve, reject) => {
      this.donationService.getEventComDonationDetail(params).subscribe({
        next: data => {
          console.log(data);
          const infoDetail = data.data.map(item => {
            /*
            deductivesRelSample.map(deductiveEx => {
              if (deductiveEx.deductiveVerificationId == item.id) {
                item.observations = deductiveEx.observations;
                item.selected = true;
              }
            });
            */
            if (item.selected == 1) {
              item.selected = true;
              const exists = this.selectedGooodsEvent.find(
                good => good.goodid == item.goodid
              );
              // (!exists) this.selectedGooodsEvent.push(item.goodid);
              if (!exists) this.selectedGooodsEvent.push(item);
            }
            return item;
          });
          /*
          let result = data.data.map((item: any) => {
            
            this.total_sum_bien += parseInt(item.amount);
            parseFloat(this.total_sum_bien.toString());
            item['description'] = item.good.description
              ? item.good.description
              : null;
            const status = item.good.status || null;
            if (status !== null) {
              this.errorSumValidos += status.length;
            } else {
              this.errorSumInvalidos++;
            }
            this.total_bien_error += item['error'];
            console.log(this.total_sum_bien);
            
          });
          Promise.all(result).then(items => {
            this.dataDetailDonation = data.data;
            this.data.load(this.dataDetailDonation);
            this.data.refresh();
            this.totalItems2 = data.count ?? 0;
            this.total_report = this.totalItems2;
            console.log('getDetailProceedingsDevollution', data);
            this.loading3 = false;
            this.Exportdate = true;
          });
          */

          console.log(data.data);

          // this.dataFactActas.load(data.data);
          // this.dataFactActas.refresh();
          // this.loading = false;
          // this.totalItems2 = data.count;

          //this.dataDetailDonation = data.data;
          this.data.load(data.data);
          this.data.refresh();
          this.loading3 = false;
          this.totalItems2 = data.count ?? 0;
          console.log(
            'BIENES EN EL EVENTO: ' + JSON.stringify(this.selectedGooodsEvent)
          );
          this.getQuantityProceedingsDevollution(this.idAct);
          /*
                    setTimeout(() => {
                      this.disableCheckboxes();
                    }, 1500);
                    */
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
    this.total_report = 0;
    this.total_bien_error = 0;
    this.total_sum_bien = 0;

    params['recordId'] = `$eq:${this.idAct}`;
    let value = this.regisForm.get('activeRadio').value;
    if (value == null || value == 'null') {
      value = '0';
    }
    console.log(
      'getQuantityProceedingsDevollution::' +
        this.idAct +
        ':::activeRadio::' +
        value
    );
    if (value > 0) {
      params['filter.valcambio'] = `$eq:${value}`;
    }
    let pram = this.idAct + '|' + (value == null ? 0 : value);
    console.log('pram::' + pram);
    console.log('idAct::' + this.idAct);
    console.log('pram::' + value);
    //params['filter.good.status'] !== `$eq:ROP`; //! No encuentro que sea diferente de ROP en la forma
    return new Promise((resolve, reject) => {
      this.donationService.getQuantityEventComDonationDetail(pram).subscribe({
        next: data => {
          //console.log(data);
          let result = data.data.map((item: any) => {
            this.total_report += parseInt(item.count);

            if (item.er !== '') {
              this.total_bien_error += parseInt(item.count);
            }
            if (item.er === '') {
              this.total_sum_bien += parseFloat(item.sum);
            }

            console.log(
              'getQuantityProceedingsDevollution::' + this.total_sum_bien
            );
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
    console.log('seleccionados::' + event.isSelected);
    //if(this.selectedGooodsValid)
    //disponible
    const row = this.grdDetail.grid.dataSet;
    //console.log('row::' + JSON.parse(row));
  }
  rowsSelected2(rowData: { isSelected: boolean; data: any }) {
    console.log(rowData);
    console.log(rowData.data);
    console.log(rowData.isSelected);
    rowData.isSelected = false;
  }

  exportAll(): void {
    let value = this.regisForm.get('activeRadio').value;
    if (value == null || value == 'null') {
      value = '0';
    }
    let body = {
      minutesNumber: this.idAct,
      valChange: value,
      delegationId:
        this.area_d == null
          ? this.authService.decodeToken().department
          : this.area_d,
    };
    /*
        this.body = {
      recordId: this.idAct,
      typeActa: 'COMPDON',
      delegationId: Number(localStorage.getItem('noDelegation1')),
      nombre_transferente: null,
    };
    */
    this.getEventComDonationExcel(body);
  }

  getEventComDonationExcel(body: any): void {
    /*
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se puede descargar el archivo',
        ''
      );
      return;
    }
    */
    if (this.data.count() == 0) {
      this.alert('warning', 'No hay bienes para descargar', '');
      return;
    } else {
      this.excelLoading = true;
      console.log('excel::' + JSON.stringify(body));
      this.massiveGoodService.detailDonationEventExcel(body).subscribe({
        next: data => {
          this.excelLoading = false;
          this.alert(
            'warning',
            'El archivo se esta generando, favor de esperar la descarga',
            ''
          );
          this.downloadDocument('Detalle-Donacion', 'excel', data.base64File);
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
    /*
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
    */
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = filename;
    link.click();
    link.remove();
    this.excelLoading = false;
    this.alert('success', 'El archivo se ha descargado', '');
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
  //bienes que ya se encuentran en el evento
  selectedGooodsEvent: any[] = [];

  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  ///*'Debe capturar un evento.'*/
  async addSelect() {
    if (this.selectedGooods.length > 0) {
      if (this.dataDetailDonation.recordId == null) {
        this.alert(
          'warning',
          'No existe un evento en la cual asignar el bien.',
          ''
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
      /*
      // console.log('this.actasDefault ', this.actasDefault);
      if (this.dataDetailDonation == null) {
        this.alert(
          'warning',
          'Debe especificar/buscar el evento para despues eliminar el bien.',
          ''
        );
        return;
      }
      */
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
      }
      if (this.selectedGooodsEvent.length == 0) {
        this.alert(
          'warning',
          'Debe seleccionar un bien que Forme parte del evento primero',
          ''
        );
        return;
      }

      if (this.delForm.get('observaElimina').value === null) {
        this.alert(
          'warning',
          'Debe llenar las observaciones de la eliminación primero',
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
              //Solo los bienes que se encuentran ya en el evento se pueden eliminar
              console.log('Bienes seleccionados: ' + this.selectedGooodsValid);
              let result = this.selectedGooodsValid.map(async good => {
                console.log('validad bien:::' + good);
                console.log('bienes en el evento::' + this.selectedGooodsEvent);
                const exists = this.selectedGooodsEvent.find(
                  goode => goode.goodid == good.goodid
                );
                console.log('bienes existe en evento: ' + exists);
                if (exists) {
                  console.log('good', good);
                  this.dataDetailDonation = this.dataDetailDonation.filter(
                    (_good: any) => _good.id != good.goodid
                  );
                  let index = this.dataTableGood_.findIndex(
                    g => g.id === good.goodid
                  );

                  await this.updateBienDetalle(good.goodid, 'ROP');
                  await this.deleteDET(good);
                  // this.selectedGooods = [];
                  //ACTUALIZA COLOR
                  this.dataTableGood_ = [];
                  this.dataTableGood.load(this.dataTableGood_);
                  this.dataTableGood.refresh();
                }
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
  //actualiza estatus del bien
  async updateBienDetalle(idGood: string | number, status: string) {
    this.goodService.updateStatusActasRobo(idGood, status).subscribe({
      next: data => {
        console.log(data);
        //this.getDetailProceedingsDevollution(idGood);
      },
      error: () => (this.loading = false),
    });
  }
  async deleteDET(good: any) {
    console.log(good);
    const valid: any = await this.getGoodsDelete(good.goodid);
    if (valid != null) {
      let obj: any = {
        recordId: this.idAct,
        goodId: good.goodid,
        amount: good.cantidad,
        received: good.recibido,
        exchangeValue: good.val_cambio | 0,
        registrationId: good.registreNumber,
      };

      await this.deleteDetailProceeAndTmp(obj);
      await this.createDetailProceeAndTmp(obj);
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
  //deleteDetailDona
  async deleteDetailProceeAndTmp(params: any) {
    return new Promise((resolve, reject) => {
      this.donationService.deleteDetailDona(params).subscribe({
        next: data => {
          console.log('data', data);
          // this.loading2 = false;
          //Insertar en tmp
          resolve(true);
        },
        error: error => {
          // this.loading2 = false;
          resolve(false);
        },
      });
    });
  }

  async createDetailProceeAndTmp(params: any) {
    return new Promise((resolve, reject) => {
      this.goodProcessService.createDatailTmp(params).subscribe({
        next: data => {
          console.log('data', data);
          // this.loading2 = false;
          //Insertar en tmp
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
    console.log(
      'DESPUES DE REGRESAR DE RASTREADOR::loadGood::' + JSON.stringify(data)
    );
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
    this.totalItems2 = 0;
    this.eventDonacion = null;
    this.estatus = null;
    this.selectedGooods = [];
    this.Exportdate = false;
    this.idAct = 0;
    this.total_report = 0;
    this.total_bien_error = 0;
    this.total_sum_bien = 0;
    localStorage.removeItem('nameT');
    localStorage.removeItem('actaId');
    this.selectedGooodsEvent = [];
    this.delForm.reset();
  }

  cleanData_() {
    this.dataTableGood.load([]);
    this.data.load([]);
    this.totalItems2 = 0;
    this.eventDonacion = null;
    this.estatus = null;
    this.selectedGooods = [];
    this.Exportdate = false;
    this.total_report = 0;
    this.total_bien_error = 0;
    this.total_sum_bien = 0;
    this.selectedGooodsEvent = [];
    this.delForm.reset();
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
      this.total_sum_bien = 0;
      this.total_bien_error = 0;
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
      //this.regisForm.get('area').setValue(area);
      console.log('4.data:getComerDonation::::');

      this.idAct = next.actId;
      localStorage.setItem('actaId', next.actId);

      /*
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
      */
      this.paramsScreen = {
        origin: 'FMCOMDONAC_1',
      };
      //this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);
      //await this.getDetailProceedingsDevollution(next.actId);
      await this.getComerDonation(this.nivel_usuario);
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
    console.log('agregarcaptura:this.area_d:::' + this.area_d);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      delegationToolbar: this.delegationToolbar,
      fileNumber: this.fileNumber,
      expedient: this.fileNumber,
      area_d: this.area_d,
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
          type: this.typeProcedding, //next.actType,
          area: localStorage.getItem('area'),
          keyEvent: next.cveAct,
          anio: localStorage.getItem('anio'),
          testigoOne: next.witness1,
          testigoTree: next.witness2,
          elaboradate: next.captureDate,
          captureDate: formattedfecCapture,
        });
      }
      this.total_sum_bien = 0;
      this.total_bien_error = 0;
      this.totalItems2 = 0;
      this.eventdetailDefault = next;
      this.estatus = next.estatusAct;
      if (this.estatus == 'CERRADA') {
        this.disabledBtnActas = false;
      } else {
        this.disabledBtnActas = true;
      }
      // this.generarDatosDesdeUltimosCincoDigitos(next.cveAct);

      //await this.getDetailProceedingsDevollution(next.actId);
      await this.getComerDonation(this.nivel_usuario);
    });
  }

  delegationToolbar: any = null;

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
      //checar el no de expediente
      const toolbar_user = this.authService.decodeToken().preferred_username;
      const cadena = this.cveActa ? this.cveActa.indexOf('?') : 0;
      let expedient = 0;
      /*
      this.selectedGooodsEvent.forEach(good => {
        expedient = good;
      });
      */
      this.selectedGooodsEvent.forEach(good => {
        if (good.goodid == good.goodid) {
          expedient = good.noexpediente;
        }
      });
      if (expedient == 0) {
        this.selectedGooodsValid.forEach(good => {
          expedient = good.noexpediente;
          //console.log('selectedGooodsValid::'+ good);
        });
      }
      if (expedient == null) {
        console.log(expedient + ' == null');
        expedient = 0;
      }

      if (expedient === null) {
        console.log(expedient + ' === null');
        expedient = 0;
      }

      if (typeof expedient === 'undefined') {
        console.log(expedient + ' is undefined');
        expedient = 0;
      }
      console.log('Expediente:::' + expedient);

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
          console.log('Expediente::' + expedient);
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
              fileId: Number(expedient), //Number(this.eventDonacion.fileId),
              noDelegation2: null,
              identifier: this.eventDonacion.identifier,
              folioUniversal: this.eventDonacion.folioUniversal,
              closeDate: new Date(),
            };
            console.log(obj);
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
                await this.cleanProcessDonationGoods();
                this.getComerDonation(this.nivel_usuario);

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

  async validaGood() {
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
      const value = this.regisForm.get('activeRadio').value;
      console.log(value);
      if (value == 0) {
        //PUP_VALIDA_BIENES
        this.loadingVal = true;
        const body: IPupValidGood = {
          minutesNumber: parseInt(localStorage.getItem('actaId')),
          transferorNumber: 0,
          classificationNumber: 0,
          goodNumber: 0,
          status: '',
          unit: '',
        };
        await this.goodProcessService.pupValidGood(body).subscribe({});
        this.loadingVal = false;
        await this.getDetailProceedingsDevollution(this.idAct);
      } else {
        if (value != this.val_cambio) {
          this.alert(
            'warning',
            'Grupo de bien incorrecto',
            'Para poder validar los bienes, seleccione el grupo al que pertenece'
          );
          return;
        } else {
          this.valida_b = 1;
          //PUP_CARGA BIENES
        }
      }
      //!VER SI ESTO TODAVÍA FUNCIONA
      /* console.log(this.params.getValue());
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
      }); */
    }
  }

  //Muestra pantalla del rastreador de bienes
  findRast() {
    console.log('findRast' + this.idAct);
    if (this.idAct <= 0) {
      this.alert(
        'warning',
        'Debe especificar/buscar el evento para despues ingresar bienes.',
        ''
      );
      return;
    }
    if (this.estatus === 'CERRADA') {
      this.alert(
        'warning',
        'El evento está cerrado, no se pueden cargar bienes del rastreador',
        ''
      );
      return;
    }
    this.cleanData_();
    const newBody = {
      no_acta: this.idAct,
      area_d: this.area_d,
      cAmount: this.c_cantidad,
      cCanrkg: this.c_Canrkg,
      cEvent: this.c_evento,
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
  async actualizarActa() {
    if (this.idAct === null) {
      this.alertInfo('warning', 'Debe seleccionar un evento', '');
      return;
    }
    if (this.estatus === 'CERRADA') {
      this.alertInfo('warning', 'No puede actualizar un evento cerrado', '');
      return;
    }
    if (this.data.count() == 0) {
      this.alert('warning', 'No hay bienes para agregar al evento.', '');
      return;
    }
    if (this.selectedGooodsValid.length == 0) {
      this.alertInfo('warning', 'No existen bienes seleccionados.', '');
      return;
    }
    let valgoods = '';
    //console.log('valida validados:' + JSON.stringify(this.selectedGooodsValid));
    this.selectedGooodsValid.forEach(good => {
      //console.log('valida bien: ' + good.val_cambio);
      let valcambio = '';
      if (good.val_cambio == null) {
        //console.log(good.val_cambio + ' == null');
        valcambio = '-';
      }

      if (typeof good.val_cambio === 'undefined') {
        //console.log(good.val_cambio + ' is undefined');
        valcambio = '-';
      }
      if (good.val_cambio == '0') {
        //console.log(good.val_cambio + ' == 0');
        valcambio = '-';
      }
      console.log('valcambio::' + valcambio);
      if (valcambio == '-') {
        valgoods = valgoods + (valgoods == '' ? '' : ',') + good.goodid;
      }
    });
    console.log('valida validados:' + valgoods);
    if (valgoods !== '') {
      this.alertInfo(
        'warning',
        'Los bienes seleccionados no pueden ser agregados al evento. Deben ser validados inicialmente o no se encuentran disponibles: ' +
          valgoods,
        ''
      );
      return;
    }

    this.alertQuestion(
      'question',
      '¿Seguro que desea agregar bienes al evento?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        this.selectedGooodsValid.forEach(good => {
          const exists = this.selectedGooodsEvent.find(
            goode => goode.goodid == good.goodid
          );
          console.log('bien xiste:' + exists);
          let proceed = exists == 'undefined' || exists == null ? false : true;
          console.log('proceed::' + proceed);
          if (!proceed) {
            console.log('entra a alta');
            let obj: any = {
              recordId: localStorage.getItem('actaId'),
              goodId: good.goodid,
              amount: good.cantidad,
              received: '1',
              exchangeValue: good.val_cambio ?? 0,
              registrationId: good.registrationId,
            };
            let error = good.error == null || good.error == '' ? 'N' : 'Y';
            let vcambio =
              good.val_cambio !== null || good.val_cambio !== ''
                ? good.val_cambio
                : 0;
            console.log('actualizarActa::good::' + JSON.stringify(good));
            console.log('actualizarActa::' + JSON.stringify(obj));
            console.log('error::' + error + '  - ' + vcambio);

            if (error == 'N' && vcambio > 0) {
              this.updateBienDetalle(good.goodid, 'CPD');
              this.donationService.postDetailDona(obj).subscribe({
                next: async data => {
                  this.alertInfo(
                    'success',
                    'Se actualizó el evento correctamente',
                    ''
                  );
                  await this.generaRepote();
                  await this.deleteTempDetailEvent(good.recordid, good.goodid);
                },
                error: error => {
                  this.alert(
                    'error',
                    'Ocurrió un error al actualizar el evento',
                    ''
                  );
                  // this.loading = false
                },
              });
              //Elimina bien de detalle
            }

            this.delForm.reset();
          }
        });
        this.selectedGooodsValid = [];
        await this.getDetailProceedingsDevollution(this.idAct);
      }
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
    this.goodProcessService.procedureFmcomtmp(body).subscribe(
      res => {
        //console.log('validateGoodTracker:::' + JSON.stringify(res));
        //solo se muestra el mensaje una sola vez
        console.log(res.message[0]);

        if (
          this.showMessageRast &&
          res.message[0] ==
            'Los bienes seleccionados no cumplen con las condiciones necesarias.'
        ) {
          this.alert('warning', res.message[0], '');
        }
        this.showMessageRast = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  async deleteTempDetailEvent(noActa: number, noGood: number) {
    const body = {
      actaNumber: noActa, //this.area_d,
      goodNumber: noGood,
    };
    console.log('deleteTempDetailEvent::' + body);
    this.goodProcessService.deleteTempDetailEvent(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.data);
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
      AREA_D:
        this.area_d == null
          ? this.authService.decodeToken().department
          : this.area_d, //this.area_d,
      user: token.preferred_username,
      no_acta: idAct,
    };
    console.log(body);
    this.goodProcessService.detailProcessCleanTmp(body).subscribe(
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
      AREA_D:
        this.area_d == null
          ? this.authService.decodeToken().department
          : this.area_d, //this.area_d,
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
    this.loading = true;
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
      minutesNumber: idAct, //this.area_d,
      transferorNumber: 0,
      classificationNumber: 0,
      goodNumber: 0,
      status: '',
      unit: '',
    };
    console.log('validateDonationGoods:::' + body);
    this.goodProcessService.validateDonationGoods(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.data);
        await this.getDetailProceedingsDevollution(this.idAct);
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
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
      AREA_D: this.area_d, //10
      user: token.preferred_username,
      no_acta: idAct,
    };
    console.log('queryDonationGoods::' + JSON.stringify(body));
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

  //init page
  async initialize() {
    const token = this.authService.decodeToken();
    this.v_usuario = token.username;

    let indicated = await this.getIndicator();
    console.log('indicated', indicated);
    if (indicated == null) {
      /*
      this.alert(
        'warning',
        `No se encontró el nivel de usuario.`,
        ''
      )
      */
      this.alertQuestion(
        'warning',
        'No se encontró el nivel de usuario.',
        '',
        'Aceptar'
      ).then(res => {
        console.log(res);
        this.cleanActa();
        if (res.isConfirmed) {
          this.router.navigate(
            [
              '/pages/final-destination-process/donation-process/approval-for-donation',
            ]
            /*{
              queryParams: {
                origin: 'FESTCONSULTA_0001',
              },
            }*/
          );
        } else {
          this.router.navigate(
            [
              '/pages/final-destination-process/donation-process/approval-for-donation',
            ]
            /*{
              queryParams: {
                origin: 'FESTCONSULTA_0001',
              },
            }*/
          );
        }
      });

      //Cerrar la pantalla
      this.disableAllButtons = true;
      //this.disabledField();
      //this.validate = true;
      return;
    }

    let FaVal = await this.getFaVal(indicated);
    const faVal: any = FaVal;
    const level: any = faVal ? faVal[0].fa_val_usuario_ind : 0;

    this.nivel_usuario = level;
    console.log(
      'nivel_usuario::' +
        this.nivel_usuario +
        ' -FaVal::' +
        JSON.stringify(FaVal)
    );
    if (this.nivel_usuario == 1) {
      if (this.idAct !== null) {
        this.getComerDonation(this.nivel_usuario);
      } else {
        this.selectedAreaModal();
      }

      if (this.no_delegacion_2 !== null) {
        this.area_d = this.no_delegacion_2;
      } else {
        this.area_d = this.no_delegacion_1;
      }
      //habilitar botones: PB_ELIMINA y PB_RASTREADOR
      this.showPbDelete = true;
      this.showPbTracker = false;
    } else {
      let userExist = await this.getTvalTable1(
        this.authService.decodeToken().username
      );
      console.log('userExist::' + JSON.stringify(userExist));
      if (userExist) {
        this.V_RASTR = true;

        //Habiliitar: PB_RASTREADOR
        this.showPbTracker = true;
      } else {
        this.V_RASTR = false;
      }
      if (this.idAct !== null) {
        this.getComerDonation(this.nivel_usuario);
      }
      if (this.no_delegacion_1 !== null) {
        this.area_d = this.no_delegacion_1;
      } else {
        this.area_d = this.authService.decodeToken().department;
      }
      if (this.nivel_usuario == 2) {
        //boton PB_ELIMINA se habilita
        this.showPbDelete = true;
      }
    }
    console.log('INITIALIZE:: area_d:::' + this.area_d);
  }

  async getTvalTable1(usuario: string) {
    return await new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.nmtable'] = `$eq:421`;
      params['filter.otvalor'] = `$eq:${usuario.toUpperCase()}`;
      this.dynamicCatalogsService.getTvaltable1_(params).subscribe({
        next: response => {
          //this.form.get('description').setValue(response.data[0].otvalor01);
          // this.loading = false;
          console.log('getTvalTable1::' + JSON.stringify(response));
          if (response.data) {
            resolve(response.data);
            //this.V_RASTR = true;
          } else {
            //this.V_RASTR = true;
            resolve(null);
          }
        },
        error: err => {
          //this.V_RASTR = false;
          console.log('getTvalTable1::ERROR:::' + err);
          resolve(null);
        },
      });
    });
    /*
    const params = new ListParams();
    params['filter.nmtable'] = `$eq:421`;
    params['filter.otvalor'] = `$eq:${usuario.toUpperCase()}`;
    this.dynamicCatalogsService.getTvaltable1_(params).subscribe({
      next: response => {
        //this.form.get('description').setValue(response.data[0].otvalor01);
        // this.loading = false;
        console.log('getTvalTable1::' + JSON.stringify(response));
        if (response.data) {
          this.V_RASTR = true;
        } else {
          this.V_RASTR = true;
        }
      },
      error: err => {
        this.V_RASTR = false;
        console.log(err);
      },
    });
    */
  }

  async getFaVal(indicated: any) {
    return await new Promise((resolve, reject) => {
      let body = {
        pUser: this.authService.decodeToken().username,
        pIndicatorNumber: indicated,
      };
      this.serviceUser.getAllFaVal(body).subscribe({
        next: resp => {
          if (resp.data) {
            resolve(resp.data);
          } else {
            resolve(null);
          }
        },
        error: err => {
          console.log(err);
          resolve(null);
        },
      });
    });
  }

  //Nivel de usuario
  async getIndicator() {
    return await new Promise((resolve, reject) => {
      let body = {
        user: this.authService.decodeToken().username,
        indicatorNumber: 12,
      };
      this.serviceUser.getAllIndicator(body).subscribe({
        next: resp => {
          if (resp.data) {
            resolve(resp.data[0].min);
          } else {
            resolve(null);
          }
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  //Area modal
  selectedAreaModal() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {};

    let modalRef = this.modalService.show(
      ApprovalDelegationComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        console.log();
        this.area_d = next.area_d;
        this.no_delegacion_2 = next.no_delegacion_2;
        //en pantalla establecer el área y deshabilitada
        /*
        this.regisForm.patchValue({
          folio: next.folioUniversal,
          type: next.actType,

        });
        */
      }
    });
  }

  cleanData() {
    this.total_sum_bien = 0;
    this.total_bien_error = 0;
    this.totalItems2 = 0;
    if (this.estatus == 'CERRADA') {
      this.disabledBtnActas = false;
    } else {
      this.disabledBtnActas = true;
    }
  }

  //Obtener area
  async readArea(lparams: FilterParams) {
    const params = new FilterParams();
    this.stagecreated = await this.delegationWhere();
    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.search.length > 0) {
      if (!isNaN(parseInt(lparams?.search))) {
        console.log('SI');

        params.addFilter('numberDelegation2', lparams.search, SearchFilter.EQ);
      } else {
        params.addFilter('delegation', lparams.search, SearchFilter.ILIKE);
      }
    } else {
      params.addFilter(
        'numberDelegation2',
        this.area_d == null
          ? this.authService.decodeToken().department
          : this.area_d
      );
    }
    console.log(
      'this.stagecreated::' +
        JSON.stringify(this.stagecreated) +
        ' - this.area_d::' +
        this.area_d
    );
    params.addFilter('stageedo', this.stagecreated, SearchFilter.EQ);
    params.sortBy = 'numberDelegation2:ASC';

    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('readArea', data);
        let result = data.data.map(async (item: any) => {
          item['cveAdmin'] = item.numberDelegation2 + ' - ' + item.delegation;
        });

        Promise.all(result).then(resp => {
          this.areas$ = new DefaultSelect(data.data, data.count);
        });
      },
      error: error => {
        this.areas$ = new DefaultSelect([], 0);
      },
    });
  }

  selectedArea(event: any) {
    console.log('Area selected::' + event);
  }

  //Obtener la etapaestado
  async getStage() {
    return await lastValueFrom(
      this.gParameterService
        .getPhaseEdo()
        .pipe(map(response => response.stagecreated))
    );
  }

  async delegationWhere() {
    return await new Promise((resolve, reject) => {
      this.parametersService
        .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(
          (res: any) => {
            resolve(res.stagecreated);
          },
          err => {
            resolve(null);
            console.log(err);
          }
        );
    });
  }

  return() {
    this.cleanActa();
    this.router.navigate(
      [
        '/pages/final-destination-process/donation-process/approval-for-donation',
      ],
      {
        queryParams: {},
      }
    );
  }

  disableCheckboxes() {
    //console.log('this.data:::' + JSON.stringify(this.data));
    var checkbox = this.e.nativeElement.querySelectorAll(
      'input[type=checkbox]'
    );
    checkbox.forEach((element, index) => {
      console.log('index::' + index);
      console.log(this.grdDetail.grid.dataSet.data.length);
      /* disable the select all checkbox */
      //if (index == 0) { this.renderer2.setAttribute(element, "disabled", "true"); }

      /* disable the checkbox if set column is false */
      //console.log(this.grdDetail.grid.dataSet.data[index]);
      if (index < this.grdDetail.grid.dataSet.data.length) {
        if (
          index > 0 &&
          (this.grdDetail.grid.dataSet.data[index - 1].val_cambio == null ||
            this.grdDetail.grid.dataSet.data[index - 1].error != '')
        ) {
          this.renderer2.setAttribute(element, 'disabled', 'true');
        }
      }
    });
  }
}

export interface IParamsDonac {
  origin: string;
}

export interface IDonationGoodError {
  goodId: number;
  des_error: string;
}
