import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { ParameterBaseCatService } from 'src/app/core/services/catalogs/rate-catalog.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ServiceOrdersExpedientModalComponent } from '../service-orders-expedient-modal/service-orders-expedient-modal.component';
import { ServiceOrdersFormatHistoricComponent } from '../service-orders-format-historic/service-orders-format-historic.component';
import { ServiceOrdersSelectModalComponent } from '../service-orders-select-modal/service-orders-select-modal.component';
import { ServiceTypeProgModalComponent } from '../service-type-prog-modal/service-type-prog-modal.component';
import {
  CONTROLSERVICEORDERS_COLUMNS,
  SERVICEORDERSFORMAT_COLUMNS,
} from './service-orders-format-columns';

@Component({
  selector: 'app-service-orders-format',
  templateUrl: './service-orders-format.component.html',
  styles: [],
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
    actions: false,
    hideSubHeader: false,
  };
  serviceOrdersForm: FormGroup;
  NO_ACTA: any;
  select: boolean = false;
  columnFilters: any = [];
  NoFormat: number = 0;
  selectedTransference: any;
  transferenceChange: boolean = true;
  tranferencebool: boolean = false;
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
    private parameterBaseCatService: ParameterBaseCatService
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
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
    this.filterI();
    this.filterB();
    this.getTransference(new ListParams());
    this.getuser();
  }

  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      type: [null, Validators.required],
      process: [null, Validators.required],
      dateCapture: [null, Validators.required],
      regionalCoordination: [null, [Validators.required]],
      serviceOrderKey: [null, Validators.required],
      cancellationAuthorizationDate: [null, Validators.required],
      uniqueKey: [null, Validators.required],
      transference: [null, [Validators.required]],
      station: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      keyStore: [null, [Validators.required]],
      location: [null, Validators.required],
      municipality: [null, Validators.required],
      entity: [null, Validators.required],
      supplierFolio: [null, Validators.required],
      start: [null, Validators.required],
      finished: [null, Validators.required],
      hour: [null, Validators.required],
      minute: [null, Validators.required],
      ampm: [null, Validators.required],
      status: [null, Validators.required],
    });
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
        this.transferenceSele = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.transferenceSele = new DefaultSelect();
      },
      () => {}
    );
  }

  ontransferenceChange(type: any) {
    console.log('seleccionado  : ', type);
    this.tranferencebool = true;
    if (this.transferenceChange) {
      this.station = new DefaultSelect();
      this.getStation(new ListParams());
    }
  }

  public getStation(event: any) {
    if (this.serviceOrdersForm.get('transference').value != null) {
      const paramsF = new FilterParams();
      paramsF.addFilter(
        'idTransferent',
        this.serviceOrdersForm.get('transference').value
      );

      this.authorityService
        .getTranferIdandEmisora(paramsF.getParams())
        .subscribe({
          next: data => {
            this.stationSele = new DefaultSelect(data.data, data.count);
          },
          error: err => {
            this.stationSele = new DefaultSelect();
          },
        });
    } else {
      this.alert(
        'error',
        'Error',
        'Primero debe seleccionar un No. de Tranferente'
      );
    }
  }

  public getAuthority(event: any) {
    if (this.serviceOrdersForm.get('transference').value != null) {
      if (this.serviceOrdersForm.get('transference').value != null) {
        const paramsF = new FilterParams();
        paramsF.addFilter(
          'idTransferer',
          this.serviceOrdersForm.get('transference').value
        );
        paramsF.addFilter(
          'idStation',
          this.serviceOrdersForm.get('station').value
        );
        let params = {
          delegationNumber: this.serviceOrdersForm.get('regionalCoordination')
            .value,
        };
        this.authorityService
          .getAllUthorities(paramsF.getParams(), params)
          .subscribe({
            next: data => {
              this.autoritySele = new DefaultSelect(data.data, data.count);
            },
            error: err => {
              this.autoritySele = new DefaultSelect();
            },
          });
      } else {
        this.alert('error', 'Error', 'Primero debe seleccionar una Emisora');
      }
    } else {
      this.alert(
        'error',
        'Error',
        'Primero debe seleccionar un No. de Tranferente'
      );
    }
  }

  public getKeyStore(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    let delegation = this.serviceOrdersForm.get('regionalCoordination').value;
    this.authorityService.getAllDataQuery(params, delegation).subscribe({
      next: data => {
        this.storeSele = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.storeSele = new DefaultSelect();
      },
    });
  }

  openEstate(data: any) {
    let config: ModalOptions = {
      initialState: {
        Noformat: this.NoFormat,
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceOrdersFormatHistoricComponent, config);
  }

  openSelect(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, formatKey?: any, id?: any) => {
          console.log('callback ', id, ' ', formatKey);

          if (id != null) {
            console.log('si hay id');
            this.prepareForm();
            this.getStrategyById(formatKey, id);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServiceOrdersSelectModalComponent, config);
  }

  getStrategyById(formatKey?: any, id?: any) {
    this.idFormat = id;
    this.goodPosessionThirdpartyService.getAllStrategyFormatById(id).subscribe({
      next: response => {
        this.NoFormat = response.data[0].id;
        this.StrategyImports(response.data[0].id);
        this.getGoodsByid(response.data[0].id);
        let formattedfecCapture: any;
        const Capture =
          response.data[0].captureDate != null
            ? new Date(response.data[0].captureDate)
            : null;
        if (Capture == null) {
          formattedfecCapture = null;
        } else {
          formattedfecCapture = this.formatDate(
            new Date(Capture.getTime() + Capture.getTimezoneOffset() * 60000)
          );
        }
        //---------------------
        const Ini =
          response.data[0].iniEventDate != null
            ? new Date(response.data[0].iniEventDate)
            : null;
        const formattedfecIni = Ini != null ? this.formatDate(Ini) : null;
        //------------------------
        const Fin =
          response.data[0].finEventDate != null
            ? new Date(response.data[0].finEventDate)
            : null;
        const formattedfecFin = Fin != null ? this.formatDate(Fin) : null;
        //---------------------
        const autorization =
          response.data[0].authorizeDate != null
            ? new Date(response.data[0].authorizeDate)
            : null;
        const formattedfecautorization =
          autorization != null ? this.formatDate(autorization) : null;
        response.data[0].authorizeDate;
        //--------------------
        this.loadTranfer(
          response.data[0].transferenceNumber,
          response.data[0].stationNumber,
          response.data[0].authorityNumber
        );
        this.loadcveAlmacen(
          response.data[0].delegation1Number,
          response.data[0].storeNumber
        );
        console.log('respuesta id ', response);
        this.serviceOrdersForm
          .get('type')
          .setValue(response.data[0].typeStrategy);
        this.serviceOrdersForm
          .get('process')
          .setValue(response.data[0].processNumber);
        this.serviceOrdersForm.get('dateCapture').setValue(formattedfecCapture);
        this.serviceOrdersForm
          .get('regionalCoordination')
          .setValue(response.data[0].delegation1Number);
        this.serviceOrdersForm
          .get('serviceOrderKey')
          .setValue(response.data[0].formatKey);
        this.serviceOrdersForm
          .get('cancellationAuthorizationDate')
          .setValue(formattedfecautorization);
        this.serviceOrdersForm
          .get('transference')
          .setValue(response.data[0].transferenceNumber);
        // this.serviceOrdersForm
        //   .get('station')
        //   .setValue(response.data[0].stationNumber);
        // this.serviceOrdersForm
        //   .get('authority')
        //   .setValue(response.data[0].authorityNumber);
        // this.serviceOrdersForm
        //   .get('keyStore')
        //   .setValue(response.data[0].storeNumber);
        this.serviceOrdersForm
          .get('location')
          .setValue(response.data[0].catWarehouses.location);
        this.serviceOrdersForm
          .get('municipality')
          .setValue(response.data[0].catWarehouses.codeMunicipality);
        this.serviceOrdersForm
          .get('entity')
          .setValue(response.data[0].catWarehouses.codeCity);
        this.serviceOrdersForm
          .get('supplierFolio')
          .setValue(response.data[0].folSupplier);
        this.serviceOrdersForm.get('start').setValue(formattedfecIni);
        this.serviceOrdersForm.get('finished').setValue(formattedfecFin);
        this.serviceOrdersForm.get('hour').setValue(response.data[0].hraEvent);
        this.serviceOrdersForm
          .get('minute')
          .setValue(response.data[0].minEvent);
        this.serviceOrdersForm.get('ampm').setValue(response.data[0].hriEvent);
        this.serviceOrdersForm.get('status').setValue(response.data[0].status);
        this.select = true;
        this.updatebtn = true;
      },
    });
  }

  loadTranfer(transfer: number, station: number, autority: any) {
    this.authorityService.getTranferId(transfer).subscribe({
      next: response => {
        this.transferenceSele = new DefaultSelect(
          response.data,
          response.count
        );
        this.serviceOrdersForm
          .get('transference')
          .setValue(response.data[0].id);
        this.loadEmisora(transfer, station, autority);
      },
    });
  }

  loadEmisora(transference: any, emisora: any, autority: any) {
    this.authorityService.getstationId(transference, emisora).subscribe({
      next: response => {
        this.stationSele = new DefaultSelect(response.data, response.count);
        this.serviceOrdersForm.get('station').setValue(response.data[0].id);
        this.loadAutority(transference, emisora, autority);
      },
    });
  }

  loadAutority(transference: any, emisora: any, autority: any) {
    let params = {
      delegationNumber: this.serviceOrdersForm.get('regionalCoordination')
        .value,
    };
    this.authorityService
      .getAuthorities(params, autority, transference, emisora)
      .subscribe({
        next: response => {
          this.autoritySele = new DefaultSelect(response.data, response.count);
          this.serviceOrdersForm
            .get('authority')
            .setValue(response.data[0].idAuthority);
        },
        error: err => {
          this.serviceOrdersForm.get('authority').setValue(autority);
        },
      });
  }

  loadcveAlmacen(delegation: number, warehouse: any) {
    this.authorityService.getDataQuery(delegation, warehouse).subscribe({
      next: response => {
        this.storeSele = new DefaultSelect(response.data, response.count);
        this.serviceOrdersForm
          .get('keyStore')
          .setValue(response.data[0].noStore);
      },
      error: err => {
        this.serviceOrdersForm.get('keyStore').setValue(warehouse);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  StrategyImports(id: any) {
    let params = {
      ...this.paramsI.getValue(),
      ...this.columnFilters,
    };
    this.dataI = [];
    this.dataLocalI.load(this.dataI);
    this.goodPosessionThirdpartyService
      .getAllStrategyImportsById(id, params)
      .subscribe({
        next: response => {
          console.log(' respuesta Tabla 2 ', response);
          for (let i = 0; i < response.data.length; i++) {
            let params = {
              service:
                response.data[i].Service.id +
                ' - ' +
                response.data[i].Service.description,
              typeServiceNumber:
                response.data[i].Typeservice.id +
                ' - ' +
                response.data[i].Typeservice.description,
              turnNumber:
                response.data[i].Turno.shiftNumber +
                ' - ' +
                response.data[i].Turno.description,
              varCostNumber:
                response.data[i].VariableCosto.varcostoNumber +
                ' - ' +
                response.data[i].VariableCosto.description,
              observation: response.data[i].observation,
              totAmount: response.data[i].totAmount,
              totQuantity: response.data[i].totQuantity,
              amount: response.data[i].totAmount,
              noProcess: response.data[i].processNumber,
              idCost: response.data[i].costId,
              noFormat: response.data[i].formatNumberId,
            };
            this.dataI.push(params);
            this.dataLocalI.load(this.dataI);
            this.dataLocalI.refresh();
            this.totalItemsI = response.count;
          }
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
          this.StrategyImports(this.NoFormat);
        }
      });
    this.paramsI
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.StrategyImports(this.NoFormat));
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
          this.getGoodsByid(this.NoFormat);
        }
      });
    this.paramsB
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByid(this.NoFormat));
  }

  PuValStrategy(NoProcess: any) {
    let lv_RELBIEN = 0;
    this.strategyProcessService.ByIdProces(NoProcess).subscribe({
      next: response => {
        lv_RELBIEN = response.count;
        let status = this.serviceOrdersForm.get('status').value;
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
    if (this.dataB.length > 0) {
      let proceso = this.serviceOrdersForm.get('process').value;
      this.strategyProcessService.ByIdProces(proceso).subscribe({
        next: response => {
          console.log('Respuesta by format ', response);
          this.typePrograming = response.data[0].programmingType;
          if (this.typePrograming == 'D' || this.typePrograming == 'R') {
            this.PuGenGood();
          }
        },
      });
    } else {
      this.alert('error', 'Error', 'No tiene bienes asociados para incorporar');
      return;
    }
  }

  PuGenGood() {
    let lv_PROCESO: any;
    let lv_TIPOPR: any;
    if (this.INDICADOR == 0) {
      if (this.typePrograming == 'R') {
        lv_PROCESO = 1;
        lv_TIPOPR = 'recepción';
        this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
      } else if (this.typePrograming == 'D') {
        lv_PROCESO = 3;
        lv_TIPOPR = 'donaciones';
        this.validationPuGenGood(lv_PROCESO, lv_TIPOPR);
      } else {
        this.loadModalTypePrograming();
      }
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
    let transferente = this.serviceOrdersForm.get('transference').value;
    let delegation =
      this.serviceOrdersForm.get('regionalCoordination').value != null
        ? this.serviceOrdersForm.get('regionalCoordination')
        : null;
    let transfer =
      this.serviceOrdersForm.get('transference').value != null
        ? this.serviceOrdersForm.get('transference').value
        : null;
    let Emisora =
      this.serviceOrdersForm.get('station').value != null
        ? this.serviceOrdersForm.get('station').value
        : null;
    let autority =
      this.serviceOrdersForm.get('authority').value != null
        ? this.serviceOrdersForm.get('authority').value
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

  Delete() {
    if (this.dataB.length > 0) {
      let lv_CTABIEN: any;
      this.goodPosessionThirdpartyService
        .getAllStrategyGoodsByFormat(this.NoFormat)
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
                let process = this.serviceOrdersForm.get('process').value;
                let status = this.serviceOrdersForm.get('status').value;
                let params = {
                  numpro: 2,
                  format: this.NoFormat,
                  process: process,
                  report: '',
                  status: status,
                };
                this.strategyProcessService.PaEstGoodIncor(params).subscribe({
                  next: resp => {
                    this.alert('success', 'Exitoso', 'Proceso Terminado');
                  },
                });
              }
            });
          },
        });
    } else {
      this.alert('error', 'Error', 'No tiene bienes asociados para incorporar');
      return;
    }
  }

  Gprogram() {
    let process = this.serviceOrdersForm.get('process').value;
    let dateIni = this.serviceOrdersForm.get('start').value;
    let dateFin = this.serviceOrdersForm.get('finished').value;
    if (process == 3) {
      if (dateIni == null && dateFin == null) {
        this.alert('error', 'Error', 'Es necesario generar la estrategia');
      } else {
        this.puProgram();
      }
    } else {
      this.alert(
        'error',
        'Error',
        'La programación solo se permite para Recepción y Transporte'
      );
    }
  }
  puProgram() {
    let PL_ID: any;
    let PL_NAME: 'FESTFORMATO_0001';
    this.alertQuestion(
      'info',
      'Se abrirá la pantalla de captura de programación de eventos. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event`,
          ],
          {
            queryParams: {
              origin: PL_NAME,
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
      this.serviceOrdersForm.reset();
      this.NoFormat = null;
      this.dataB = [];
      this.dataLocalB.load(this.dataB);
      this.dataI = [];
      this.dataLocalI.load(this.dataI);
      this.updatebtn = false;
      this.idFormat = null;
      this.btnDeleteIncorp = false;
    } else if (this.accion == 'Guardar') {
      this.gencve();
    }
  }

  gencve() {
    const supplierFolioValue =
      this.serviceOrdersForm.get('supplierFolio').value;
    const lv_FOLIO = supplierFolioValue.toString().padStart(5, '0');
    let type = this.serviceOrdersForm.get('type').value;
    const now = new Date();
    let lv_ANIO = now.getFullYear().toString().slice(-2);
    let lv_MES = (now.getMonth() + 1).toString();
    let id = this.serviceOrdersForm.get('process').value;
    this.strategyProcessService.getStrategiProcess(id).subscribe({
      next: resp => {
        this.parameterBaseCatService.getnomencla(this.delegation).subscribe({
          next: response => {
            this.armacve(
              type,
              resp.data[0].desShort,
              response.data[0].delegation,
              lv_FOLIO,
              lv_ANIO,
              lv_MES
            );
          },
          error: err => {
            this.armacve(
              type,
              resp.data[0].desShort,
              '0',
              lv_FOLIO,
              lv_ANIO,
              lv_MES
            );
          },
        });
      },
    });
  }

  armacve(
    type: any,
    desShort: any,
    delegation: any,
    lv_FOLIO: any,
    lv_ANIO: any,
    lv_MES: any
  ) {
    let cveFormat =
      type +
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
      formatNumber: this.idFormat,
      reportNumber: 'Dato de tipo numérico',
      changeDate: new Date(),
      justification: 'Justificación',
      status: this.serviceOrdersForm.get('status').value,
      usrRegister: this.user,
      nbOrigin: '',
    };
    this.goodPosessionThirdpartyService.posStrategyBitacora(param).subscribe({
      next: response => {
        console.log('ok primer insert');
      },
    });
    if (!this.serviceOrdersForm.valid) {
      this.alert(
        'warning',
        'Alerta',
        'Por favor, llenar todos los campos que son obligatorios'
      );
      return;
    }
    let params = {
      processNumber: this.serviceOrdersForm.get('process').value,
      status: 'PROCESO',
      captureDate: this.serviceOrdersForm.get('dateCapture').value,
      delegation1Number: this.serviceOrdersForm.get('regionalCoordination')
        .value,
      formatKey: cveFormat,
      authorizeDate: this.serviceOrdersForm.get('cancellationAuthorizationDate')
        .value,
      folSupplier:
        this.serviceOrdersForm.get('supplierFolio').value != null
          ? Number(this.serviceOrdersForm.get('supplierFolio').value)
          : null,
      transferenceNumber: this.serviceOrdersForm.get('transference').value,
      stationNumber: this.serviceOrdersForm.get('station').value,
      authorityNumber: this.serviceOrdersForm.get('authority').value,
      storeNumber: this.serviceOrdersForm.get('keyStore').value,
      iniEventDate: this.serviceOrdersForm.get('start').value,
      finEventDate: this.serviceOrdersForm.get('finished').value,
      hraEvent: this.serviceOrdersForm.get('hour').value,
      minEvent: this.serviceOrdersForm.get('minute').value,
      hriEvent: this.serviceOrdersForm.get('ampm').value,
      usrElaborated: this.user,
      typeStrategy: this.serviceOrdersForm.get('type').value,
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
        this.serviceOrdersForm.reset();
        this.consult = true;
        this.getStrategyById(true, response.id);
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
          this.serviceOrdersForm.get('process').reset();
        }
      },
    });
  }

  updatevalid() {
    if (this.updatebool == false) {
      this.alertQuestion(
        'question',
        'Esta seguro que quiere actualizar este Registro?',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.consult = false;
          this.updatebool = true;
        }
      });
    } else {
      console.log('entra al ese');
      this.update();
    }
  }

  update() {
    console.log(
      'dateCapture ',
      this.serviceOrdersForm.get('dateCapture').value
    );
    console.log(
      'cancellationAuthorizationDate ',
      this.serviceOrdersForm.get('cancellationAuthorizationDate').value
    );
    console.log('start ', this.serviceOrdersForm.get('start').value);
    console.log('finished ', this.serviceOrdersForm.get('finished').value);
    let captureFecha = this.serviceOrdersForm.get('dateCapture').value;
    let Capture =
      captureFecha != null ? this.formatDateUTC(captureFecha) : null;
    let authorizeFecha = this.serviceOrdersForm.get(
      'cancellationAuthorizationDate'
    ).value;
    let Autorize =
      authorizeFecha != null ? this.formatDateUTC(authorizeFecha) : null;
    let iniEventFecha = this.serviceOrdersForm.get('start').value;
    let IniEvent =
      iniEventFecha != null ? this.formatDateUTC(iniEventFecha) : null;

    let finEventFecha = this.serviceOrdersForm.get('finished').value;
    let FinEven =
      finEventFecha != null ? this.formatDateUTC(finEventFecha) : null;
    let params = {
      processNumber: this.serviceOrdersForm.get('process').value,
      status: this.serviceOrdersForm.get('status').value,
      captureDate: Capture,
      delegation1Number: this.serviceOrdersForm.get('regionalCoordination')
        .value,
      formatKey: this.serviceOrdersForm.get('serviceOrderKey').value,
      authorizeDate: Autorize,
      folSupplier: this.serviceOrdersForm.get('supplierFolio').value,
      transferenceNumber: this.serviceOrdersForm.get('transference').value,
      stationNumber: this.serviceOrdersForm.get('station').value,
      authorityNumber: this.serviceOrdersForm.get('authority').value,
      storeNumber: this.serviceOrdersForm.get('keyStore').value,
      iniEventDate: IniEvent,
      finEventDate: FinEven,
      hraEvent: this.serviceOrdersForm.get('hour').value,
      minEvent: this.serviceOrdersForm.get('minute').value,
      hriEvent: this.serviceOrdersForm.get('ampm').value,
      usrElaborated: this.user,
      typeStrategy: this.serviceOrdersForm.get('type').value,
      nbOrigin: '',
    };
    console.log('params post ', params);
    this.goodPosessionThirdpartyService
      .putStrategyFormat(params, Number(this.idFormat))
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
}
