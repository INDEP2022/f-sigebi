import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { convertFormatDate } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { InterfacesirsaeService as InterfaceSirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONSULT_SIRSAE_COLUMNS } from './sirsae-payment-consultation-columns';

@Component({
  selector: 'app-sirsae-payment-consultation-list',
  templateUrl: './sirsae-payment-consultation-list.component.html',
  styles: [],
})
export class SirsaePaymentConsultationListComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: ModelForm<any>;

  totalItems: number = 0;
  maxDate: Date = new Date();
  columnFilters: any = [];
  dataload: boolean = false;
  consultSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: true,
    columns: CONSULT_SIRSAE_COLUMNS,
  };
  tableSource: LocalDataSource = new LocalDataSource();

  statusesMov: { id: number; statusDescription: string }[] = [];

  buttonSearch: boolean = false;

  constructor(
    private interfaceSirsaeService: InterfaceSirsaeService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(event => this.search(event));
    //this.filter();
    this.dataload = false;
    this.resetFilter();
  }

  prepareForm() {
    this.form = this.fb.group({
      reference: [null, []],
      startDate: [null, []],
      endDate: [null, []],
      bank: [null, []],
      status: [null, []],
    });
  }

  searchpre() {
    this.buttonSearch = true;
    this.search();
  }

  changeValue(event: any) {
    console.log(event);
  }

  AfterViewInit() {}

  resetFilter() {
    this.tableSource.empty().then(res => {
      this.tableSource.refresh();
    });
    this.tableSource.load([]);
    this.form.reset();
    this.totalItems = 0;
    this.dataload = false;
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

  /*validsearch() {
    if (!this.formValid()) {
      return;
    } else {
      this.search();
      this.dataload = true;
    }
  }*/

  search(listParams?: ListParams): void {
    console.log('Lista de Parametros: ', listParams);
    console.log(this.form.value);
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

    // params = params + this.params.getValue();
    this.interfaceSirsaeService.getAccountDetail(paramsEn).subscribe({
      next: res => {
        console.log(res);
        this.totalItems = res.count || 0;
        this.tableSource.load(res.data);
        this.tableSource.refresh();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.onLoadToast('warning', 'Atención', 'No se encontraron registros');
        this.totalItems = 0;
      },
    });
  }

  generateParams(listParams?: ListParams): FilterParams {
    const filters = new FilterParams();
    console.log('reference', this.form.value.reference);
    console.log('this.form.value.status;', this.form.value.status);
    console.log('Search botón', this.buttonSearch);
    //const { reference, startDate, endDate, bank, status } = this.form.value;
    const reference = this.form.value.reference;
    const startDate = this.form.value.startDate;
    const endDate = this.form.value.endDate;
    const bank = this.form.value.bank;
    const status = this.form.value.status;

    if (reference) {
      filters.addFilter('reference', reference, SearchFilter.ILIKE);
    }
    if (startDate || endDate) {
      const initDate = startDate || endDate;
      const finalDate = endDate || startDate;
      filters.addFilter(
        'movDate',
        `${convertFormatDate(initDate)},${convertFormatDate(finalDate)}`,
        SearchFilter.BTW
      );
    }
    if (bank) {
      filters.addFilter('accountbank.name_bank', bank, SearchFilter.ILIKE);
    }

    if (this.buttonSearch == true) {
      if (status == null) {
        console.log('status', status);
        filters.addFilter('statusMov', 0);
      } else {
        filters.addFilter('statusMov', status);
      }
    }

    if (listParams) {
      filters.page = listParams.page || 1;
      filters.limit = listParams.limit || 10;
    }
    console.log('Filtro: ', filters);

    return filters;
  }

  /*formValid(): boolean {
    const values = this.form.value;
    const isValid = Object.keys(values).some(key => Boolean(values[key]));
    if (!isValid) {
      this.onLoadToast('warning', 'Alerta', 'Llenar un Campo para Continuar');
    }
    return isValid;
  }*/

  filter() {
    this.tableSource
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'accountbank':
                field = `filter.accountbank.id`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'ifdsc':
                searchFilter = SearchFilter.LIKE2;
                break;
              case 'reference':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'movDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'importdep':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'keycheck':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'statusMov':
                field = `filter.statusMov.statusDescription`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'statusMovDescription':
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
          console.log('this.params: ', this.params);
          this.search();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }
}
