import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPackageGoodError } from 'src/app/core/models/ms-package-good/package-good-error';
import { BasePage } from 'src/app/core/shared';
import { ERRORCOLUMNS } from '../../massive-conversion/columns';

@Component({
  selector: 'app-massive-conversion-errors-modal',
  templateUrl: './massive-conversion-errors-modal.component.html',
  styleUrls: ['./massive-conversion-errors-modal.component.scss'],
})
export class MassiveConversionErrorsModalComponent
  extends BasePage
  implements OnInit
{
  errorData: any;

  data: IPackageGoodError[] = [];
  dataTemp: IPackageGoodError[] = [];
  dataPaginated: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: { add: false, delete: false, edit: false },
      columns: ERRORCOLUMNS,
    };
  }

  ngOnInit() {
    if (this.data) {
      console.log(this.data);
      this.totalItems = this.data.length;
      this.dataTemp = [...this.data];
      this.getPaginated(this.params.value);
      this.searchNotServerPagination();
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
        // console.log(params);

        this.getPaginated(params);
      });
    }
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
          console.log(this.dataTemp);
          this.totalItems = this.dataTemp.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
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

  close() {
    this.modalRef.hide();
  }
}
