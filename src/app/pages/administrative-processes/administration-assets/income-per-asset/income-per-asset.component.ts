import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ConceptMovisBankService } from 'src/app/core/services/catalogs/concept-movis-bank.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-income-per-asset',
  templateUrl: './income-per-asset.component.html',
  styles: [],
})
export class IncomePerAssetComponent
  extends BasePage
  implements OnInit, OnChanges
{
  assetList: any[] = [];
  depositList: any[] = [];
  assetSettings = { ...this.settings };
  depositSettings = { ...this.settings };
  assetParams = new BehaviorSubject<ListParams>(new ListParams());
  depositParams = new BehaviorSubject<ListParams>(new ListParams());
  assetTotalItems: number = 0;
  depositTotalItems: number = 0;
  @Input() goodId: number;
  assetLoading: boolean = this.loading;
  depositLoading: boolean = this.loading;
  dataDeposit: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  dataAsset: LocalDataSource = new LocalDataSource();
  columnFiltersAsset: any = [];

  constructor(
    private readonly accountmvmntServices: AccountMovementService,
    private readonly conceptMovisBankService: ConceptMovisBankService
  ) {
    super();
    this.assetSettings.actions = false;
    this.assetSettings.hideSubHeader = false;
    this.assetSettings.columns = {
      cve_banco: {
        title: 'Banco',
        type: 'number',
        sort: false,
      },
      cve_cuenta: {
        title: 'Cuenta',
        type: 'string',
        sort: false,
      },
      fec_movimiento: {
        title: 'Fecha Depósito',
        sort: false,
        type: 'html',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
        filterFunction(cell?: any, search?: string): boolean {
          let column = cell;
          if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
            return true;
          } else {
            return false;
          }
        },
      },
      folio_ficha: {
        title: 'Folio',
        type: 'string',
        sort: false,
      },
      cve_moneda: {
        title: 'Moneda',
        type: 'string',
        sort: false,
      },
      deposito: {
        title: 'Importe',
        type: 'string',
        sort: false,
      },
      cve_concepto: {
        title: 'Concepto',
        type: 'string',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      fec_calculo_intereses: {
        title: 'Fecha Transferencia',
        sort: false,
        type: 'html',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
        filterFunction(cell?: any, search?: string): boolean {
          let column = cell;
          if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
            return true;
          } else {
            return false;
          }
        },
      },
    };
    this.depositSettings.actions = false;
    this.depositSettings.hideSubHeader = false;
    this.depositSettings.columns = {
      cve_banco: {
        title: 'Banco',
        type: 'number',
        sort: false,
      },
      cve_cuenta: {
        title: 'Cuenta',
        type: 'string',
        sort: false,
      },
      fec_movimiento: {
        title: 'Fecha Depósito',
        sort: false,
        type: 'html',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
        filterFunction(cell?: any, search?: string): boolean {
          let column = cell;
          if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
            return true;
          } else {
            return false;
          }
        },
      },
      folio_ficha: {
        title: 'Folio',
        type: 'string',
        sort: false,
      },
      cve_moneda: {
        title: 'Moneda',
        type: 'string',
        sort: false,
      },
      deposito: {
        title: 'Importe',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchDepositary(this.goodId);
      this.searchIncomeFromTheAsset(this.goodId);
    }
  }

  ngOnInit(): void {
    this.dataDeposit
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'cve_banco':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cve_cuenta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fec_movimiento':
                if (filter.search) {
                  filter.search = `${this.returnParseDate(
                    filter.search
                  )} 00:00:00`;
                }
                searchFilter = SearchFilter.SD;
                field = `filter.${filter.field}`;
                break;
              case 'deposito':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              this.depositParams.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.depositParams = this.pageFilter(this.depositParams);
          this.searchDepositary(this.goodId);
        }
      });
    this.depositParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDepositary(this.goodId));

    this.dataAsset
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'cve_banco':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cve_cuenta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fec_movimiento':
                if (filter.search) {
                  filter.search = `${this.returnParseDate(
                    filter.search
                  )} 00:00:00`;
                }
                searchFilter = SearchFilter.SD;
                field = `filter.${filter.field}`;
                break;
              case 'fec_calculo_intereses':
                if (filter.search) {
                  filter.search = `${this.returnParseDate(
                    filter.search
                  )} 00:00:00`;
                }
                searchFilter = SearchFilter.SD;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFiltersAsset[
                field
              ] = `${searchFilter}:${filter.search}`;
              this.assetParams.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.assetParams = this.pageFilter(this.assetParams);
          this.searchIncomeFromTheAsset(this.goodId);
        }
      });
    this.assetParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchIncomeFromTheAsset(this.goodId));
  }

  searchDepositary(goodId: number) {
    this.searchDepositaryIsNull()
      .then(async (response: any) => {
        this.depositList = await Promise.all(
          response.map(async (deposit: any) => {
            return {
              cve_banco: deposit.cve_banco,
              cve_cuenta: deposit.cve_cuenta,
              fec_movimiento: deposit.fec_movimiento,
              folio_ficha: deposit.folio_ficha,
              cve_moneda: deposit.cve_moneda,
              deposito: deposit.deposito,
            };
          })
        );
        this.dataDeposit.load(this.depositList);
        this.dataDeposit.refresh();
        this.depositLoading = false;
      })
      .catch(err => {
        this.dataDeposit.load([]);
        this.dataDeposit.refresh();
        this.depositLoading = false;
      });
  }

  searchDepositaryIsNull() {
    return new Promise((res, _rej) => {
      this.depositLoading = true;
      let params = {
        ...this.depositParams.getValue(),
        ...this.columnFilters,
      };
      this.accountmvmntServices.getAccountAovementsIsNull(params).subscribe({
        next: response => {
          this.depositTotalItems = response.count;
          res(response.data);
        },
        error: err => {
          res('Error');
        },
      });
    });
  }

  searchAccount(numberAccount: string | number) {
    return new Promise((res, rej) => {
      this.accountmvmntServices.getAccountById(numberAccount).subscribe({
        next: response => {
          res(response);
        },
        error: err => {
          res('');
        },
      });
    });
  }

  searchIncomeFromTheAsset(goodId: number) {
    this.incomeFromTheAsset(goodId)
      .then(async (response: any) => {
        console.log(response);
        this.assetList = await Promise.all(
          response.map(async (deposit: any) => {
            return {
              cve_banco: deposit.cve_banco,
              cve_cuenta: deposit.cve_cuenta,
              fec_movimiento: deposit.fec_movimiento,
              folio_ficha: deposit.folio_ficha,
              cve_moneda: deposit.cve_moneda,
              deposito: deposit.deposito,
              cve_concepto: deposit.cve_concepto,
              description: 'TRASPASO COBRO DE CHEQUE',
              fec_calculo_intereses: deposit.fec_calculo_intereses,
            };
          })
        );
        this.dataAsset.load(this.assetList);
        this.dataAsset.refresh();
        this.assetLoading = false;
      })
      .catch(err => {
        this.dataAsset.load([]);
        this.dataAsset.refresh();
        this.assetLoading = false;
      });
  }

  incomeFromTheAsset(goodId: number | string) {
    return new Promise((res, _rej) => {
      this.assetLoading = true;
      this.accountmvmntServices
        .getAccountAovements(goodId, this.assetParams.getValue())
        .subscribe({
          next: response => {
            this.assetTotalItems = response.count;
            res(response.data);
          },
          error: err => {
            res('Error');
          },
        });
    });
  }

  formatearFecha(fecha: Date) {
    let dia: any = fecha.getDate();
    let mes: any = fecha.getMonth() + 1;
    let anio: any = fecha.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    let fechaFormateada = dia + '/' + mes + '/' + anio;
    return fechaFormateada;
  }

  getConceptMovisBank(key: string) {
    const params: ListParams = {};
    params['filter.key'] = `$eq:${key}`;
    this.conceptMovisBankService.getByKey(params).subscribe({
      next: response => {},
      error: err => {},
    });
  }
}
