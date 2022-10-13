import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-c-b-dp-c-dispersion-payment',
  templateUrl: './c-b-dp-c-dispersion-payment.component.html',
  styles: [],
})
export class CBDpCDispersionPaymentComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  statusEvent: string = 'Conciliado a SIRSAE';
  eventType: string = 'Adjudicación Directa';
  eventManagement: string = 'Inmuebles';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
    });
  }
}
