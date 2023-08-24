import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-payment-search-process',
  templateUrl: './payment-search-process.component.html',
  styles: [],
})
export class PaymentSearchProcessComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {}

  private prepareForm(): void {
    this.form = this.fb.group({
      process: [null, [Validators.required]],
    });
  }
}
