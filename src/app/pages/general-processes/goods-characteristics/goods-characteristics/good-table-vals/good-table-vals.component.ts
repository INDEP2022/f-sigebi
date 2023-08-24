import { Component, inject, Input } from '@angular/core';
import { BasePage } from 'src/app/core/shared';

import { ICharacteristicValue } from 'src/app/core/models/good/good-characteristic';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodsCharacteristicsService } from '../../services/goods-characteristics.service';
import { GoodCharacteristicCellValueComponent } from './good-cell-value/good-cell-value.component';

export function getClassColour(row: ICharacteristicValue, disabled: boolean) {
  // console.log(row);
  return row && !disabled
    ? row.requiredAva
      ? 'requiredAva'
      : row.required
      ? 'required'
      : row.update
      ? 'update'
      : ''
    : '';
}

@Component({
  selector: 'app-good-table-vals',
  templateUrl: './good-table-vals.component.html',
  styleUrls: ['./good-table-vals.component.scss'],
})
export class GoodTableValsComponent extends BasePage {
  // @Input() service: GoodsCharacteristicsService;
  @Input() clasification: number;
  @Input() avaluo: boolean;
  @Input() di_numerario_conciliado: string;
  @Input() good: IGood;
  @Input() get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this.show = false;
    if (value) {
      this.settings = {
        ...this.settings,
        edit: {
          editButtonContent: '<i class="fa fa-eye text-success mx-2"></i>',
        },
      };
    } else {
      this.settings = {
        ...this.settings,
        edit: {
          editButtonContent:
            '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
        },
      };
    }
    this.show = true;
  }
  show = false;
  @Input() goodChange: number;
  _disabled: boolean;
  service = inject(GoodsCharacteristicsService);
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      hideSubHeader: false,
      columns: {
        attribute: {
          title: 'ATRIBUTO',
          type: 'string',
          sort: false,
          editable: false,
        },
        value: {
          title: 'VALORES',
          type: 'custom',
          sort: false,
          editable: false,
          valuePrepareFunction: (cell: any, row: any) => {
            // console.log(row, this.good);
            return { value: row, good: this.good };
          },
          renderComponent: GoodCharacteristicCellValueComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data, this.disabled) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };
  }

  ngOnInit() {
    // console.log(this.clasification, this.settings, this.avaluo, this.good);
  }
}
