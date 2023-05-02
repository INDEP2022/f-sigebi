import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { billingPaymentsModalComponent } from '../billing-payments-modal/billing-payments-modal.component';
import {
  BILLING_PAYMENTS_COLUMNS,
  BILLING_PAYMENTS_INVOICE_COLUMNS,
} from './billing-payments-colums';
import { DATA } from './data';

@Component({
  selector: 'app-billing-payments',
  templateUrl: './billing-payments.component.html',
  styles: [],
})
export class billingPaymentsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data1: LocalDataSource = new LocalDataSource();
  dataInvoice = DATA;

  data2: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  rowInvoice: string = null;
  selectedRow: any = null;

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: false,
      position: 'right',
    },
  };

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...BILLING_PAYMENTS_INVOICE_COLUMNS },
    };
    this.settings2.columns = BILLING_PAYMENTS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data1.load(this.dataInvoice);
  }

  private prepareForm() {
    this.form = this.fb.group({
      serie: [null, [Validators.required]],
      invoice: [null, [Validators.required]],
      event: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
    });
  }

  selectRow(row: any) {
    this.data2.load(row.invoices); //Sub
    this.data2.refresh();
    this.rowInvoice = row.event; //primary
    this.rowSelected = true;
  }

  openModal(context?: Partial<billingPaymentsModalComponent>) {
    const modalRef = this.modalService.show(billingPaymentsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.loading = false;
  }
}
