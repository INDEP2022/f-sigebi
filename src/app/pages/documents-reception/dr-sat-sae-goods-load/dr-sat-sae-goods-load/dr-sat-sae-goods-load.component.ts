import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SAT_SAE_GOODS_LOAD_COLUMNS } from './sat-sae-goods-load-columns';

@Component({
  selector: 'app-dr-sat-sae-goods-load',
  templateUrl: './dr-sat-sae-goods-load.component.html',
  styles: [],
})
export class DrSatSaeGoodsLoadComponent implements OnInit {
  satForm: FormGroup;
  settings = { ...TABLE_SETTINGS, actions: false };
  constructor(private fb: FormBuilder) {
    this.settings.columns = SAT_SAE_GOODS_LOAD_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.satForm = this.fb.group({
      noDocument: [null, [Validators.required]],
      expediente: [null, [Validators.required]],
      volante: [null, [Validators.required]],
    });
  }
}
