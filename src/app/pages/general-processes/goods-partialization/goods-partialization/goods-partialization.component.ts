import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-partialization',
  templateUrl: './goods-partialization.component.html',
  styles: [],
})
export class GoodsPartializationComponent implements OnInit {
  form = this.fb.group({
    bien: [null, [Validators.required]],
    original: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    en: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    y: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
