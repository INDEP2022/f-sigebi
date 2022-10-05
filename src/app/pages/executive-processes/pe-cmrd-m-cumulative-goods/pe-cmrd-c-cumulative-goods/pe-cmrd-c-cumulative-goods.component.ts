import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-cmrd-c-cumulative-goods',
  templateUrl: './pe-cmrd-c-cumulative-goods.component.html',
  styles: [
  ]
})
export class PeCmrdCCumulativeGoodsComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subDelegation: ['', [Validators.required]],
      fromYear: ['', [Validators.required]],
      toMonth: ['', [Validators.required]],
      fromMonth: ['', [Validators.required]],
    });
  }

}
