import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import {
  firstFormatDate,
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
} from 'src/app/shared/utils/date';
import { SweetAlertIcon } from 'sweetalert2';

export interface IVal {
  column: string;
  attribute: string;
  value: string;
  oldValue: string;
  required: boolean;
  update: boolean;
  tableCd: string;
  editing: boolean;
  length: number;
  dataType: string;
}

@Component({
  selector: 'app-good-table-vals',
  templateUrl: './good-table-vals.component.html',
  styleUrls: ['./good-table-vals.component.scss'],
})
export class GoodTableValsComponent implements OnInit {
  @Input() good: IGood;
  @Input() di_numerario_conciliado: string;
  private _toastrService = inject(ToastrService);
  $unSubscribe = new Subject<void>();
  totalItems: number = 0;
  pageSizeOptions = [5, 10, 15, 20];
  limit: FormControl = new FormControl(5);
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: IVal[];
  dataPaginated: IVal[];
  loading: boolean;
  actualiza: boolean;
  requerido: boolean;
  today: Date = new Date();
  constructor(
    private goodsqueryService: GoodsQueryService,
    private goodService: GoodService
  ) {
    this.params.value.limit = 5;
  }

  onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    const throwToast = {
      success: (title: string, text: string) =>
        this._toastrService.success(text, title),
      info: (title: string, text: string) =>
        this._toastrService.info(text, title),
      warning: (title: string, text: string) =>
        this._toastrService.warning(text, title),
      error: (title: string, text: string) =>
        this._toastrService.error(text, title),
      question: (title: string, text: string) =>
        this._toastrService.info(text, title),
    };
    return throwToast[icon](title, text);
  }

  private haveUpdate(update: string) {
    if (update) {
      if (update === 'S' && this.di_numerario_conciliado !== 'Conciliado') {
        return true;
      }
    }
    return false;
  }

  // getNewRowValue(row: IVal) {
  //   if (row.dataType === 'D' || row.attribute.includes('FECHA')) {
  //     row.value = firstFormatDate(row.value as any);
  //     good[row.column] = firstFormatDateToSecondFormatDate(row.value);
  //   }
  // }

  updateRow(row: IVal, index: number) {
    const good: any = { id: this.good.id, goodId: this.good.goodId };
    // let newValue: any = row.value;
    // console.log(row.value);
    good[row.column] = row.value;
    if (row.dataType === 'D' || row.attribute.includes('FECHA')) {
      row.value = firstFormatDate(row.value as any);
      good[row.column] = firstFormatDateToSecondFormatDate(row.value);
    }
    if (row.attribute === 'MONEDA') {
      if (this.good.goodClassNumber === 62 && row.value!) {
      }
    }

    this.goodService
      .update(good)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log('Actualizo');
          this.data[index].oldValue = row.value;
          this.onLoadToast('success', 'Bien', 'Actualizado correctamente');
        },
        error: err => {
          this.data[index].value = row.oldValue;
        },
      });
  }

  private getPaginated(params: ListParams) {
    const cantidad = params.page * params.limit;
    this.dataPaginated = this.data.slice(
      (params.page - 1) * params.limit,
      cantidad > this.data.length ? this.data.length : cantidad
    );
  }

  private subsPaginated() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
    });
  }

  notInt(valor: any) {
    valor = parseInt(valor);
    if (isNaN(valor)) {
      return true;
    }
    return false;
  }

  isFloat(valor: any) {
    var RE = /^\d*(\.\d{1})?\d{0,3}$/;
    if (RE.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  getValue(good: any, item: IAttribClassifGoods) {
    const column = 'val' + item.columnNumber;
    return item.dataType === 'D' || item.attribute.includes('FECHA')
      ? formatForIsoDate(good[column], 'string')
      : good[column];
  }

  haveError(row: IVal) {
    return (
      this.haveErrorRequired(row) ||
      this.haveNumericError(row) ||
      this.haveFloatError(row) ||
      this.haveMoneyError(row).length > 0
    );
  }

  haveNumericError(row: IVal) {
    return row.dataType === 'N' && this.notInt(row.value);
  }

  haveFloatError(row: IVal) {
    return row.dataType === 'F' && !this.isFloat(row.value);
  }

  haveMoneyError(row: IVal) {
    if (row.attribute === 'MONEDA') {
      if (
        this.good.goodClassNumber === 62 &&
        row.value != 'MN' &&
        row.value != 'USD'
      ) {
        return 'El numerario solo acepta Moneda Nacional o dólares';
      } else if (this.good.goodClassNumber === 1424 && row.value != 'MN') {
        return 'El numerario solo acepta Moneda Nacional';
      } else if (this.good.goodClassNumber === 1426 && row.value != 'USD') {
        return 'El numerario solo acepta Dólares (USD)';
      } else if (this.good.goodClassNumber === 1590 && row.value != 'EUR') {
        return 'El numerario solo acepta Euros (EUR)';
      }
    }
    return '';
  }

  haveErrorRequired(row: IVal) {
    return (
      row.required && (!row.value || (row.value && row.value.trim() == ''))
    );
  }

  ngOnInit() {
    if (this.good) {
      this.loading = true;
      const filterParams = new FilterParams();
      filterParams.limit = 100;
      filterParams.addFilter('classifGoodNumber', this.good.goodClassNumber);
      filterParams.addFilter('columnNumber', '51', SearchFilter.NOTIN);
      const good = this.good as any;
      this.goodsqueryService
        .getAtribuXClasif(filterParams.getParams())
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            if (response.data && response.data.length > 0) {
              this.data = response.data.map(item => {
                const column = 'val' + item.columnNumber;
                return {
                  column,
                  attribute: item.attribute,
                  value: this.getValue(good, item),
                  oldValue: this.getValue(good, item),
                  required: item.required === 'S',
                  update: this.haveUpdate(item.update),
                  tableCd: item.tableCd,
                  editing: false,
                  length: item.length,
                  dataType: item.dataType,
                };
              });
              this.totalItems = this.data.length;
              this.getPaginated(this.params.value);
              this.loading = false;
              console.log(this.data);
            } else {
              this.loading = false;
            }
          },
        });
      this.subsPaginated();
    }
  }
}
