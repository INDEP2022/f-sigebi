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
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-warehouses-assigned',
  templateUrl: './warehouses-assigned.component.html',
  styles: [],
})
export class WarehousesAssignedComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  good: IGood;
  columnFilter: any = [];
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(
    private readonly goodServices: GoodService,
    private readonly warehouseService: WarehouseService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      id: {
        title: 'Almacén',
        width: '20%',
        sort: false,
      },
      address: {
        title: 'Ubicación',
        width: '70%',
        sort: false,
      },
      lot: {
        title: 'Lote',
        width: '70%',
        sort: false,
      },
      rack: {
        title: 'Rack',
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
            text ? text.split('T')[0].split('-').reverse().join('-') : ''
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
      this.search(this.goodId);
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
          this.search(this.goodId);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search(this.goodId));
  }

  search(idGood: number) {
    this.loading = true;
    this.goodServices.getById(idGood).subscribe({
      next: (response: any) => {
        this.good = response.data[0];
        if (this.good.storeNumber !== null) {
          this.warehouseService.getById(this.good.storeNumber).subscribe({
            next: (respo: any) => {
              this.list = response.data.map((good: any) => {
                return {
                  id: good.storeNumber,
                  address: respo.ubication,
                  lot: good.lotNumber ? good.lotNumber.id : '',
                  rack: good.rackNumber,
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
