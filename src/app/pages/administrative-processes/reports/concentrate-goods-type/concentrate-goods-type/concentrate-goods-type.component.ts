import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-concentrate-goods-type',
  templateUrl: './concentrate-goods-type.component.html',
  styles: [],
})
export class ConcentrateGoodsTypeComponent implements OnInit {
  concentrateGoodsTypeForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.concentrateGoodsTypeForm = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      initialFile: [null, Validators.required],
      finalFile: [null, Validators.required],
      ReceptionDateOf: [null, Validators.required],
      ReceptionDateTo: [null, Validators.required],
    });
  }
}
