import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PartializeGeneralGood } from './partialize-general-good';

@Injectable()
export class PartializeGeneralGoodV2Service extends PartializeGeneralGood {
  private columns: any = {
    noBien: {
      title: 'No. Bien',
      type: 'string',
      sort: false,
    },
    descripcion: {
      title: 'Descripción',
      type: 'string',
      sort: false,
    },
    avaluo: {
      title: 'Valor Avalúo',
      type: 'string',
      sort: false,
    },
    importe: {
      title: 'Importe',
      type: 'number',
      sort: false,
    },
  };
  constructor(override fb: FormBuilder) {
    super(fb);
    this.dbPartialize = 'goodsPartializeds1v1';
    this.dbSelectedGood = 'goodSelected1v1';
    this.clasificators = '62, 1424, 1426';
    // this.settingsGoods = { ...this.settingsGoods, columns: this.columns };
  }

  override get vimporte() {
    return this.good
      ? !this.validationClasif()
        ? +(this.good.quantity + '')
        : this.good.val2
        ? Number((+this.good.val2).toFixed(4))
        : -1
      : -1;
  }
}
