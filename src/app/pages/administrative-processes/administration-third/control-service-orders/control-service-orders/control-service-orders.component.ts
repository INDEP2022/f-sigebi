import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { convertFormatDate } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONTROLSERVICEORDERS_COLUMNS } from './control-service-orders-columns';

@Component({
  selector: 'app-control-service-orders',
  templateUrl: './control-service-orders.component.html',
  styles: [],
})
export class ControlServiceOrdersComponent extends BasePage implements OnInit {
  serviceOrdersForm: ModelForm<any>;
  dataT: any[] = [];
  local2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  dataload: boolean = false;
  columnFilters: any = [];
  tableSource: LocalDataSource = new LocalDataSource();
  iddelegation: any;
  maxDate: Date = new Date();
  selectedRow: any;

  constructor(
    private fb: FormBuilder,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private router: Router,
    private strategyProcessService: StrategyProcessService
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
    this.prepareForm();
    this.filterI();
  }

  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      delegation: [null],
      process: [null],
      dateInitial: [null],
      datefinal: [null],
    });
  }

  validsearch() {
    if (!this.formValid()) {
      return;
    } else {
      this.search();
      this.dataload = true;
    }
  }

  formValid(): boolean {
    const values = this.serviceOrdersForm.value;
    const isValid = Object.keys(values).some(key => Boolean(values[key]));
    if (!isValid) {
      this.onLoadToast('warning', 'Alerta', 'Llenar un Campo para Continuar');
    }
    return isValid;
  }

  clearTable(): void {
    if (this.tableSource.count() > 0) {
      this.tableSource.empty().then(() => {
        this.tableSource.load([]);
        this.tableSource.refresh();
        this.totalItems = 0;
        this.dataload = false;
      });
      this.totalItems = 0;
    }
  }

  generateParams(listParams?: ListParams): FilterParams {
    const filters = new FilterParams();
    const { delegation, dateInitial, datefinal, process } =
      this.serviceOrdersForm.value;

    if (this.iddelegation) {
      filters.addFilter(
        'delegation1Number',
        this.iddelegation,
        SearchFilter.EQ
      );
    }
    if (dateInitial || datefinal) {
      const initDate = dateInitial || datefinal;
      const finalDate = datefinal || dateInitial;
      filters.addFilter(
        'captureDate',
        `${convertFormatDate(initDate)},${convertFormatDate(finalDate)}`,
        SearchFilter.BTW
      );
    }
    if (process) {
      if (!isNaN(parseFloat(process))) {
        filters.addFilter('processNumber', process, SearchFilter.EQ);
      } else if (typeof process === 'string') {
        filters.addFilter(
          'StrategyProcess.description',
          process,
          SearchFilter.LIKE
        );
      }
    }

    if (listParams) {
      filters.page = listParams.page || 1;
      filters.limit = listParams.limit || 10;
    }
    console.log('Filtro: ', filters);

    return filters;
  }

  seleccionarDelegation(event: IDelegation) {
    console.log('event ', event);
    this.iddelegation = event.id;
    console.log('delegation ', event, 'this.iddelegation ', this.iddelegation);
  }

  search(listParams?: ListParams): void {
    this.dataT = [];
    this.tableSource.load(this.dataT);
    console.log('Lista de Parametros: ', listParams);
    console.log(this.serviceOrdersForm.value);
    console.log('Columnas: ', this.columnFilters);
    this.tableSource.load([]);
    this.clearTable();
    this.loading = true;
    let params = this.generateParams(listParams).getParams();
    let paramsObject = Object.fromEntries(new URLSearchParams(params));
    let paramsEn = {
      ...paramsObject,
      ...this.columnFilters,
    };

    console.log('param1 ', params);
    console.log('param2 ', paramsEn);

    console.log('12');
    this.goodPosessionThirdpartyService.getAllStrategyV2(paramsEn).subscribe({
      next: response => {
        this.dataT = [];
        this.tableSource.load(this.dataT);
        console.log('11');
        for (let i = 0; i < response.data.length; i++) {
          this.strategyProcessService
            .getStrategyRepImplementation(response.data[i].id)
            .subscribe({
              next: resp => {
                let paramsData = {
                  noFormat: response.data[i].id,
                  serviceOrder: response.data[i].formatKey,
                  captureDate: response.data[i].captureDate,
                  status: response.data[i].status,
                  noProcess: response.data[i].processNumber,
                  process: response.data[i].StrategyProcess.description,
                  noRegionalDelegation: response.data[i].delegation1Number,
                  regionalDelegation:
                    response.data[i].delegationNumber.description,
                  implementationReport: resp.count,
                };
                this.dataT.push(paramsData);
                this.totalItems = response.count;
                this.tableSource.load(this.dataT);
              },
              error: err => {
                let paramsData = {
                  noFormat: response.data[i].id,
                  serviceOrder: response.data[i].formatKey,
                  captureDate: response.data[i].captureDate,
                  status: response.data[i].status,
                  noProcess: response.data[i].processNumber,
                  process: response.data[i].StrategyProcess.description,
                  noRegionalDelegation: response.data[i].delegation1Number,
                  regionalDelegation:
                    response.data[i].delegationNumber.description,
                  implementationReport: '0',
                };
                this.dataT.push(paramsData);
                this.totalItems = response.count;
                this.tableSource.load(this.dataT);
              },
            });
        }
        console.log('data1 ', this.dataT);
        this.loading = false;
        console.log('Fin');
      },
      error: () => {
        console.log('Error');
        this.loading = false;
        this.onLoadToast('error', 'Error', 'No se Encontraron Registros');
        this.totalItems = 0;
      },
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
              case 'serviceOrder':
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
              case 'noProcess':
                field = `filter.processNumber`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'process':
                field = `filter.StrategyProcess.description`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noRegionalDelegation':
                field = `filter.delegation1Number`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'regionalDelegation':
                field = `filter.delegationNumber.description`;
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
          this.search();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
  }

  loadForm() {
    this.alertQuestion(
      'info',
      'Se Abrirá la pantalla Orden de Servicio. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
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
    this.tableSource.empty().then(res => {
      this.tableSource.refresh();
    });
    this.iddelegation = null;
    this.tableSource.load([]);
    this.serviceOrdersForm.reset();
    this.totalItems = 0;
    this.dataload = false;
    this.filterI();
  }
}
