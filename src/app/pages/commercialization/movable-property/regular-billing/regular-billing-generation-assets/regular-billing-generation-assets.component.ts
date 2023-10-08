import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_GENERATION_ASSETS_COLUMNS } from './regular-billing-generation-assets-columns';
//XLSX
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerInvoiceFacPapelService } from 'src/app/core/services/ms-invoice/ms-comer-invoice-fac-papel.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
@Component({
  selector: 'app-regular-billing-generation-assets',
  templateUrl: './regular-billing-generation-assets.component.html',
  styles: [],
})
export class RegularBillingGenerationAssetsComponent
  extends BasePage
  implements OnInit
{
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private excelService: ExcelService,
    private authService: AuthService,
    private massiveGoodService: MassiveGoodService,
    private comerInvoiceFacPapel: ComerInvoiceFacPapelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...REGULAR_BILLING_GENERATION_ASSETS_COLUMNS },
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    const user = this.authService.decodeToken();
    this.paramsList.getValue()[
      'filter.sesionId'
    ] = `${SearchFilter.EQ}:DR_SIGEBI`;

    this.dataFilter
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              notGood: () => (searchFilter = SearchFilter.EQ),
              insertDate: () => (searchFilter = SearchFilter.EQ),
              Invoice: () => (searchFilter = SearchFilter.EQ),
              series: () => (searchFilter = SearchFilter.ILIKE),
              observations: () => (searchFilter = SearchFilter.ILIKE),
              eventId: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.ILIKE),
              lotPublic: () => (searchFilter = SearchFilter.EQ),
              downloadValidation: () => (searchFilter = SearchFilter.ILIKE),
              userinsert: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllComerPapel();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getAllComerPapel();
    });
  }

  importExcell(event: any) {
    let file = event.target.files[0];
    this.massiveGoodService
      .importExcellGoodsInvoice({
        pSession: 7545034,
        user: 'DR_SIGEBI',
        file,
      })
      .subscribe({
        next: resp => {
          console.log(resp);
        },
        error: err => {
          this.alert('warning', 'Atención', err.error.message);
        },
      });
  }

  exportAsXLSX(): void {}

  getAllComerPapel() {
    this.loading = true;
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.comerInvoiceFacPapel.getAll(params).subscribe({
      next: resp => {
        this.loading = false;
        this.totalItems = resp.count;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
      },
      error: () => {
        this.loading = false;
        this.totalItems = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
      },
    });
  }
}
