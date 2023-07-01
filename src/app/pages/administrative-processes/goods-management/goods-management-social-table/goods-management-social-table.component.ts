import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared';
import { GoodsManagementService } from '../services/goods-management.service';
import { COLUMNS } from './columns';
import { GoodsManagementSocialNotLoadGoodsComponent } from './goods-management-social-not-load-goods/goods-management-social-not-load-goods.component';

@Component({
  selector: 'app-goods-management-social-table',
  templateUrl: './goods-management-social-table.component.html',
  styleUrls: ['./goods-management-social-table.component.scss'],
})
export class GoodsManagementSocialTable extends BasePage {
  private _selectedGoods: number[];
  data: ITrackedGood[] = [];
  dataTemp: ITrackedGood[] = [];
  dataPaginated: LocalDataSource = new LocalDataSource();
  notLoadedGoods: { good: number }[] = [];
  pageSizeOptions = [5, 10, 15, 20];
  limit: FormControl = new FormControl(5);
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems = 0;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('containerTable') containerTable: ElementRef;
  @Input()
  identifier: number;
  @Input()
  get selectedGoods(): number[] {
    return this._selectedGoods;
  }
  set selectedGoods(value) {
    if (value.length > 0) {
      this._selectedGoods = value;
      this.getData();
    }
  }
  @Input() set clear(value: number) {
    if (value > 0) {
      this.notLoadedGoods = [];
      this.dataNotFound();
    }
  }
  @Input() option: string;
  constructor(
    private modalService: BsModalService,
    private goodTrackerService: GoodTrackerService,
    private goodManagementeService: GoodsManagementService
  ) {
    super();
    this.params.value.limit = 5;
    this.searchNotServerPagination();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
    });

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
      actions: null,
    };
    this.goodManagementeService.selectedGoodSubject.subscribe({
      next: response => {
        // debugger;
        console.log(response, this.data);
        let index = this.data.findIndex(
          row => row.goodNumber === response + ''
        );
        console.log(index);
        if (index === -1) {
          return;
        }
        console.log(this.table);
        // const cantPerPage =  this.params.value.page *  this.params.value.limit;
        const page = index / this.params.value.limit;
        this.params.value.page = Math.floor(page) + 1;
        this.getPaginated(this.params.getValue());
        setTimeout(() => {
          this.table.grid.getRows().forEach(row => {
            if (row.getData()['goodNumber'] === response) {
              console.log(row);
              this.table.grid.multipleSelectRow(row);
              var bodyRect = document.body.getBoundingClientRect(),
                elemRect =
                  this.containerTable.nativeElement.getBoundingClientRect(),
                offset = elemRect.top - bodyRect.top;
              // this.containerTable.nativeElement.focus();
              document.body.scrollTop = offset; // For Safari
              document.documentElement.scrollTop = offset; // For Chrome, Firefox, IE and Opera
              // this.table.
            }
          });
        }, 500);
      },
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  optionString(cabinetSocial: string) {
    switch (cabinetSocial) {
      case '1':
        return 'Susceptible';
      case '2':
        return 'Asignado';
      case '3':
        return 'Entregado';
      case '4':
        return 'Liberar';
      default:
        return 'Sin Asignar';
    }
  }

  dataNotFound() {
    this.totalItems = 0;
    this.data = [];
    this.dataPaginated.load([]);
    this.dataPaginated.refresh();
    this.loading = false;
  }

  showNotLoads() {
    let config: ModalOptions = {
      initialState: {
        data: this.notLoadedGoods,
        totalItems: this.notLoadedGoods.length,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodsManagementSocialNotLoadGoodsComponent, config);
  }

  private searchNotServerPagination() {
    this.dataPaginated
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          // this.data = this.dataOld;
          // debugger;
          let filters = change.filter.filters;
          filters.map((filter: any, index: number) => {
            // console.log(filter, index);
            if (index === 0) {
              this.dataTemp = [...this.data];
            }
            this.dataTemp = this.dataTemp.filter((item: any) =>
              filter.search !== ''
                ? (item[filter['field']] + '')
                    .toUpperCase()
                    .includes((filter.search + '').toUpperCase())
                : true
            );
          });
          // this.totalItems = filterData.length;
          // console.log(this.dataTemp);
          this.totalItems = this.dataTemp.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

  getData() {
    this.loading = true;
    // let params = {
    //   ...this.params.getValue(),
    // };
    const filterParams = new FilterParams();
    filterParams.limit = 2000;
    filterParams.addFilter(
      'goodNumber',
      this.selectedGoods.toString(),
      SearchFilter.IN
    );
    // if (!params['filter.goodNumber']) {
    //   params['filter.goodNumber'] = '$in:' + this.selectedGoods.toString();
    // }

    this.goodTrackerService
      .getAll(filterParams.getParams())
      .pipe(
        takeUntil(this.$unSubscribe),
        map(response => {
          return {
            ...response,
            data: response.data.map(row => {
              return {
                ...row,
                officeProc: this.optionString(row.socialCabite),
              };
            }),
          };
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.totalItems = response.count || 0;
            this.notLoadedGoods = [];
            this.selectedGoods.forEach(x => {
              if (
                !response.data
                  .map((item: any) => item.goodNumber)
                  .toString()
                  .includes(x)
              ) {
                this.notLoadedGoods.push({ good: x });
              }
            });
            this.data = response.data;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notLoadedGoods = [];
            this.dataNotFound();
          }
        },
        error: err => {
          this.notLoadedGoods = [];
          this.dataNotFound();
        },
      });
  }

  private getPaginated(params: ListParams) {
    const cantidad = params.page * params.limit;
    this.dataPaginated.load([
      ...this.dataTemp.slice(
        (params.page - 1) * params.limit,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ]);
    this.dataPaginated.refresh();
  }
}
