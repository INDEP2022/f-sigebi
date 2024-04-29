import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParameterBaseCatService } from 'src/app/core/services/catalogs/rate-catalog.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BitacoraComponent } from '../../control-service-orders/control-service-orders/bitacora/bitacora.component';
import { AddUpdateControlOrderComponent } from '../add-update-control-order/add-update-control-order.component';
import { ServiceOrdersExpedientModalComponent } from '../service-orders-expedient-modal/service-orders-expedient-modal.component';
import { ServiceOrdersSelectModalComponent } from '../service-orders-select-modal/service-orders-select-modal.component';
import { ServiceTypeProgModalComponent } from '../service-type-prog-modal/service-type-prog-modal.component';
import {
  CONTROLSERVICEORDERS_COLUMNS,
  SERVICEORDERSFORMAT_COLUMNS,
} from './service-orders-format-columns';
import { ServiceFormatService } from './services';
export interface global {
  bienes?: number;
  INDICADOR?: number;
  NO_FORMATO?: number;
  NO_DELEGACION_1?: number;
}
@Component({
  selector: 'app-service-orders-format',
  templateUrl: './service-orders-format.component.html',
  styles: [
    `
      .bg-gray {
        background-color: #eee !important;
      }
    `,
  ],
})
export class ServiceOrdersFormatComponent extends BasePage implements OnInit {
  dataLocalI: LocalDataSource = new LocalDataSource();
  dataLocalB: LocalDataSource = new LocalDataSource();
  dataI: any[] = [];
  dataB: any[] = [];
  paramsI = new BehaviorSubject<ListParams>(new ListParams());
  paramsB = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsI: number = 0;
  totalItemsB: number = 0;
  consult: boolean = true;
  settings2 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    },
    hideSubHeader: false,
  };
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  NO_ACTA: any;
  select: boolean = false;
  columnFilters: any = [];
  NoFormat: number = 0;
  selectedTransference: any;
  transferenceChange: any = null;
  stationChange: any = null;
  typePrograming: any;
  user: any;
  INDICADOR: number = 0;
  BIENES: number = 0;
  accion: string = 'Nuevo';
  incorpora: boolean = false;
  updatebool: boolean = false;
  updatebtn: boolean = false;
  idFormat: any;
  btnDeleteIncorp: boolean = false;
  delegation: any;
  //------------------
  selectedHour: string | null = null;
  selectedMinute: string | null = null;
  selectedAMPM: string | null = null;
  //--------------------
  public process = new DefaultSelect();
  public regionalCoordination = new DefaultSelect();
  public transferenceSele = new DefaultSelect();
  public stationSele = new DefaultSelect();
  public autoritySele = new DefaultSelect();
  public storeSele = new DefaultSelect();
  public station = new DefaultSelect();
  public authority = new DefaultSelect();
  public keyStore = new DefaultSelect();
  public origin: string = '';
  public numberFormat: number;
  public delegation1: number;
  public delegations = new DefaultSelect<IDelegation>();
  public processSelect = new DefaultSelect();
  public dataUser: TokenInfoModel = {} as TokenInfoModel;
  public phaseEdo: number;
  public global: global = {} as global;
  public deleteGoodsDisabled: boolean = true;
  public loading2: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private activatedRoute: ActivatedRoute,
    private authorityService: AuthorityService,
    private strategyProcessService: StrategyProcessService,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private authService: AuthService,
    private router: Router,
    private parameterBaseCatService: ParameterBaseCatService,
    private parametersService: ParametersService,
    private service: DelegationService,
    private serviceFormatService: ServiceFormatService,
    private datePipe: DatePipe
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'] ? params['origin'] : null;
        this.NO_ACTA = params['NO_ACTA'] ? Number(params['NO_ACTA']) : null;
      });
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      selectMode: 'multi',
      columns: SERVICEORDERSFORMAT_COLUMNS,
    };
    this.settings2.columns = CONTROLSERVICEORDERS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.initialForm();
    this.filterI();
    this.filterB();
    this.getTransference(new ListParams());
    this.getKeyStore(new ListParams());
    this.getuser();
  }

  private async prepareForm() {
    this.form = this.fb.group({
      id: [],
      typeStrategy: [null, Validators.required],
      processNumber: [null, Validators.required],
      captureDate: [new Date(), Validators.required],
      delegation1Number: [null, [Validators.required]],
      formatKey: [null],
      authorizeDate: [null],
      transferenceNumber: [null, [Validators.required]],
      stationNumber: [null, [Validators.required]],
      storeNumber: [null, [Validators.required]],
      authorityNumber: [null, [Validators.required]],
      folSupplier: [null],
      iniEventDate: [null, Validators.required],
      finEventDate: [null, Validators.required],
      hraEvent: [null, Validators.required],
      minEvent: [null, Validators.required],
      hriEvent: [null, Validators.required],
      status: ['PROCESO', Validators.required],
      usrElaborated: [],
      usrIapprove: [],
      recordNumber: [],
      repImplements: ['N'],
      nbOrigin: [],

      uniqueKey: [null],
      vir_delegation: [null],
      des_cordina: [null],
      type_programming: [null],
      location: [null],
      municipality: [null],
      entity: [null],
    });
    this.form2 = this.fb.group({
      totalStrategy: [''],
    });

    this.form3 = this.fb.group({
      justification: [''],
    });
  }

  async initialForm() {
    this.phaseEdo = await this.paEtapaEdo();
    // PUP_INICIALIZA_FORMA
    this.pupValUser();
    localStorage.removeItem('global');
    const global = localStorage.getItem('global');
    if (global && global !== 'undefined') {
      this.global = JSON.parse(global);
      this.numberFormat = this.global.NO_FORMATO;
      this.getStrategyById(this.numberFormat);
      this.global.bienes = 0;
      this.global.INDICADOR = 0;
    } else {
      this.global.bienes = 0;
      this.global.INDICADOR = 0;
    }
  }
  pupValUser() {
    // PUP_VAL_USUARIO
    this.dataUser = this.authService.decodeToken();
    const str = this.dataUser.preferred_username.substr(1, 3);
    if (str == 'TLP') {
      this.form.get('status').disable();
    }
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
    this.delegation = token.department.toUpperCase();
  }

  public getTransference(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    this.authorityService.getTranfer(params).subscribe(
      data => {
        let result = data.data.map(item => {
          item['idDesc'] = item.id + ' - ' + item.nameTransferent;
        });
        Promise.all(result).then(resp => {
          this.transferenceSele = new DefaultSelect(data.data, data.count);
        });
      },
      err => {
        this.transferenceSele = new DefaultSelect();
      },
      () => {}
    );
  }

  ontransferenceChange(transferente: any) {
    this.transferenceChange = transferente;
    if (transferente) {
      this.stationChange = null;
      this.form.get('stationNumber').reset();
      this.form.get('authorityNumber').reset();
      this.getStation(new ListParams());
    } else {
      this.stationChange = null;
      this.form.get('authorityNumber').reset();
      this.form.get('stationNumber').reset();
    }
  }

  public getStation(params: ListParams) {
    params['filter.idTransferent'] = `$eq:${
      this.form.get('transferenceNumber').value
    }`;
    this.authorityService.getTranferIdandEmisora(params).subscribe({
      next: data => {
        console.log(data);
        this.stationSele = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.stationSele = new DefaultSelect();
      },
    });
  }

  onStationChange(stationNumber: any) {
    this.stationChange = stationNumber;
    if (stationNumber) {
      this.form.get('authorityNumber').reset();
      this.getAuthority(new ListParams());
    } else {
      this.form.get('authorityNumber').reset();
    }
  }

  public getAuthority(event: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'idTransferer',
      this.form.get('transferenceNumber').value
    );
    paramsF.addFilter('idStation', this.form.get('stationNumber').value);
    let params = {
      delegationNumber:
        this.dataUser.department || this.form.get('delegation1Number').value,
    };
    this.authorityService
      .getAllUthorities(paramsF.getParams(), params)
      .subscribe({
        next: data => {
          this.autoritySele = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          this.autoritySele = new DefaultSelect([], 0);
        },
      });
  }

  public getKeyStore(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    let delegation =
      this.dataUser.department || this.form.get('delegation1Number').value;
    this.authorityService.getAllDataQuery(params, delegation).subscribe({
      next: data => {
        this.storeSele = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.storeSele = new DefaultSelect();
      },
    });
  }
  changeAlmacen(event: any) {
    if (event) {
      this.form.get('location').setValue(event.location);
      this.form.get('municipality').setValue(event.municipality);
      this.form.get('entity').setValue(event.otvalor);
    } else {
    }
  }
  openEstate() {
    if (!this.numberFormat) {
      this.alert(
        'warning',
        'No hay histórico para está Estrategia de Aministración',
        'Debe seleccionar un registro existente'
      );
    } else {
      let config: ModalOptions = {
        initialState: {
          formatNumber: this.numberFormat,
          callback: (next: boolean) => {},
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(BitacoraComponent, config);
    }
  }

  openSelect(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, data?: any, id?: any) => {
          if (id != null) {
            this.loadDataFormat(data);
            this.getStrategyById(id);
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceOrdersSelectModalComponent, config);
  }

  getStrategyById(numberFormat?: any) {
    this.numberFormat = numberFormat;
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.numberFormat}`;
    this.goodPosessionThirdpartyService.getAllStrategyV2(params).subscribe({
      next: response => {
        console.log(response);
        this.numberFormat = response.data[0].id;
        this.loadDataFormat(response.data[0]);
        //--------------------
        // this.loadTranfer(
        //   response.data[0].transferenceNumber,
        //   response.data[0].stationNumber,
        //   response.data[0].authorityNumber
        // );
        // this.loadcveAlmacen(
        //   response.data[0].delegation1Number,
        //   response.data[0].storeNumber
        // );
      },
      error: err => {
        this.alert('warning', 'No se encontró el registro', '');
      },
    });
  }

  async loadDataFormat(data: any) {
    this.form.reset();
    this.pupDesStrategy(data); // PU_DES_ESTRATEGIA
    this.pupValStrategy(data); // PU_VAL_ESTRATEGIA
    this.pupValUser(); // PUP_VAL_USUARIO
    this.pupTypeProgramation(data.StrategyProcess.TypeProgramming); // PUP_TIPO_PROGRAMACION
    this.form.patchValue(data);
    this.form.patchValue({
      finEventDate: data.finEventDate
        ? await this.correctDate(data.finEventDate)
        : null,
      iniEventDate: data.iniEventDate
        ? await this.correctDate(data.iniEventDate)
        : null,
      captureDate: data.captureDate
        ? await this.correctDate(data.captureDate)
        : null,
      authorizeDate: data.authorizeDate
        ? await this.correctDate(data.authorizeDate)
        : null,
    });
    this.form.get('location').setValue(data.catWarehouses.location);
    this.form.get('municipality').setValue(data.catWarehouses.codeMunicipality);
    this.form.get('entity').setValue(data.catWarehouses.codeCity);
    this.strategyImports(data.id);
    this.getGoodsByid(data.id);
  }

  async pupValStrategy(data: any) {
    // PU_VAL_ESTRATEGIA
    const params = new ListParams();
    params['filter.processNumber'] = `$eq:${data.processNumber}`;
    const process = await this.serviceFormatService.getProcess(params);
    if (['AUTORIZADA', 'CANCELADA'].includes(data.status)) {
      this.deleteGoodsDisabled = true;
      this.valDisabledAll = true;
      this.form.disable();
    } else {
      if (process?.relayEstate == 'S') {
        this.deleteGoodsDisabled = true;
      }
      this.valDisabledAll = false;
      this.form.enable();
    }
  }
  pupDesStrategy(data: any) {
    // PU_DES_ESTRATEGIA
    this.loadTranfer(
      data.transferenceNumber,
      data.stationNumber,
      data.authorityNumber
    );
  }
  pupTypeProgramation(type: any) {
    // PUP_TIPO_PROGRAMACION
    if (type) this.form.get('type_programming').setValue(type);
  }
  loadTranfer(transfer: number, stationNumber: number, autority: any) {
    this.authorityService.getTranferId(transfer).subscribe({
      next: response => {
        this.transferenceSele = new DefaultSelect(
          response.data,
          response.count
        );
        this.form.get('transferenceNumber').setValue(response.data[0].id);
        this.loadEmisora(transfer, stationNumber, autority);
      },
    });
  }

  loadEmisora(transferenceNumber: any, emisora: any, autority: any) {
    this.authorityService.getstationId(transferenceNumber, emisora).subscribe({
      next: response => {
        this.stationSele = new DefaultSelect(response.data, response.count);
        this.form.get('stationNumber').setValue(response.data[0].id);
        this.loadAutority(transferenceNumber, emisora, autority);
      },
    });
  }

  loadAutority(transferenceNumber: any, emisora: any, autority: any) {
    let params = {
      delegationNumber: this.form.get('delegation1Number').value,
    };
    this.authorityService
      .getAuthorities(params, autority, transferenceNumber, emisora)
      .subscribe({
        next: response => {
          this.autoritySele = new DefaultSelect(response.data, response.count);
          this.form
            .get('authorityNumber')
            .setValue(response.data[0].idAuthority);
        },
        error: err => {
          this.form.get('authorityNumber').setValue(autority);
        },
      });
  }

  loadcveAlmacen(delegation: number, warehouse: any) {
    this.authorityService.getDataQuery(delegation, warehouse).subscribe({
      next: response => {
        this.storeSele = new DefaultSelect(response.data, response.count);
        this.form.get('storeNumber').setValue(response.data[0].noStore);
      },
      error: err => {
        this.form.get('storeNumber').setValue(warehouse);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  strategyImports(id: any) {
    let params = {
      ...this.paramsI.getValue(),
      ...this.columnFilters,
    };
    this.loading2 = true;
    this.goodPosessionThirdpartyService
      .getAllStrategyImportsById(id, params)
      .subscribe({
        next: response => {
          console.log(response);
          let totalStrategy = 0;
          if (response.data) {
            let result = response.data.map(item => {
              item['amount'] =
                Number(item.totAmount) * Number(item.totQuantity);
              totalStrategy = totalStrategy + item['amount'];
            });
            Promise.all(result).then(resp => {
              this.form2.get('totalStrategy').setValue(totalStrategy);
              this.dataLocalI.load(response.data);
              this.dataLocalI.refresh();
              this.totalItemsI = response.count;
              this.loading2 = false;
            });
          } else {
            this.form2.get('totalStrategy').setValue(totalStrategy);
            this.dataLocalI.load([]);
            this.dataLocalI.refresh();
            this.totalItemsI = 0;
            this.loading2 = false;
          }
        },
        error: err => {
          this.dataLocalI.load([]);
          this.dataLocalI.refresh();
          this.totalItemsI = 0;
          this.loading2 = false;
          this.form.get('totalStrategy').setValue(0);
        },
      });
  }

  filterI() {
    this.dataLocalI
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'service':
                if (!isNaN(parseFloat(filter.search))) {
                  field = 'filter.serviceNumber';
                  searchFilter = SearchFilter.EQ;
                } else if (typeof filter.search === 'string') {
                  field = 'filter.Service.description';
                  searchFilter = SearchFilter.ILIKE;
                }
                break;
              case 'typeServiceNumber':
                if (!isNaN(parseFloat(filter.search))) {
                  field = 'filter.typeServiceNumber';
                  searchFilter = SearchFilter.EQ;
                } else if (typeof filter.search === 'string') {
                  field = 'filter.Typeservice.description';
                  searchFilter = SearchFilter.ILIKE;
                }
                break;
              case 'turnNumber':
                if (!isNaN(parseFloat(filter.search))) {
                  field = 'filter.turnNumber';
                  searchFilter = SearchFilter.EQ;
                } else if (typeof filter.search === 'string') {
                  field = 'filter.Turno.description';
                  searchFilter = SearchFilter.ILIKE;
                }
                break;
              case 'varCostNumber':
                if (!isNaN(parseFloat(filter.search))) {
                  field = 'filter.varCostNumber';
                  searchFilter = SearchFilter.EQ;
                } else if (typeof filter.search === 'string') {
                  field = 'filter.VariableCosto.description';
                  searchFilter = SearchFilter.ILIKE;
                }
                break;
              case 'observation':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'totAmount':
                searchFilter = SearchFilter.EQ;
                break;
              case 'totQuantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'amount':
                searchFilter = SearchFilter.EQ;
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
          this.paramsI = this.pageFilter(this.paramsI);
          this.strategyImports(this.numberFormat);
        }
      });
    this.paramsI
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.strategyImports(this.numberFormat));
  }

  getGoodsByid(id: any) {
    let params = {
      ...this.paramsB.getValue(),
      ...this.columnFilters,
    };
    this.dataB = [];
    this.dataLocalB.load(this.dataB);
    this.dataLocalB.refresh();
    this.goodPosessionThirdpartyService
      .getAllStrategyGoodsById(id, params)
      .subscribe({
        next: response => {
          this.btnDeleteIncorp = true;
          for (let i = 0; i < response.data.length; i++) {
            let params = {
              noGoods: response.data[i].goodNumber.id,
              description: response.data[i].goodNumber.description,
              quantity: response.data[i].goodNumber.quantity,
            };
            this.dataB.push(params);
            this.dataLocalB.load(this.dataB);
            this.dataLocalB.refresh();
            this.totalItemsB = response.count;
          }
        },
        error: err => {
          //this.btnDeleteIncorp = false;
        },
      });
  }

  filterB() {
    this.dataLocalB
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'noGoods':
                field = 'filter.goodNumber.id';
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                field = 'filter.goodNumber.description';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                field = 'filter.goodNumber.quantity';
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
          this.paramsB = this.pageFilter(this.paramsB);
          this.getGoodsByid(this.numberFormat);
        }
      });
    this.paramsB
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByid(this.numberFormat));
  }

  PuValStrategy(NoProcess: any) {
    let lv_RELBIEN = 0;
    this.strategyProcessService.ByIdProces(NoProcess).subscribe({
      next: response => {
        lv_RELBIEN = response.count;
        let status = this.form.get('status').value;
        if (status == 'AUTORIZADA' || status == 'CANCELADA') {
        }
      },
    });
  }

  PupTipoProgramacion(NoProcess: any) {
    this.strategyProcessService.ByIdProces(NoProcess).subscribe({
      next: response => {
        this.typePrograming = response.data[0].programmingType;
      },
    });
  }

  Incorpora() {
    const { processNumber, type_programming } = this.form.value;
    if (processNumber) {
      if (type_programming == 'D' || type_programming == 'R') {
        this.PuGenGood();
      }
    } else {
      this.alert('warning', 'Es necesario seleccionar un proceso', '');
    }
  }

  PuGenGood() {
    const { processNumber, type_programming } = this.form.value;
    let lv_PROCESO: any;
    let lv_TIPOPR: any;
    this.global.INDICADOR = 0;
    if (type_programming == 'R') {
      lv_PROCESO = 1;
      lv_TIPOPR = 'recepción';
      this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
    } else if (type_programming == 'D') {
      lv_PROCESO = 3;
      lv_TIPOPR = 'donaciones';
      this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
    } else {
      this.loadModalTypePrograming();
    }
  }

  loadModalTypePrograming(data?: any) {
    let lv_PROCESO: any;
    let lv_TIPOPR: any;
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, typeProg?: any) => {
          console.log('callback ', typeProg);
          if (typeProg != null) {
            if (typeProg == 2) {
              lv_PROCESO = 2;
              lv_TIPOPR = 'entrgra-comercialización';
              this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
            } else if (typeProg == 3) {
              lv_PROCESO = 3;
              lv_TIPOPR = 'entrgra-donaciones';
              this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
            } else if (typeProg == 4) {
              lv_PROCESO = 4;
              lv_TIPOPR = 'entrgra-donaciones';
              this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
            } else if (typeProg == 5) {
              lv_PROCESO = 5;
              lv_TIPOPR = 'entrgra-donaciones';
              this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceTypeProgModalComponent, config);
  }

  validationPuGenGood(lv_PROCESO: any, lv_TIPOPR: any) {
    let transferente = this.form.get('transferenceNumber').value;
    let delegation =
      this.form.get('delegation1Number').value != null
        ? this.form.get('delegation1Number')
        : null;
    let transfer =
      this.form.get('transferenceNumber').value != null
        ? this.form.get('transferenceNumber').value
        : null;
    let Emisora =
      this.form.get('stationNumber').value != null
        ? this.form.get('stationNumber').value
        : null;
    let autority =
      this.form.get('authorityNumber').value != null
        ? this.form.get('authorityNumber').value
        : null;
    if (transfer == null || transfer == '') {
      this.alert(
        'error',
        'Error',
        'Para Realizar la búsqueda de programaciones es necesario el transferente'
      );
      return;
    } else if (delegation == null) {
      this.alert(
        'error',
        'Error',
        'Para Realizar la búsqueda de programaciones es necesaria la coordinación regional'
      );
      return;
    } else if (Emisora == null || Emisora == '') {
      this.alert(
        'error',
        'Error',
        'Para Realizar la búsqueda de programaciones es necesaria la emisora'
      );
      return;
    } else if (autority == null || autority == '') {
      this.alert(
        'error',
        'Error',
        'Para Realizar la búsqueda de programaciones es necesaria una autoridad'
      );
      return;
    } else {
      if ((this.typePrograming = 'R')) {
        this.alertQuestion(
          'question',
          'Los Bienes a incorporar cuentan con una programacion Previa?',
          '¿Deseas continuar?',
          'Si'
        ).then(q => {
          if (q.isConfirmed) {
            this.BIENES = 0;
            let params = {
              process: lv_PROCESO,
              regional: delegation.value,
              tranfer: transfer,
              station: Emisora,
              autorid: autority,
            };
            console.log('strategy ', params);
            this.strategyProcessService.PaEstGoodProgTrans(params).subscribe({
              next: response => {
                console.log('strategy 1');
                this.validGoodsByUserPrograming(lv_TIPOPR);
              },
            });
          } else {
            this.BIENES = 1;
            let params = {
              pProcess: lv_PROCESO,
              pRegional: delegation,
              pTransfer: transfer,
              pStation: Emisora,
              pAuthority: autority,
              user: this.user,
            };
            //-----------------------
            this.programmingGoodReceiptService
              .paEstProgTransBie(params)
              .subscribe({
                next: response => {
                  this.validGoodsByUserPrograming(lv_TIPOPR);
                },
              });
          }
        });
      } else {
        let params = {
          process: lv_PROCESO,
          regional: delegation,
          tranfer: transfer,
          station: Emisora,
          autorid: autority,
        };
        this.strategyProcessService.PaEstGoodProgTrans(params).subscribe({
          next: response => {
            this.validGoodsByUserPrograming(lv_TIPOPR);
          },
        });
      }
    }
  }

  validGoodsByUserPrograming(lv_TIPOPR: any) {
    let lv_TOTBIE: any;
    this.programmingGoodReceiptService.getTmpGoodsByuser(this.user).subscribe({
      next: response => {
        console.log('response puGengood user: ', response);
        lv_TOTBIE = response.count;
        if (this.BIENES == 1) {
          this.LoadTMPESTGOOD();
        } else {
          this.LoadTMPESTGOOD();
        }
      },
      error: err => {
        lv_TOTBIE = 0;
        this.alert(
          'error',
          'Error',
          'No hay Bienes programados para ' +
            lv_TIPOPR +
            ' en esta Cordinación Regional en este mes'
        );
      },
    });
  }

  LoadTMPESTGOOD(data?: any) {
    console.log('this.numberFormat ', this.numberFormat);
    data = {
      noformato: this.numberFormat,
      noProcess: this.form.get('processNumber').value,
      status: this.form.get('status').value,
    };
    let BIENES = this.BIENES;
    let config: ModalOptions = {
      initialState: {
        data,
        BIENES,
        callback: (next: boolean, typeProg?: any) => {
          console.log('callback ', typeProg);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceOrdersExpedientModalComponent, config);
  }

  async deleteGoods() {
    let data = await this.dataLocalB.getAll();
    if (data.length == 0) {
      this.alert('warning', 'No tienen bienes asociados para eliminar', '');
      return;
    } else {
      let lv_CTABIEN: any;
      this.goodPosessionThirdpartyService
        .getAllStrategyGoodsByFormat(this.numberFormat)
        .subscribe({
          next: response => {
            lv_CTABIEN = response.count;
            this.alertQuestion(
              'question',
              'Seguro que desea Eliminar ' + lv_CTABIEN + ' Bien(es) ?',
              '¿Deseas continuar?',
              'Continuar'
            ).then(q => {
              if (q.isConfirmed) {
                let process = this.form.get('processNumber').value;
                let status = this.form.get('status').value;
                let params = {
                  numpro: 2,
                  format: this.numberFormat,
                  process: process,
                  report: '',
                  status: status,
                };
                this.strategyProcessService.PaEstGoodIncor(params).subscribe({
                  next: resp => {
                    this.alert('success', 'Exitoso', 'Proceso Terminado');
                    this.getStrategyById(this.numberFormat);
                  },
                });
              }
            });
          },
        });
    }
  }

  Gprogram() {
    const { processNumber, iniEventDate, finEventDate } = this.form.value;
    if (processNumber == 3) {
      if (!iniEventDate && !finEventDate) {
        this.alert('warning', 'Es necesario generar la estrategia', '');
      } else {
        this.puProgram();
      }
    } else {
      this.alert(
        'warning',
        'La programación solo se permite para Recepción y Transporte',
        ''
      );
    }
  }
  puProgram() {
    this.alertQuestion(
      'question',
      'Se abrirá la pantalla de captura de programación de eventos',
      '¿Desea continuar?'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event`,
          ],
          {
            queryParams: {
              origin: 'FESTFORMATO_0001',
              NO_FORMATO: this.numberFormat,
            },
          }
        );
      }
    });
  }

  newOrden() {
    if (this.accion == 'Nuevo') {
      this.accion = 'Guardar';
      this.consult = false;
      this.form.reset();
      this.numberFormat = null;
      this.dataLocalB.load([]);
      this.dataLocalB.refresh();
      this.dataLocalI.load([]);
      this.dataLocalI.refresh();
      this.updatebtn = false;
      this.numberFormat = null;
      this.btnDeleteIncorp = false;
    } else if (this.accion == 'Guardar') {
      this.gencve();
    }
  }

  gencve() {
    const supplierFolioValue = this.form.get('folSupplier').value;
    const lv_FOLIO = supplierFolioValue.toString().padStart(5, '0');
    let typeStrategy = this.form.get('typeStrategy').value;
    const now = new Date();
    let lv_ANIO = now.getFullYear().toString().slice(-2);
    let lv_MES = (now.getMonth() + 1).toString();
    let id = this.form.get('processNumber').value;
    this.strategyProcessService.getStrategiProcess(id).subscribe({
      next: resp => {
        this.parameterBaseCatService.getnomencla(this.delegation).subscribe({
          next: response => {
            this.armacve(
              typeStrategy,
              resp.data[0].desShort,
              response.data[0].delegation,
              lv_FOLIO,
              lv_ANIO,
              lv_MES
            );
          },
          error: err => {
            this.armacve(
              typeStrategy,
              resp.data[0].desShort,
              '0',
              lv_FOLIO,
              lv_ANIO,
              lv_MES
            );
          },
        });
      },
      error: err => {
        this.alert('error', 'Error', 'El número de proceso no es valido');
      },
    });
  }

  armacve(
    typeStrategy: any,
    desShort: any,
    delegation: any,
    lv_FOLIO: any,
    lv_ANIO: any,
    lv_MES: any
  ) {
    let cveFormat =
      typeStrategy +
      '/' +
      desShort +
      '/' +
      delegation +
      '/' +
      lv_FOLIO +
      '/' +
      lv_ANIO +
      '/' +
      lv_MES;
    this.createStrategyFormat(cveFormat);
  }

  createStrategyFormat(cveFormat: any) {
    let param = {
      formatNumber: this.numberFormat,
      reportNumber: 'Dato de tipo numérico',
      changeDate: new Date(),
      justification: 'Justificación',
      status: this.form.get('status').value,
      usrRegister: this.user,
      nbOrigin: '',
    };
    this.goodPosessionThirdpartyService.posStrategyBitacora(param).subscribe({
      next: response => {
        console.log('ok primer insert');
      },
    });
    if (!this.form.valid) {
      this.alert(
        'warning',
        'Alerta',
        'Por favor, llenar todos los campos que son obligatorios'
      );
      return;
    }
    let params = {
      processNumber: this.form.get('processNumber').value,
      status: 'PROCESO',
      captureDate: this.form.get('captureDate').value,
      delegation1Number: this.form.get('delegation1Number').value,
      formatKey: cveFormat,
      authorizeDate: this.form.get('authorizeDate').value,
      folSupplier:
        this.form.get('folSupplier').value != null
          ? Number(this.form.get('folSupplier').value)
          : null,
      transferenceNumber: this.form.get('transferenceNumber').value,
      stationNumber: this.form.get('stationNumber').value,
      authorityNumber: this.form.get('authorityNumber').value,
      storeNumber: this.form.get('storeNumber').value,
      iniEventDate: this.form.get('iniEventDate').value,
      finEventDate: this.form.get('finEventDate').value,
      hraEvent: this.form.get('hraEvent').value,
      minEvent: this.form.get('hraEvent').value,
      hriEvent: this.form.get('hriEvent').value,
      usrElaborated: this.user,
      typeStrategy: this.form.get('typeStrategy').value,
      nbOrigin: '',
    };
    console.log('params post ', params);
    this.goodPosessionThirdpartyService.PostStrategyFormat(params).subscribe({
      next: response => {
        console.log('response post ', response);
        this.alert(
          'success',
          'Exito!',
          'El registro fue creado correctamente con el id ' + response.id
        );
        this.form.reset();
        this.consult = true;
        this.getStrategyById(response.id);
      },
      error: err => {
        if (
          err.status === 500 &&
          err.error &&
          err.error.message &&
          err.error.message.includes(
            'violates foreign key constraint "efep_fk"'
          )
        ) {
          this.alert(
            'error',
            'Error',
            'El No. de Proceso ya existe, intenta uno diferente'
          );
          this.form.get('processNumber').reset();
        }
      },
    });
  }

  save() {
    const { id } = this.form.value;
    if (!id) {
      this.alertQuestion(
        'question',
        'Se guardará el registro',
        '¿Desea continuar?'
      ).then(q => {
        if (q.isConfirmed) {
          this.consult = false;
          this.updatebool = true;
        }
      });
    } else {
      this.alertQuestion(
        'question',
        'Se actualizará el registro',
        '¿Desea continuar?'
      ).then(q => {
        if (q.isConfirmed) {
          this.update();
        }
      });
    }
  }

  update() {
    const data = {
      ...this.form.value,
    };
    delete data.vir_delegation;
    delete data.des_cordina;
    delete data.type_programming;
    delete data.location;
    delete data.municipality;
    delete data.entity;

    let captureFecha = this.form.get('captureDate').value;
    let Capture =
      captureFecha != null ? this.formatDateUTC(captureFecha) : null;
    let authorizeFecha = this.form.get('authorizeDate').value;
    let Autorize =
      authorizeFecha != null ? this.formatDateUTC(authorizeFecha) : null;
    let iniEventFecha = this.form.get('iniEventDate').value;
    let IniEvent =
      iniEventFecha != null ? this.formatDateUTC(iniEventFecha) : null;

    let finEventFecha = this.form.get('finEventDate').value;
    let FinEven =
      finEventFecha != null ? this.formatDateUTC(finEventFecha) : null;
    let params = {
      processNumber: this.form.get('processNumber').value,
      status: this.form.get('status').value,
      captureDate: Capture,
      delegation1Number: this.form.get('delegation1Number').value,
      formatKey: this.form.get('formatKey').value,
      authorizeDate: Autorize,
      folSupplier: this.form.get('folSupplier').value,
      transferenceNumber: this.form.get('transferenceNumber').value,
      stationNumber: this.form.get('stationNumber').value,
      authorityNumber: this.form.get('authorityNumber').value,
      storeNumber: this.form.get('storeNumber').value,
      iniEventDate: IniEvent,
      finEventDate: FinEven,
      hraEvent: this.form.get('hraEvent').value,
      minEvent: this.form.get('hraEvent').value,
      hriEvent: this.form.get('hriEvent').value,
      usrElaborated: this.user,
      typeStrategy: this.form.get('typeStrategy').value,
      nbOrigin: '',
    };
    console.log('params post ', params);
    this.goodPosessionThirdpartyService
      .putStrategyFormat(params, Number(this.numberFormat))
      .subscribe({
        next: response => {
          console.log('Se actualizo correctamente');
          this.alert(
            'success',
            'Se actualizo correctamente',
            'El registro se actualizo correctamente'
          );
          this.consult = true;
          this.updatebtn = false;
          this.updatebool = false;
        },
        error: err => {
          console.log('error Update', err);
        },
      });
  }

  formatDateUTC(inputDate: any) {
    if (typeof inputDate === 'string') {
      if (inputDate.includes('/')) {
        const dateParts = inputDate.split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          if (
            !isNaN(parseInt(day)) &&
            !isNaN(parseInt(month)) &&
            !isNaN(parseInt(year))
          ) {
            return `${year}-${month}-${day}`;
          }
        }
      } else {
        const date = new Date(inputDate);
        if (!isNaN(date.getTime())) {
          const formattedDay = date.getUTCDate().toString().padStart(2, '0');
          const formattedMonth = (date.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0');
          const formattedYear = date.getUTCFullYear().toString();
          return `${formattedYear}-${formattedMonth}-${formattedDay}`;
        }
      }
    } else {
      const date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
        const formattedDay = date.getUTCDate().toString().padStart(2, '0');
        const formattedMonth = (date.getUTCMonth() + 1)
          .toString()
          .padStart(2, '0');
        const formattedYear = date.getUTCFullYear().toString();
        return `${formattedYear}-${formattedMonth}-${formattedDay}`;
      }
    }
    return inputDate;
  }

  getDelegations(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.id'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }

    if (this.phaseEdo) params['filter.etapaEdo'] = `$eq:${this.phaseEdo}`;

    params['sortBy'] = 'id:DESC';
    this.service.getAll(params).subscribe({
      next: data => {
        data.data.map(async (item: any) => {
          item['idDesc'] = item.id + ' - ' + item.description;
        });
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.delegations = new DefaultSelect();
      },
    });
  }

  async paEtapaEdo(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.parametersService
        .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(
          (res: any) => {
            console.log('REESS', res);
            if (!res.stagecreated) {
              resolve(2);
            } else {
              resolve(res.stagecreated);
            }
          },
          err => {
            resolve(2);
            console.log(err);
          }
        );
    });
  }

  onDelegationsChange(typeStrategy: any) {
    console.log(typeStrategy);
  }

  async getProcess(params: ListParams) {
    params['sortBy'] = 'processNumber:ASC';
    params['filter.relayStrategy'] = `$eq:S`;
    this.strategyProcessService.getAll(params).subscribe({
      next: value => {
        console.log(value);
        let result = value.data.map(item => {
          item['idDesc'] = item.processNumber + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          this.processSelect = new DefaultSelect(value.data, value.count);
        });
      },
      error: err => {
        this.processSelect = new DefaultSelect([], 0);
      },
    });
  }
  changeProcess(event: any) {
    if (event) {
      if (!event.description) {
        this.alert('warning', 'El proceso no está registrado', '');
      } else {
        // DES_CORTA
        console.log(this.form.value.formatKey, this.numberFormat);
        if (!this.numberFormat) this.pupGenKey(event.desShort); // PU_GENCLAVE
      }
    } else {
    }
  }
  async pupGenKey(desShort: string) {
    // PU_GENCLAVE
    const { typeStrategy, usrIapprove } = this.form.value;
    let year = this.datePipe.transform(new Date(), 'yyyy');
    const params = new ListParams();
    params['filter.delegation1Number'] = `$eq:${this.dataUser.department}`;
    params[
      'filter.captureDate'
    ] = `$btw:${year}-01-01T00:00:00.000Z,${year}-12-31T00:00:00.000Z`;
    let count: number = await this.serviceFormatService.countFormatService(
      params
    );
    count = count + 1;
    const params2 = new ListParams();
    params2['filter.numberDelegation2'] = `$eq:${this.dataUser.department}`;
    params2['filter.stageedo'] = `$eq:${this.phaseEdo}`;

    const delegationRNomencla = await this.serviceFormatService.getrNomencla(
      params2
    );
    console.log(delegationRNomencla);
    // const params3 = new ListParams()
    // params['filter.id'] = `$eq:${this.dataUser.department}`
    // const catDelegation = await this.serviceFormatService.getCatDelegation(params3)
    // if (!catDelegation) return this.alert('warning', 'No se encontró la Delegación', '')
    // catDelegation.description

    if (delegationRNomencla.count != 0) {
      this.form
        .get('des_cordina')
        .setValue(delegationRNomencla.data.delegation);
    } else {
      if (!delegationRNomencla)
        return this.alert(
          'warning',
          'No se encontró la nomenclatura de la Delegación',
          ''
        );
      // lv_LISTVALUES:= show_lov('LOV_CORDINA');
    }
    this.form
      .get('captureDate')
      .setValue(
        await this.correctDate(
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        )
      );
    this.form.get('delegation1Number').setValue(this.dataUser.department);
    if (!usrIapprove) {
      this.form.get('status').setValue('PROCESO');
    }
    // CONSTRUCCIÓN DE LA CLAVE
    let lvFolio: string | number = count + 1;
    lvFolio = lvFolio.toString().padStart(5, '0');
    const _year = this.datePipe.transform(new Date(), 'yy');
    const _mes = this.datePipe.transform(new Date(), 'MM');
    console.log(typeStrategy);
    const cveFormat: string = `${typeStrategy}/${desShort}/${delegationRNomencla.data.delegation}/${lvFolio}/${_year}/${_mes}`;
    this.form.get('formatKey').setValue(cveFormat);
  }
  valDisabledAll: boolean = false;
  formImport(data?: any) {
    if (this.valDisabledAll)
      return this.alert(
        'warning',
        'No se puede realizar esta acción',
        'El estatus de la Orden de Servicio es Autorizada o Cancelada'
      );
    const { id, processNumber, typeStrategy } = this.form.value;
    if (!id) {
      this.alert(
        'warning',
        'Primero debe crear o seleccionar una Estrategia de Administración',
        ''
      );
    } else {
      let config: ModalOptions = {
        initialState: {
          numberFormat: this.numberFormat,
          processNumber,
          typeStrategy,
          data,
          callback: (next: boolean) => {
            this.strategyImports(this.numberFormat);
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(AddUpdateControlOrderComponent, config);
    }
  }
  removeImport(event: any) {
    if (this.valDisabledAll)
      return this.alert(
        'warning',
        'No se puede realizar esta acción',
        'El estatus de la Orden de Servicio es Autorizada o Cancelada'
      );
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea continuar?'
    ).then(async resp => {
      if (resp.isConfirmed) {
        const data = await this.serviceFormatService.deleteStrategyImport(
          event.data
        );
        if (data)
          this.alert('success', 'Registro eliminado correctamente', ''),
            this.strategyImports(this.numberFormat);
        else
          this.alert(
            'warning',
            'No se pudo eliminar el registro',
            'verifique e intente nuevamente'
          );
      }
    });
  }

  async insertBitacora(): Promise<boolean> {
    const { justification } = this.form3.value;
    const { status } = this.form.value;
    if (!justification) {
      this.alert(
        'warning',
        'La justificación del cambio de estatus no puede ser nula',
        ''
      );
      return false;
    }
    let body = {
      formatNumber: this.numberFormat,
      changeDate: new Date(),
      justification: justification,
      status: status,
      usrRegister: this.dataUser.preferred_username,
    };
    let resp = await this.serviceFormatService.createBitacora(body);
    return resp;
  }
  async correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }
}
