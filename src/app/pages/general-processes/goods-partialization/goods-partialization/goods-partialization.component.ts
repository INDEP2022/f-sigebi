import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-partialization',
  templateUrl: './goods-partialization.component.html',
  styles: [],
})
export class GoodsPartializationComponent implements OnInit {
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
