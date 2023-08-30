import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFC_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PROOF_DELIVERY_COLUMNS } from './proof-delivery-columns';

@Component({
  selector: 'app-proof-delivery',
  templateUrl: './proof-delivery.component.html',
  styles: [],
})
export class proofDeliveryComponent extends BasePage implements OnInit {
  //

  form: FormGroup = new FormGroup({});

  show: boolean = false;

  data: any;

  //ngx-select
  events = new DefaultSelect();
  delegations: any[] = [];
  public: any[] = [];
  rfcs: any[] = [];

  //String
  year: string = '';

  //

  constructor(
    private fb: FormBuilder,
    private serviceInvoice: ComerInvoiceService
  ) {
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
    let date = new Date();
    let yearActual: number = date.getFullYear() - 2;
    this.year = String(yearActual);
    this.getEvents();
  }

  //

  loadDataEventSelected(event: any) {
    console.log('Esto trae la seleccion: ', event);
    this.serviceInvoice.getInvoiceByEvent(event.id_evento).subscribe({
      next: response => {
        this.getRrcs(this.array('rfc', response.data));
        this.getPublic(this.array('lote_publico', response.data));
        this.getDelegations(this.array('no_delegacion', response.data));
      },
      error: () => {
        this.events = new DefaultSelect();
      },
    });
  }

  array(variable: any, array: any[]): any[] {
    const rfcProcessed = new Set<string>();
    const arrayTwoLocal: any[] = [];

    for (const item of array) {
      if (!rfcProcessed.has(item[variable])) {
        rfcProcessed.add(item[variable]);
        arrayTwoLocal.push(item);
      }
    }

    return arrayTwoLocal;
  }

  // Get NGX-SELECT
  getEvents(params?: ListParams) {
    this.serviceInvoice.getInvoiceForniture(this.year, params).subscribe({
      next: data => {
        this.events = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.events = new DefaultSelect();
      },
    });
  }

  getDelegations(data: any) {
    this.delegations = data;
  }

  getPublic(data: any) {
    this.public = data;
  }

  getRrcs(data: any) {
    this.rfcs = data;
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      allotment: [null, [Validators.required]],
      rfc: [null, [Validators.required, Validators.pattern(RFC_PATTERN)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  //
}
