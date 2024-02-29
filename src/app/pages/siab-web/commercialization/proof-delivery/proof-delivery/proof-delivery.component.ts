import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PROOF_DELIVERY_COLUMNS } from './proof-delivery-columns';

@Component({
  selector: 'app-proof-delivery',
  templateUrl: './proof-delivery.component.html',
  styles: [],
})
export class proofDeliveryComponent extends BasePage implements OnInit {
  //
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
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

  delegationsDe = new DefaultSelect();
  publicDe = new DefaultSelect();
  rfcsDe = new DefaultSelect();

  //String
  year: string = '';

  //Number
  totalItems: number = 0;
  event: number;
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
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    let date = new Date();
    let yearActual: number = date.getFullYear() - 2;
    this.year = String(yearActual);
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'voucherId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'publicLot':
                searchFilter = SearchFilter.EQ;
                break;
              case 'publicLot':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.loadDataEventSelected();
        }
      });
    setTimeout(() => {
      this.getEvents(new ListParams());
    }, 1000);
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      delegation: [null],
      allotment: [null],
      rfc: [null],
    });
  }

  loadDataEventSelected(event?: any) {
    this.loading = true;
    console.log('Esto trae la seleccion: ', this.form.controls['event'].value);
    this.params.getValue()[
      'filter.eventId'
    ] = `$eq:${this.form.controls['event'].value}`;

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.serviceInvoice.getInvoiceByEvent(params).subscribe({
      next: response => {
        // this.getRrcs(this.array('rfc', response.data));
        // this.getPublic(this.array('publicLot', response.data));
        // this.getDelegations(this.array('delegationNumber', response.data));
        // this.fillGridInvoces(response.data);
        this.dataFilter = response.data;
        this.data.load(this.dataFilter);
        this.totalItems = response.count;
        this.data.refresh();
        this.loading = false;
        // this.filterInvoices();
      },
      error: () => {
        this.data.load([]);
        this.totalItems = 0;
        this.data.refresh();
        this.loading = false;
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
        console.log(this.form.controls['delegation'].value);
        this.dataFilter = this.dataFilter.filter(
          f => f.descDescription === this.form.controls['delegation'].value
        );
        console.log('El arreglo filtrado: ', this.dataFilter);
      }
      this.fillGridInvoces(this.dataFilter);
      // this.form.reset();
    }
  }

  array(variable: any, array: any[]): any[] {
    const rfcProcessed = new Set<string>();
    const arrayTwoLocal: any[] = [];

    for (const item of array) {
      // if (!rfcProcessed.has(item[variable])) {
      // rfcProcessed.add(item[variable]);
      arrayTwoLocal.push(item);
      // }
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

  delegationChangeIndex(delegation: any) {
    if (this.form.controls['allotment'].value == null) {
      this.getPublic(this.array('lote_publico', this.dataFilter));
    }
    if (this.form.controls['rfc'].value == null) {
      this.getRrcs(this.array('rfc', this.dataFilter));
    }
  }

  publicChangeIndex(allotment: any) {
    if (this.form.controls['rfc'].value == null) {
      this.getRrcs(this.array('rfc', this.dataFilter));
    }
    if (this.form.controls['delegation'].value == null) {
      this.getDelegations(this.array('delegation', this.dataFilter));
    }
  }

  rfcChangeIndex(rfc: any) {
    if (this.form.controls['allotment'].value == null) {
      this.getPublic(this.array('allotment', this.dataFilter));
    }
    if (this.form.controls['delegation'].value == null) {
      this.getDelegations(this.array('delegation', this.dataFilter));
    }
  }

  getDelegations(data: any) {
    console.log(data);
    this.delegations = data;
    this.delegationsDe = new DefaultSelect(
      this.delegations,
      this.delegations.length
    );
    console.log(this.delegationsDe);
  }

  getPublic(data: any) {
    this.public = data;
    this.publicDe = new DefaultSelect(this.public, this.public.length);
  }

  getRrcs(data: any) {
    this.rfcs = data;
    this.rfcsDe = new DefaultSelect(this.rfcs, this.rfcs.length);
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
  clear() {
    this.form.reset();
    this.data.load([]);
    this.totalItems = 0;
    this.data.refresh();
    this.columnFilters = [];
    this.params = new BehaviorSubject<ListParams>(new ListParams());
  }

  //
}
