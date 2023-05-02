import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GOODS_FORM_VIGILANCE_FORM } from '../utils/goods-vigilance-form';

@Component({
  selector: 'app-goods-vigilance-service',
  templateUrl: './goods-vigilance-service.component.html',
  styles: [],
})
export class GoodsVigilanceServiceComponent implements OnInit {
  form = this.fb.group(new GOODS_FORM_VIGILANCE_FORM());
  constructor(private fb: FormBuilder, private goodService: GoodService) {}

  ngOnInit(): void {}

  getGoodById() {
    const goodId = this.form.controls.goodNum.value;
    if (!goodId) {
      return;
    }
    this.goodService.getById(goodId).subscribe({
      next: good => console.log(good),
      error: error => console.log(error),
    });
  }
}
