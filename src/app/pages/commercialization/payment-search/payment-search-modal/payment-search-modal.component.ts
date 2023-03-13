import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-payment-search-modal',
  templateUrl: './payment-search-modal.component.html',
  styles: [],
})
export class PaymentSearchModalComponent extends BasePage implements OnInit {
  paymentForm: FormGroup = new FormGroup({});
  title: string = 'Pago';
  edit: boolean = false;
  maxDate = new Date();
  payment: any;
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  @Output() refresh = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  eventsTestData: any[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ];

  batchesTestData: any[] = [
    {
      id: 1,
      description: 'BANAMEX',
    },
    {
      id: 2,
      description: 'BANCO SANTANDER',
    },
    {
      id: 3,
      description: 'BANORTE',
    },
    {
      id: 4,
      description: 'HSBC',
    },
    {
      id: 5,
      description: 'BBVA BANCOMER',
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
  }

  private prepareForm(): void {
    this.paymentForm = this.fb.group({
      date: [null, [Validators.required]],
      originalReference: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      reference: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      cve: [null, [Validators.required]],
      code: [null, [Validators.required]],
      publicBatch: [null, [Validators.required]],
      event: [null, [Validators.required]],
      systemValidity: [null, [Validators.required]],
      result: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      paymentId: [null, [Validators.required]],
      batchId: [null, [Validators.required]],
      entryOrderId: [null, [Validators.required]],
      satDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      type: [null, [Validators.required]],
      inconsistencies: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.payment != null) {
      this.edit = true;
      this.paymentForm.patchValue(this.payment);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    // const message: string = this.edit ? 'Actualizado' : 'Guardado';
    // this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.edit
      ? this.onEdit.emit({
          newData: this.paymentForm.value,
          oldData: this.payment,
        })
      : this.onAdd.emit(this.paymentForm.value);
    this.modalRef.hide();
  }

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.eventsTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  getBatches(params: ListParams) {
    if (params.text == '') {
      this.batchItems = new DefaultSelect(this.batchesTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.batchesTestData.filter((i: any) => i.id == id)];
      this.batchItems = new DefaultSelect(item[0], 1);
    }
  }
}
