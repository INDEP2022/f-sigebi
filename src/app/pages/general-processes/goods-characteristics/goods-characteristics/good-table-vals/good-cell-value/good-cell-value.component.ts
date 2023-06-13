import { Component, Input, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import {
  formatForIsoDate,
  secondFormatDate,
  secondFormatDateTofirstFormatDate,
} from 'src/app/shared/utils/date';
import { GoodsCharacteristicsService } from '../../../services/goods-characteristics.service';
import { IVal } from '../good-table-vals.component';

@Component({
  selector: 'app-good-cell-value',
  templateUrl: './good-cell-value.component.html',
  styleUrls: ['./good-cell-value.component.scss'],
})
export class GoodCellValueComponent extends DefaultEditor implements OnInit {
  // form: FormGroup = new FormGroup({});
  private _value: IVal;
  @Input()
  get value(): IVal {
    return this._value;
  }
  set value(value) {
    if (value.dataType === 'D' || value.attribute.includes('FECHA')) {
      this._value = {
        ...value,
        value: value.value
          ? value.value.includes('T')
            ? (formatForIsoDate(value.value, 'string') as string)
            : secondFormatDateTofirstFormatDate(value.value)
          : null,
      };
    } else {
      this._value = value;
    }
  }
  today: Date = new Date();
  constructor(private service: GoodsCharacteristicsService) {
    super();
  }

  get disabledTable() {
    return this.service.disabledTable;
  }

  updateDate(value: any) {
    console.log(value, secondFormatDate(value));
    this.service.data.forEach(x => {
      if (x.column === this.value.column) {
        x.value = secondFormatDate(value);
      }
    });
  }

  updateCell(value: any) {
    // console.log(value, this.value, this.isAddCat(value));
    if (!this.haveError(this.value)) {
      console.log(value);
      this.service.data.forEach(x => {
        if (x.column === this.value.column) {
          x.value = value;
        }
      });
    }
  }

  getClassColour() {
    return this.value
      ? this.value.requiredAva
        ? 'requiredAva'
        : this.value.required
        ? 'required'
        : this.value.update
        ? 'update'
        : ''
      : '';
  }

  ngOnInit() {
    // console.log(this.value);
  }

  get good() {
    return this.service.good;
  }

  haveError(row: IVal) {
    return (
      this.haveErrorRequired(row) ||
      (!(row.dataType === 'D' || row.attribute.includes('FECHA')) &&
        (this.haveNumericError(row) ||
          this.haveFloatError(row) ||
          this.haveCaracteresEspeciales(row) ||
          this.haveMoneyError(row).length > 0))
    );
  }

  haveCaracteresEspeciales(row: IVal) {
    if (row.dataType === 'V') {
      if (this.haveVerticalSlash(row)) {
        return !this.isAddCat(row.value);
      } else if (this.haveAddWeb(row)) {
        return !this.isCatWeb(row.value);
      } else {
        return !this.isNormal(row.value);
      }
    }
    return false;
  }

  haveVerticalSlash(row: IVal) {
    return (
      row.attribute === 'RESERVADO' || row.attribute === 'SITUACION JURIDICA'
    );
  }

  haveAddWeb(row: IVal) {
    return row.attribute.includes('CATÁLOGO COMERCIAL');
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

  isAddCat(valor: any) {
    let re = new RegExp(`^((?!(@|#|%)).)*$`);
    if (re.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  isCatWeb(valor: any) {
    let re = new RegExp(`^((?!(@|#|%|:|\\|)).)*$`);
    if (re.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  isNormal(valor: any) {
    let re = new RegExp('^((?!(@|#|%|&|:|/|\\|)).)*$');
    if (re.test(valor)) {
      return true;
    } else {
      return false;
    }
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

  // classValue(row: IVal) {
  //   return  this.haveError(row);
  // }
}
