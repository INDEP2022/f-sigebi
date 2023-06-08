import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import {
  firstFormatDate,
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
} from 'src/app/shared/utils/date';
import { GoodsCharacteristicsService } from '../../services/goods-characteristics.service';
import { GoodCharacteristicModalComponent } from './good-characteristic-modal/good-characteristic-modal.component';

export interface IVal {
  column: string;
  attribute: string;
  value: string;
  oldValue: string;
  required: boolean;
  update: boolean;
  requiredAva: boolean;
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
export class GoodTableValsComponent extends BasePage implements OnInit {
  pageSizeOptions = [5, 10, 15, 20];
  limit: FormControl = new FormControl(5);
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: IVal[];
  dataPaginated: IVal[];
  actualiza: boolean;
  requerido: boolean;

  totalItems = 0;
  constructor(
    private goodsqueryService: GoodsQueryService,
    private goodService: GoodService,
    private service: GoodsCharacteristicsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'left',
        add: false,
        edit: true,
        delete: false,
      },
      hideSubHeader: false,
      columns: {
        attribute: {
          title: 'Atributo',
          type: 'string',
          sort: true,
          editable: false,
        },
        value: {
          title: 'Valores',
          type: 'string',
          sort: false,
          editable: false,
        },
      },
    };
    this.params.value.limit = 5;
  }

  get di_numerario_conciliado() {
    return this.service.di_numerario_conciliado;
  }

  get newGood() {
    return this.service.newGood;
  }

  get disabledBienes() {
    return this.service.disabledBienes;
  }

  get good() {
    return this.service.good;
  }

  get form() {
    return this.service.form;
  }

  get avaluo() {
    return this.form
      ? this.form.get('avaluo')
        ? this.form.get('avaluo').value
        : false
      : false;
  }

  private haveUpdate(update: string) {
    if (update) {
      if (update === 'S' && this.di_numerario_conciliado !== 'Conciliado') {
        return true;
      }
    }
    return false;
  }

  openForm(row: IVal) {
    let config: ModalOptions = {
      initialState: {
        row,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodCharacteristicModalComponent, config);
  }

  // getNewRowValue(row: IVal) {
  //   if (row.dataType === 'D' || row.attribute.includes('FECHA')) {
  //     row.value = firstFormatDate(row.value as any);
  //     good[row.column] = firstFormatDateToSecondFormatDate(row.value);
  //   }
  // }

  updateRow(row: IVal, index: number) {
    // let newValue: any = row.value;
    // console.log(row.value);
    this.newGood[row.column] = row.value;
    if (row.dataType === 'D' || row.attribute.includes('FECHA')) {
      row.value = firstFormatDate(row.value as any);
      this.newGood[row.column] = firstFormatDateToSecondFormatDate(row.value);
    }
    if (row.attribute === 'MONEDA') {
      if (this.good.goodClassNumber === 62 && row.value!) {
      }
    }

    this.data[index].oldValue = row.value;

    // this.goodService
    //   .update(good)
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe({
    //     next: response => {
    //       console.log('Actualizo');
    //       this.data[index].oldValue = row.value;
    //       this.onLoadToast('success', 'Bien', 'Actualizado correctamente');
    //     },
    //     error: err => {
    //       this.data[index].value = row.oldValue;
    //     },
    //   });
  }

  getClassColour(row: IVal) {
    return row.requiredAva
      ? 'requiredAva'
      : row.required
      ? 'required'
      : row.update
      ? 'update'
      : '';
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

  getValue(good: any, item: IAttribClassifGoods) {
    const column = 'val' + item.columnNumber;
    return item.dataType === 'D' || item.attribute.includes('FECHA')
      ? formatForIsoDate(good[column], 'string')
      : good[column];
  }

  haveRequiredAva(attribute: string) {
    return this.avaluo ? (attribute === 'CON AVALUO' ? true : false) : false;
  }

  ngOnInit() {
    this.service.goodChange.subscribe({
      next: response => {
        if (response) {
          const filterParams = new FilterParams();
          filterParams.limit = 100;
          filterParams.addFilter(
            'classifGoodNumber',
            this.good.goodClassNumber
          );
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
                      requiredAva: item.attribute
                        ? this.haveRequiredAva(item.attribute)
                        : false,
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
        } else {
          this.loading = false;
        }
      },
    });
  }
}
