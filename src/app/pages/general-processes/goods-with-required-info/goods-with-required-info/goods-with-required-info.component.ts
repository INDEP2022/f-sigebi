import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_WITH_REQUIRED_INFO_COLUMNS } from './goods-with-required-info-columns';

@Component({
  selector: 'app-goods-with-required-info',
  templateUrl: './goods-with-required-info.component.html',
  styles: [],
})
export class GoodsWithRequiredInfoComponent extends BasePage implements OnInit {
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = GOODS_WITH_REQUIRED_INFO_COLUMNS;
  }

  ngOnInit(): void {}
}
