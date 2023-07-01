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
import { IGood } from 'src/app/core/models/ms-good/good';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
@Component({
  selector: 'app-assigned-vaults',
  templateUrl: './assigned-vaults.component.html',
  styles: [],
})
export class AssignedVaultsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  good: IGood;
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(
    private readonly goodServices: GoodService,
    private readonly vaultService: SafeService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      id: {
        title: 'Bóveda',
        width: '20%',
        sort: false,
      },
      address: {
        title: 'Ubicación',
        width: '70%',
        sort: false,
      },
      drawerNumber: {
        title: 'Gaveta',
        width: '70%',
        sort: false,
      },
      entryDate: {
        title: 'Fecha Entrada',
        width: '70%',
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
      },
      outDate: {
        title: 'Fecha Salida',
        width: '70%',
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
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchGoodMenage(this.goodId);
    }
  }

  ngOnInit(): void {
    this.dataLoand
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
              case 'id':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'entryDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'outDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.searchGoodMenage(this.goodId);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.goodId));
  }

  searchGoodMenage(idGood: number) {
    this.loading = true;
    this.goodServices.getById(idGood).subscribe({
      next: (response: any) => {
        this.good = response.data[0];
        if (this.good.vaultNumber !== null) {
          this.vaultService.getById(this.good.vaultNumber).subscribe({
            next: (respo: any) => {
              this.list = response.data.map((good: IGood) => {
                return {
                  id: good.vaultNumber,
                  address: respo.ubication,
                  drawerNumber: good.drawerNumber,
                  entryDate: good.dateIn,
                  outDate: good.dateOut,
                };
              });
              this.dataLoand.load(this.list);
              this.dataLoand.refresh();
            },
            error: err => {
              this.dataLoand.load([]);
              this.dataLoand.refresh();
            },
          });
          this.totalItems = response.count;
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }
}
