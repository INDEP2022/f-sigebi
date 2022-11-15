import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-gp-goods-partialization',
  templateUrl: './gp-goods-partialization.component.html',
  styles: [],
})
export class GpGoodsPartializationComponent implements OnInit {
  form = this.fb.group({
    bien: [null, [Validators.required]],
    original: [null, [Validators.required]],
    en: [null, [Validators.required]],
    y: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
