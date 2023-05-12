import { Inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PartializeGeneralGood } from './partialize-general-good';
@Injectable()
export class PartializeGeneralGoodTab2Service extends PartializeGeneralGood {
  private columns: any = {
    id: {
      title: 'Id.',
      type: 'string',
      sort: false,
    },
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
  };

  constructor(
    @Inject('dbPartialize') override dbPartialize: string,
    @Inject('dbSelectedGood') override dbSelectedGood: string,
    override fb: FormBuilder
  ) {
    super(dbPartialize, dbSelectedGood, fb);
    this.settingsGoods = { ...this.settingsGoods, columns: this.columns };
  }
}
