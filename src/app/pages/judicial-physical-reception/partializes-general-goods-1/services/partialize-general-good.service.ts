import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PartializeGeneralGood } from './partialize-general-good';

@Injectable()
export class PartializeGeneralGoodService extends PartializeGeneralGood {
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
    proceso: {
      title: 'Proceso',
      type: 'string',
      sort: false,
    },
    cantidad: {
      title: 'Cantidad',
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
    this.dbPartialize = 'goodsPartializeds1';
    this.dbSelectedGood = 'goodSelected1';
    this.settingsGoods = { ...this.settingsGoods, columns: this.columns };
  }
}
