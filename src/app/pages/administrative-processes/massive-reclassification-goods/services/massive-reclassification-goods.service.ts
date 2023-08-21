import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IGood } from 'src/app/core/models/ms-good/good';

export interface IDs {
  No_bien: number;
}
@Injectable({
  providedIn: 'root',
})
export class MassiveReclassificationGoodsService {
  form: FormGroup;
  selectedGooods: IGood[] = [];
  loadGoods = new Subject();
  ids: IDs[];
  constructor(private fb: FormBuilder) {}

  buildForm() {
    this.form = this.fb.group({
      mode: [null, [Validators.required]],
      classificationOfGoods: [null],
      goodStatus: [null],
      classificationGoodAlterning: [null],
    });
  }
}
