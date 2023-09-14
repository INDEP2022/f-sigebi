import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PartializeGeneralGood } from './partialize-general-good';

@Injectable()
export class PartializeGeneralGoodService extends PartializeGeneralGood {
  constructor(override fb: FormBuilder) {
    super(fb);
    this.dbPartialize = 'goodsPartializeds1';
    this.dbSelectedGood = 'goodSelected1';
    // this.settingsGoods = { ...this.settingsGoods };
  }
}
