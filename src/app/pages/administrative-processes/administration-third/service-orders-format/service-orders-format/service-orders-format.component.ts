import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ServiceOrdersFormatHistoricComponent } from '../service-orders-format-historic/service-orders-format-historic.component';
import { ServiceOrdersSelectModalComponent } from '../service-orders-select-modal/service-orders-select-modal.component';
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
  //------------------
  selectedHour: string | null = null;
  selectedMinute: string | null = null;
  selectedAMPM: string | null = null;
  //--------------------
  public process = new DefaultSelect();
  public regionalCoordination = new DefaultSelect();
  public transferenceSele: DefaultSelect<any> = new DefaultSelect();
  public stationSele: DefaultSelect<any> = new DefaultSelect();
  public station = new DefaultSelect();
  public authority = new DefaultSelect();
  public keyStore = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private activatedRoute: ActivatedRoute,
    private authorityService: AuthorityService,
    private strategyProcessService: StrategyProcessService
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
  }
  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      type: [null, Validators.required],
      process: [null, Validators.required],
      dateCapture: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      serviceOrderKey: [null, Validators.required],
      cancellationAuthorizationDate: [null, Validators.required],
      uniqueKey: [null, Validators.required],
      transference: [null, Validators.required],
      station: [null, Validators.required],
      authority: [null, Validators.required],
      keyStore: [null, Validators.required],
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
  public getProcess(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  public getRegionalCoordination(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
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
        'Primero Debe Seleccionar un Numero de Tranferente'
      );
    }
  }

  public getAuthority(event: any) {
    if (this.serviceOrdersForm.get('transference').value != null) {
      if (this.serviceOrdersForm.get('transference').value != null) {
        const paramsF = new FilterParams();
        paramsF.addFilter(
          'idTransferent',
          this.serviceOrdersForm.get('transference').value
        );

        this.authorityService.getStrategyFormat(paramsF.getParams()).subscribe({
          next: data => {
            this.stationSele = new DefaultSelect(data.data, data.count);
          },
          error: err => {
            this.stationSele = new DefaultSelect();
          },
        });
      } else {
        this.alert('error', 'Error', 'Primero Debe Seleccionar una Emisora');
      }
    } else {
      this.alert(
        'error',
        'Error',
        'Primero Debe Seleccionar un Numero de Tranferente'
      );
    }
  }
  public getKeyStore(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
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
        this.loadTranfer(
          response.data[0].transferenceNumber,
          response.data[0].stationNumber
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
          .setValue(response.data[0].authorizeDate);
        this.serviceOrdersForm
          .get('transference')
          .setValue(response.data[0].transferenceNumber);
        // this.serviceOrdersForm
        //   .get('station')
        //   .setValue(response.data[0].stationNumber);
        this.serviceOrdersForm
          .get('authority')
          .setValue(response.data[0].authorityNumber);
        this.serviceOrdersForm
          .get('keyStore')
          .setValue(response.data[0].storeNumber);
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
      },
    });
  }

  loadTranfer(transfer: number, station: number) {
    this.authorityService.getTranferId(transfer).subscribe({
      next: response => {
        this.transferenceSele = new DefaultSelect(
          response.data,
          response.count
        );
        this.serviceOrdersForm
          .get('transference')
          .setValue(response.data[0].id);
        this.loadEmisora(transfer, station);
      },
    });
  }
  loadEmisora(transference: any, emisora: any) {
    this.authorityService.getstationId(transference, emisora).subscribe({
      next: response => {
        this.stationSele = new DefaultSelect(response.data, response.count);
        this.serviceOrdersForm.get('station').setValue(response.data[0].id);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day} /${month}/${year}`;
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
          this.paramsI = this.pageFilter(this.paramsI);
          this.getGoodsByid(this.NoFormat);
        }
      });
    this.paramsI
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
}
