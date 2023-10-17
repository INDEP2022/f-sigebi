import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

export interface IDs {
  no_bien: number | string;
}

@Injectable({
  providedIn: 'root',
})
export class DonAuthorizaService {
  form: FormGroup;
  selectedGooods: any[] = [];
  loadGoods = new Subject();
  ids: IDs[];
  constructor(private fb: FormBuilder) {}

  buildForm() {
    this.form = this.fb.group({
      mode: [null],
      classificationOfGoods: [null],
      goodStatus: [null],
      classificationGoodAlterning: [null],
    });
  }
}
