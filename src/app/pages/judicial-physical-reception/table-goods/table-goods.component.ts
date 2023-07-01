import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-goods',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './table-goods.component.html',
  styles: [``],
})
export class TableGoodsComponent extends BasePage implements OnInit {
  @Input() settingsTable: any;
  @Input() statusActaValue: string;
  @Input() set page(value: number) {
    // console.log('Nueva Página', value);

    this.params.value.page = value;
    // console.log(this.params.value);
  }
  @Input() override loading = false;
  @Input() haveServerPagination: boolean; // campo requerido
  @Input() haveDelete = true;
  // _data: any[];
  @Input() data: any[];
  @Input() totalItems: number = 0;

  @Output() updateData = new EventEmitter<ListParams>();
  @Output() rowsSelected = new EventEmitter();
  @Output() updateGoodsRow = new EventEmitter();
  @Output() showDeleteAlert = new EventEmitter();
  dataOld: any[] = [];
  datatoShow: LocalDataSource = new LocalDataSource();
  pageSizeOptions = [5, 10, 15, 20];
  // dataPaginated: any[] = [];
  count = 0;
  private _statusActaValue: string;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.searchNotServerPagination();
  }

  private getPaginated(params: ListParams) {
    // debugger;
    const cantidad = params.page * params.limit;
    this.datatoShow.load([
      ...this.data.slice(
        (params.page - 1) * params.limit,
        cantidad > this.data.length ? this.data.length : cantidad
      ),
    ]);
    this.datatoShow.refresh();
    // this.datatoShow.reset();
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      if (this.haveServerPagination) {
        if (this.count > 0) {
          this.updateData.emit(params);
        }
        this.count++;
      } else {
        this.getPaginated(params);
      }
    });
  }

  private searchNotServerPagination() {
    this.datatoShow
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter' && !this.haveServerPagination) {
          // this.data = this.dataOld;
          // debugger;
          let filters = change.filter.filters;
          filters.map((filter: any, index: number) => {
            // console.log(filter, index);
            if (index === 0) {
              this.data = [...this.dataOld];
            }
            this.data = this.data.filter(item =>
              filter.search !== ''
                ? (item[filter['field']] + '').includes(filter.search)
                : true
            );
          });
          // this.totalItems = filterData.length;
          // console.log(this.data);
          this.totalItems = this.data.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    const data = changes['data'];
    if (data && !data.firstChange) {
      if (this.statusActaValue) {
        this.updateSettingsGoods();
      } else {
        this.fillData(data.currentValue);
      }
    }

    // if (data.firstChange === false) {
    //   this.data = changes['data'].currentValue;
    //   this.updateSettingsGoods();
    // }

    if (changes['statusActaValue'] && !changes['statusActaValue'].firstChange) {
      this.updateSettingsGoods();
    }
  }

  updateRow(event: any) {
    let { newData, confirm } = event;
    // console.log(event);
    this.updateGoodsRow.emit(event);
    confirm.resolve(newData);
  }

  private fillData(data = this.data) {
    if (data && data.length > 0) {
      this.dataOld = [...data];
      if (this.haveServerPagination === false) {
        this.getPaginated(this.params.getValue());
      } else {
        this.datatoShow.load(this.data);
        this.datatoShow.refresh();
      }
    }
  }

  private updateSettingsGoods(value = this.statusActaValue) {
    // debugger;
    this.settingsTable = {
      ...this.settingsTable,
      actions: {
        ...this.settingsTable.actions,
        edit: value !== 'CERRADA',
        delete: this.haveDelete && value !== 'CERRADA',
      },
    };
    console.log(
      this.settingsTable,
      this.data,
      this.haveServerPagination,
      this.datatoShow
    );
    this.fillData();
  }
}
