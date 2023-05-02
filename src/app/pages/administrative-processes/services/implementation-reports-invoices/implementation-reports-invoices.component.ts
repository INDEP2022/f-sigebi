import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  IMPLEMENTATION_COLUMNS,
  INVOICE_COLUMNS,
} from './implementation-reports-invoices-columns';

@Component({
  selector: 'app-implementation-reports-invoices',
  templateUrl: './implementation-reports-invoices.component.html',
  styles: [],
})
export class ImplementationReportsInvoicesComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };
  invoiceDetailsForm: ModelForm<any>;
  delegationForm: ModelForm<any>;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...IMPLEMENTATION_COLUMNS },
    };
    this.settings2.columns = INVOICE_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.invoiceDetailsForm = this.fb.group({
      invoice: [null, Validators.required],
      dateInvoice: [null, Validators.required],
      quantity: [null, Validators.required],
      status: [null, Validators.required],
      captureDate: [null, Validators.required],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      scanFolio: [null, Validators.required],
    });
    this.delegationForm = this.fb.group({
      number: [null, Validators.required],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
