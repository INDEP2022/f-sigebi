import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { GoodsCharacteristicsService } from '../../../services/goods-characteristics.service';
import { IVal } from '../good-table-vals.component';

@Component({
  selector: 'app-good-cell-value',
  templateUrl: './good-cell-value.component.html',
  styleUrls: ['./good-cell-value.component.css'],
})
export class GoodCellValueComponent extends DefaultEditor implements OnInit {
  // form: FormGroup = new FormGroup({});
  row: any;
  today: Date = new Date();
  constructor(private service: GoodsCharacteristicsService) {
    super();
  }

  ngOnInit() {
    console.log(this.row);
  }

  get good() {
    return this.service.good;
  }

  haveError(row: IVal) {
    return (
      this.haveErrorRequired(row) ||
      this.haveNumericError(row) ||
      this.haveFloatError(row) ||
      this.haveMoneyError(row).length > 0
    );
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
