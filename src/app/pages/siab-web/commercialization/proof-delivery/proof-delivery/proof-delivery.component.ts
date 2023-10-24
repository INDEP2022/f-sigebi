import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
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

  data: LocalDataSource = new LocalDataSource();

  //Array
  dataFilter: any[] = [];

  //ngx-select
  events = new DefaultSelect();
  delegations: any[] = [];
  public: any[] = [];
  rfcs: any[] = [];

  //String
  year: string = '';

  //Number
  totalItems: number = 0;

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
    setTimeout(() => {
      this.getEvents(new ListParams());
    }, 1000);
  }

  //

  loadDataEventSelected(event: any) {
    console.log('Esto trae la seleccion: ', event);
    this.serviceInvoice.getInvoiceByEvent(event.eventId).subscribe({
      next: response => {
        this.getRrcs(this.array('rfc', response.data));
        this.getPublic(this.array('lote_publico', response.data));
        this.getDelegations(this.array('no_delegacion', response.data));
        this.fillGridInvoces(response.data);
        this.dataFilter = response.data;
        this.filterInvoices();
      },
      error: () => {
        this.events = new DefaultSelect();
        this.alert('warning', 'Advertencia', `No se encontraron registros`);
      },
    });
  }

  filterInvoices() {
    console.log('Este es el arreglo con los datos', this.dataFilter);
    if (this.dataFilter.length > 0) {
      if (this.form.controls['allotment'].value != null) {
        this.dataFilter = this.dataFilter.filter(
          f => f.lote_publico === this.form.controls['allotment'].value
        );
        console.log('El arreglo filtrado: ', this.dataFilter);
      }
      if (this.form.controls['rfc'].value != null) {
        this.dataFilter = this.dataFilter.filter(
          f => f.rfc === this.form.controls['rfc'].value
        );
        console.log('El arreglo filtrado: ', this.dataFilter);
      }
      if (this.form.controls['delegation'].value != null) {
        this.dataFilter = this.dataFilter.filter(
          f => f.no_delegacion === this.form.controls['delegation'].value
        );
        console.log('El arreglo filtrado: ', this.dataFilter);
      }
      this.fillGridInvoces(this.dataFilter);
      this.form.reset();
    }
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

  getEvents(params: ListParams) {
    params['anio'] = this.year;
    this.serviceInvoice.getInvoiceForniture(params).subscribe({
      next: data => {
        this.events = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.events = new DefaultSelect();
      },
    });
  }

  delegationChangeIndex() {
    if (this.form.controls['allotment'].value == null) {
      this.getPublic(this.array('lote_publico', this.dataFilter));
    }
    if (this.form.controls['rfc'].value == null) {
      this.getRrcs(this.array('rfc', this.dataFilter));
    }
  }

  publicChangeIndex() {
    if (this.form.controls['rfc'].value == null) {
      this.getRrcs(this.array('rfc', this.dataFilter));
    }
    if (this.form.controls['delegation'].value == null) {
      this.getDelegations(this.array('delegation', this.dataFilter));
    }
  }

  rfcChangeIndex() {
    if (this.form.controls['allotment'].value == null) {
      this.getPublic(this.array('allotment', this.dataFilter));
    }
    if (this.form.controls['delegation'].value == null) {
      this.getDelegations(this.array('delegation', this.dataFilter));
    }
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

  fillGridInvoces(data: any[]) {
    this.data.load(data);
    this.totalItems = data.length | 0;
    this.data.refresh();
    this.loading = false;
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  //
}
