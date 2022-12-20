import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { REPORT_INVOICE_COLUMNS } from './report-invoices-columns';

@Component({
  selector: 'app-report-invoices',
  templateUrl: './report-invoices.component.html',
  styles: [],
})
export class reportInvoicesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  today: Date;
  maxDate: Date;
  minDate: Date;

  show: boolean = false;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REPORT_INVOICE_COLUMNS },
    };
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      typeCFDI: [null, [Validators.required]],
      statusInvoice: [null, [Validators.required]],
      goods: [null, [Validators.required]],
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
