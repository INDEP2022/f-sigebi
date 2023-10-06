import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
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

  // #region Vars
  // Form
  form: FormGroup = new FormGroup({});

  // Boolean
  show: boolean = false;

  // Table
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  count: number = 0;

  //Array
  dataFilter: any[] = [];

  //ngx-select
  events = new DefaultSelect();
  delegations: any[] = [];
  public: any[] = [];
  rfcs: any[] = [];

  //String
  year: string = '';
  //#endregion

  //

  constructor(
    private fb: FormBuilder,
    private serviceInvoice: ComerInvoiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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

    // Paginated
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.loadDataEventSelected();
    });
  }

  //

  loadDataEventSelected(event?: any) {
    let params = {
      ...this.params.getValue(),
    };
    params[
      'filter.eventId'
    ] = `$eq:${this.form.controls['event'].value?.id_evento}`;
    this.serviceInvoice.getInvoiceByEvent(params).subscribe({
      next: response => {
        this.getRrcs(this.array('rfc', response.data));
        this.getPublic(this.array('publicLot', response.data));
        this.getDelegations(this.array('descDescription', response.data));
        this.fillGridInvoces(response.data, response.count);
        this.dataFilter = response.data;
        this.count = response.count | 0;
        this.filterInvoices();
      },
      error: () => {
        this.events = new DefaultSelect();
        if (event?.id_evento != null && event.id_evento != undefined) {
          this.alert('warning', 'Advertencia', `No se encontraron registros`);
        }
      },
    });
  }

  loadDataFilter() {
    this.getInvoice(
      this.form.controls['delegation'].value,
      this.form.controls['allotment'].value,
      this.form.controls['rfc'].value
    );
  }

  getInvoice(filterOne?: any, filterTwo?: any, filterThree?: any) {
    let responseLocal: any;
    let params = {
      ...this.params.getValue(),
    };
    params[
      'filter.eventId'
    ] = `$eq:${this.form.controls['event'].value?.id_evento}`;
    if (filterOne != null && filterOne != undefined) {
      params['filter.descDescription'] = `$eq:${filterOne}`;
    }
    if (filterTwo != null && filterTwo != undefined) {
      params['filter.publicLot'] = `$eq:${filterTwo}`;
    }
    if (filterThree != null && filterThree != undefined) {
      params['filter.rfc'] = `$eq:${filterThree}`;
    }
    this.serviceInvoice.getInvoiceByEvent(params).subscribe({
      next: response => {
        this.fillGridInvoces(response.data, response.count);
      },
      error: error => () => {
        this.events = new DefaultSelect();
        if (error.error.statusCode == 400) {
          this.alert('warning', 'Advertencia', `No se encontraron registros`);
        }
      },
    });
    return responseLocal;
  }

  filterInvoices() {
    if (this.dataFilter.length > 0) {
      if (this.form.controls['allotment'].value != null) {
        this.dataFilter = this.dataFilter.filter(
          f => f.lote_publico === this.form.controls['allotment'].value
        );
      }
      if (this.form.controls['rfc'].value != null) {
        this.dataFilter = this.dataFilter.filter(
          f => f.rfc === this.form.controls['rfc'].value
        );
      }
      if (this.form.controls['delegation'].value != null) {
        this.dataFilter = this.dataFilter.filter(
          f => f.no_delegacion === this.form.controls['delegation'].value
        );
      }
      this.fillGridInvoces(this.dataFilter, this.count);
      this.form.get('delegation').reset();
      this.form.get('allotment').reset();
      this.form.get('rfc').reset();
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

  delegationChangeIndex() {
    if (this.form.controls['allotment'].value == null) {
      this.getPublic(this.array('publicLot', this.dataFilter));
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
      this.getDelegations(this.array('descDescription', this.dataFilter));
    }
  }

  rfcChangeIndex() {
    if (this.form.controls['allotment'].value == null) {
      this.getPublic(this.array('publicLot', this.dataFilter));
    }
    if (this.form.controls['delegation'].value == null) {
      this.getDelegations(this.array('descDescription', this.dataFilter));
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

  fillGridInvoces(data: any[], count: number) {
    this.data.load(data);
    this.totalItems = count | 0;
    this.data.refresh();
    this.loading = false;
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
  }

  resetForm() {
    this.form.get('delegation').reset();
    this.form.get('allotment').reset();
    this.form.get('rfc').reset();
  }

  //
}
