import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-expense-comercial',
  templateUrl: './expense-comercial.component.html',
  styleUrls: ['./expense-comercial.component.scss'],
})
export class ExpenseComercialComponent implements OnInit {
  @Input() address: string;
  form: FormGroup;
  toggleInformation = true;
  constructor(private fb: FormBuilder) {
    this.prepareForm();
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }
  get paymentRequestNumber() {
    return this.form.get('paymentRequestNumber');
  }

  get idOrdinginter() {
    return this.form.get('idOrdinginter');
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }
  get lotNumber() {
    return this.form.get('lotNumber');
  }
  get folioAtnCustomer() {
    return this.form.get('folioAtnCustomer');
  }

  get dateOfResolution() {
    return this.form.get('dateOfResolution');
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get descurcoord() {
    return this.form.get('descurcoord');
  }

  ngOnInit() {}

  private prepareForm() {
    this.form = this.fb.group({
      expenseNumber: [
        null,
        [Validators.required, Validators.pattern(NUM_POSITIVE)],
      ],
      conceptNumber: [null, [Validators.required]],
      paymentRequestNumber: [null, [Validators.pattern(NUM_POSITIVE)]],
      idOrdinginter: [null, [Validators.pattern(NUM_POSITIVE)]],
      eventNumber: [null],
      lotNumber: [null],
      folioAtnCustomer: [null, [Validators.pattern(NUM_POSITIVE)]],
      dateOfResolution: [null],
      clkpv: [null],
      descurcoord: [null],
    });
  }

  get pathEvent() {
    return (
      'prepareevent/api/v1/comer-event/getProcess' +
      (this.address ? '?filter.id=' + this.address : '')
    );
  }

  get pathLote() {
    return (
      'lot/api/v1/eat-lots?filter.idStatusVta=PAG' +
      (this.eventNumber && this.eventNumber.value
        ? '&filter.idEvent=' + this.eventNumber.value
        : '')
    );
  }
}
