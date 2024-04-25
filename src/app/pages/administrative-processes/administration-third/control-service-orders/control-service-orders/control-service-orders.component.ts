import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { convertFormatDate } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { CONTROLSERVICEORDERS_COLUMNS } from './control-service-orders-columns';

@Component({
  selector: 'app-control-service-orders',
  templateUrl: './control-service-orders.component.html',
  styles: [],
})
export class ControlServiceOrdersComponent extends BasePage implements OnInit {
  serviceOrdersForm: ModelForm<any>;

  local2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  dataload: boolean = false;
  columnFilters: any = [];
  tableSource: LocalDataSource = new LocalDataSource();
  iddelegation: any;
  maxDate: Date = new Date();
  selectedRow: any;
  delegations = new DefaultSelect<IDelegation>();
  dataUser: TokenInfoModel = {} as TokenInfoModel;
  phaseEdo: number;
  constructor(
    private fb: FormBuilder,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private router: Router,
    private strategyProcessService: StrategyProcessService,
    private service: DelegationService,
    private authService: AuthService,
    private modalService: BsModalService,
    private parametersService: ParametersService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...CONTROLSERVICEORDERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.dataUser = this.authService.decodeToken();
    this.getPhaseEdo();
    this.prepareForm();
    this.filterI();
  }
  async getPhaseEdo() {
    this.phaseEdo = await this.paEtapaEdo();
    this.getDelegations(new ListParams());
  }
  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      delegation: [null],
      process: [null],
      dateInitial: [null],
      datefinal: [null],
    });
  }

  prepareFilters() {
    const { delegation, process, dateInitial, datefinal } =
      this.serviceOrdersForm.value;
    if ([0, 11].includes(Number(this.dataUser.department))) {
      if (delegation)
        this.params.getValue()[
          'filter.delegation1Number'
        ] = `${SearchFilter.EQ}:${delegation}`;
      else delete this.params.getValue()['filter.delegation1Number'];
    } else {
      this.params.getValue()[
        'filter.delegation1Number'
      ] = `${SearchFilter.EQ}:${this.dataUser.department}`;
    }

    if (dateInitial || datefinal) {
      const initDate = dateInitial || datefinal;
      const finalDate = datefinal || dateInitial;
      this.params.getValue()['filter.captureDate'] = `${
        SearchFilter.BTW
      }:${convertFormatDate(initDate)},${convertFormatDate(finalDate)}`;
    } else {
      delete this.params.getValue()['filter.captureDate'];
    }

    if (process) {
      this.params.getValue()[
        'filter.processNumber'
      ] = `${SearchFilter.EQ}:${process}`;
    } else {
      delete this.params.getValue()['filter.processNumber'];
    }
    this.params.getValue().page = 1;
    this.search(true);
  }

  search(val?: boolean): void {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(params);
    this.loading = true;
    this.goodPosessionThirdpartyService.getAllStrategyV2(params).subscribe({
      next: response => {
        console.log(response);
        let result = response.data.map(async item => {
          // -- Descripción de el preoceso para la Estrategía(1)
          item['descriptionProcess'] = item.StrategyProcess
            ? item.processNumber + ' - ' + item.StrategyProcess.description
            : null;
          // -- Descripción de la Coordinacion Regional(2)
          item['regionalDelegation'] = item.delegationNumber
            ? item.delegation1Number + ' - ' + item.delegationNumber.description
            : null;
          // -- Total de Reportes de implementación (3)
          let resp = await this.getStrategyRepImplementation(item.id);
          item['implementationReport'] = resp;
        });
        Promise.all(result).then(resp_ => {
          this.totalItems = response.count;
          this.tableSource.load(response.data);
          this.tableSource.refresh();
          this.loading = false;
        });
      },
      error: () => {
        if (val) this.alert('warning', 'No se encontraron registros', '');
        this.tableSource.load([]);
        this.tableSource.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  getStrategyRepImplementation(id: any) {
    return new Promise((resolve, reject) => {
      this.strategyProcessService.getStrategyRepImplementation(id).subscribe({
        next(value) {
          resolve(value.count);
        },
        error(err) {
          resolve(0);
        },
      });
    });
  }
  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  filterI() {
    this.tableSource
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
              case 'formatKey':
                field = `filter.formatKey`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'captureDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'descriptionProcess':
                // if (!isNaN(parseInt(filter.search))) {
                //   field = `filter.processNumber`;
                //   searchFilter = SearchFilter.EQ;
                // } else {
                field = `filter.StrategyProcess.description`;
                searchFilter = SearchFilter.ILIKE;
                // }
                break;
              case 'regionalDelegation':
                // if (!isNaN(parseInt(filter.search))) {
                //   field = `filter.delegation1Number`;
                //   searchFilter = SearchFilter.EQ;
                // } else {
                field = `filter.delegationNumber.description`;
                searchFilter = SearchFilter.ILIKE;
                // }
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
          this.search();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
  }

  loadForm() {
    if (this.selectedRow)
      this.alertQuestion(
        'info',
        'Se abrirá la pantalla orden de servicio',
        '¿Deseas continuar?'
      ).then(res => {
        if (res.isConfirmed) {
          const data = {
            NO_FORMATO: this.selectedRow.id,
            NO_DELEGACION_1: ![0, 11].includes(Number(this.dataUser.department))
              ? this.dataUser.department
              : null,
          };
          localStorage.setItem('global', JSON.stringify(data));
          this.router.navigate(
            ['/pages/administrative-processes/service-orders-format'],
            {
              queryParams: {
                origin: 'FESTCONSULTA_0001',
              },
            }
          );
        }
      });
  }

  resetFilter() {
    delete this.params.getValue()['filter.status'];
    delete this.params.getValue()['filter.captureDate'];
    delete this.params.getValue()['filter.formatKey'];
    delete this.params.getValue()['filter.processNumber'];
    delete this.params.getValue()['filter.delegation1Number'];
    delete this.params.getValue()['filter.delegationNumber.description'];
    delete this.params.getValue()['filter.StrategyProcess.description'];

    this.serviceOrdersForm.reset();
    this.tableSource.getFilter().filters = [];
    this.tableSource.load([]);
    this.tableSource.refresh();
    this.iddelegation = null;
    this.totalItems = 0;
    this.loading = true;
    this.getDelegations(new ListParams());
    this.filterI();
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

  onDelegationsChange(type: any) {
    console.log(type);
  }

  openForm() {
    let config: ModalOptions = {
      initialState: {
        formatNumber: this.selectedRow.id,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(BitacoraComponent, config);
  }
}
