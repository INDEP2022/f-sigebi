import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-concentrate-goods-type',
  templateUrl: './concentrate-goods-type.component.html',
  styles: [
  ]
})
export class ConcentrateGoodsTypeComponent implements OnInit {
  concentrateGoodsTypeForm: ModelForm<any>;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.concentrateGoodsTypeForm = this.fb.group({
      delegation: [null, Validators.required],
      subDelegation: [null, Validators.required],
      area: [null, Validators.required],
      type: [null, Validators.required],
      initialFile: [null, Validators.required],
      finalFile: [null, Validators.required],
      ReceptionDateOf: [null, Validators.required],
      ReceptionDateTo: [null, Validators.required],
    });
  }
}
