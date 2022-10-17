import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { SAT_SAE_GOODS_LOAD_COLUMNS } from './sat-sae-goods-load-columns';

@Component({
  selector: 'app-dr-sat-sae-goods-load',
  templateUrl: './dr-sat-sae-goods-load.component.html',
  styles: [],
})
export class DrSatSaeGoodsLoadComponent extends BasePage implements OnInit {
  satForm: FormGroup;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SAT_SAE_GOODS_LOAD_COLUMNS },
    };
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
