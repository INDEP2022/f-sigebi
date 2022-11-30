import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { PROOF_DELIVERY_COLUMNS } from './proof-delivery-columns';

@Component({
  selector: 'app-sw-comer-c-proof-delivery',
  templateUrl: './sw-comer-c-proof-delivery.component.html',
  styles: [],
})
export class SwComerCProofDeliveryComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  show: boolean = false;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...PROOF_DELIVERY_COLUMNS },
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  data: any;
}
