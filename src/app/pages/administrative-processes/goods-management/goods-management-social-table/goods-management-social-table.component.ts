import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackerGoodSocialCabinet } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared';
import { ETypeGabinetProcess } from '../goods-management-social-cabinet/typeProcess';
import { GoodsManagementService } from '../services/goods-management.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-goods-management-social-table',
  templateUrl: './goods-management-social-table.component.html',
  styleUrls: ['./goods-management-social-table.component.scss'],
})
export class GoodsManagementSocialTable extends BasePage {
  // private _selectedGoods: number[];
  data: ITrackerGoodSocialCabinet[] = [];
  dataTemp: ITrackerGoodSocialCabinet[] = [];
  dataPaginated: LocalDataSource = new LocalDataSource();
  // notLoadedGoods: { good: number }[] = [];
  pageSizeOptions = [5, 10, 15, 20];
  limit: FormControl = new FormControl(5);
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems = 0;
  @Input() override loading: boolean = false;
  @Input() process: ETypeGabinetProcess;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('containerTable') containerTable: ElementRef;
  @Input()
  identifier: number;
  // @Input()
  // set selectedGoods(value:ITrackedGood[]) {
  //   if (value.length > 0) {
  //     // this._selectedGoods = value;
  //     // this.getData();
  //   }
  // }
  // @Input() option: string;

  constructor(
    private goodTrackerService: GoodTrackerService,
    private goodsManagementService: GoodsManagementService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
      actions: null,
    };
    this.params.value.limit = 5;
    this.searchNotServerPagination();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
    });
    this.goodsManagementService.clear
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.dataNotFound();
          }
        },
      });
    this.goodsManagementService.refreshTable.subscribe({
      next: response => {
        // debugger;
        if (response) {
          this.data = [
            ...this.goodsManagementService.getByProcess(this.process),
          ];
          this.dataTemp = [...this.data];
          this.getPaginated(this.params.value);
        } else {
          this.dataNotFound();
        }
      },
    });
    this.goodsManagementService.selectedGoodSubject.subscribe({
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
    this.dataPaginated.setFilter([], true, false);
    this.dataPaginated.load([]);
    this.dataPaginated.refresh();
    this.loading = false;
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
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

  private getPaginated(params: ListParams) {
    this.totalItems = this.dataTemp.length;
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
