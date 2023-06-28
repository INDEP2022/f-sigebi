import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-goods-management-social-not-load-goods',
  templateUrl: './goods-management-social-not-load-goods.component.html',
  styleUrls: ['./goods-management-social-not-load-goods.component.scss'],
})
export class GoodsManagementSocialNotLoadGoodsComponent implements OnInit {
  pageSizeOptions = [5, 10, 15, 20];
  totalItems = 0;
  loading = false;
  data: { good: number }[] = [];
  dataTemp: { good: number }[] = [];
  limit: FormControl = new FormControl(5);
  $unSubscribe = new Subject<void>();
  dataPaginated: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  settings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
    columns: {
      good: {
        title: 'Número de Bien',
        type: 'string',
        sort: false,
      },
    },
  };
  constructor(private modalRef: BsModalRef) {}

  ngOnInit() {
    this.params.value.limit = 5;
    this.searchNotServerPagination();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
    });
  }

  close() {
    this.modalRef.hide();
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

  private getPaginated(params: ListParams) {
    this.loading = true;
    const cantidad = params.page * params.limit;
    this.dataPaginated.load([
      ...this.dataTemp.slice(
        (params.page - 1) * params.limit,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ]);
    this.dataPaginated.refresh();
    this.loading = false;
  }
}
