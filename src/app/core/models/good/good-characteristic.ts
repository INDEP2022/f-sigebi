import { Component, Inject, Input } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import {
  formatForIsoDate,
  secondFormatDate,
  secondFormatDateTofirstFormatDate,
} from 'src/app/shared/utils/date';
import { IGood } from './good.model';

export interface ICharacteristicValue {
  column: string;
  attribute: string;
  value: string;
  required: boolean;
  update: boolean;
  requiredAva: boolean;
  tableCd: string;
  editing: boolean;
  length: number;
  dataType: string;
}

@Component({
  selector: 'app-characteristic-editor-cell',
  template: ``,
  styles: [],
})
export class CharacteristicEditorCell extends DefaultEditor {
  row: ICharacteristicValue;
  private good: IGood;
  @Input()
  set value(data: { value: ICharacteristicValue; good: IGood }) {
    // console.log(data);

    const value = data.value;
    this.good = data.good;
    if (value.dataType === 'D' || value.attribute.includes('FECHA')) {
      this.row = {
        ...value,
        value: value.value
          ? value.value.includes('T')
            ? (formatForIsoDate(value.value, 'string') as string)
            : secondFormatDateTofirstFormatDate(value.value)
          : null,
      };
    } else {
      this.row = value;
    }
  }
  today: Date = new Date();

  constructor(
    @Inject({ data: [] })
    protected service: { data: ICharacteristicValue[]; disabledTable: boolean }
  ) {
    super();
  }

  get disabledTable() {
    return this.service.disabledTable;
  }

  updateDate(value: any) {
    console.log(value, secondFormatDate(value));
    this.service.data.forEach(x => {
      if (x.column === this.row.column) {
        x.value = secondFormatDate(value);
      }
    });
  }

  updateCell(value: any) {
    // console.log(value, this.value, this.isAddCat(value));
    if (!this.haveError(this.row)) {
      console.log(value);
      this.service.data.forEach(x => {
        if (x.column === this.row.column) {
          x.value = value;
        }
      });
    }
  }

  haveError(row: ICharacteristicValue) {
    if (!row) return true;
    if (!row.value) return true;
    return (
      this.haveErrorRequired(row) ||
      (!(row.dataType === 'D' || row.attribute.includes('FECHA')) &&
        (this.haveNumericError(row) ||
          this.haveFloatError(row) ||
          this.haveMoneyError(row).length > 0))
    );
  }

  haveCaracteresEspeciales(row: ICharacteristicValue) {
    if (!row) {
      return false;
    }
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

  haveVerticalSlash(row: ICharacteristicValue) {
    if (!row) {
      return false;
    }
    return (
      row.attribute === 'RESERVADO' || row.attribute === 'SITUACION JURIDICA'
    );
  }

  haveAddWeb(row: ICharacteristicValue) {
    if (!row) {
      return false;
    }
    return row.attribute.includes('CATÁLOGO COMERCIAL');
  }

  notInt(valor: any) {
    if (valor) {
      valor = parseInt(valor);
      if (isNaN(valor)) {
        return true;
      }
    }

    return false;
  }

  notFloat(valor: any) {
    if (!valor) {
      return false;
    }
    var RE = /^\d*(\.\d{1})?\d{0,3}$/;
    if (RE.test(valor)) {
      return false;
    } else {
      return true;
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

  haveNumericError(row: ICharacteristicValue) {
    if (!row) {
      return true;
    }
    return row.dataType === 'N' && this.notInt(row.value);
  }

  haveFloatError(row: ICharacteristicValue) {
    if (!row) {
      return true;
    }
    return row.dataType === 'F' && this.notFloat(row.value);
  }

  haveMoneyError(row: ICharacteristicValue) {
    if (!row) {
      return '';
    }
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

  haveErrorRequired(row: ICharacteristicValue) {
    if (!row) {
      return true;
    }
    return (
      row.required && (!row.value || (row.value && row.value.trim() == ''))
    );
  }

  formatDate(fe: string) {
    const fecha = new Date(fe);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
    const año = fecha.getFullYear();
    const diaFormateado = ('0' + dia).slice(-2);
    const mesFormateado = ('0' + mes).slice(-2);
    const fechaFormateada = diaFormateado + '-' + mesFormateado + '-' + año;
    return fechaFormateada;
  }
}
