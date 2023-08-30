import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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

  validSystem: any[] = [];
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataSat: any[] = [];

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

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private accountMovementService: AccountMovementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getValidSystem();
    this.getSatDec();
    this.prepareForm();
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
    console.log('payment rec ', this.payment);
  }

  private prepareForm(): void {
    this.paymentForm = this.fb.group({
      date: [null, [Validators.required]],
      referenceori: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      reference: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
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
      console.log('Resp Payment-> ', this.payment);
      this.getValidSystem2(this.payment.systemValidity);
      this.paymentForm.patchValue(this.payment);
      if (this.payment.date != null) {
        this.paymentForm
          .get('date')
          .setValue(this.formatDate(new Date(this.payment.date)));
      }
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    console.log(' 1');
    this.loading = true;
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    console.log('ValsisKey', this.paymentForm.get('systemValidity').value);
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;

    console.log('paymentForm ->', this.paymentForm.value);

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

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  formatDate2(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  getValidSystem() {
    this.paymentService.getValidSystem().subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('valid system ', resp);
          this.validSystem = resp.data;
        }
        console.log('valid system 2 ', this.validSystem);
      },
      err => {
        console.log('error', err);
      }
    );
  }

  getValidSystem2(desc?: string) {
    this.paymentService.getValidSystemDesc(desc).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('resp 2 -> ', resp.data[0]);
          this.validSystem.push(resp.data[0]);
          //this.validSystem = resp.data;
        }
        console.log('valid system 2 ', this.validSystem);
      },
      err => {
        console.log('error', err);
      }
    );
  }

  extractKey(event: any) {
    if (this.paymentForm) {
      console.log(event);

      // Buscar el elemento seleccionado en los datos
      const selectedElement = this.paymentForm
        .get('systemValidity')
        .value.data.find((element: any) => element.valsisKey === event);

      if (selectedElement) {
        const selectedKey = selectedElement.valsisKey;
        console.log('extractKey -> ', selectedKey); // valsisKey seleccionado
      }
    }
  }

  loadValueByDescription(description: string) {
    const selectedRow = this.validSystem.find(
      row => row.valsisDescription === description
    );

    if (selectedRow) {
      // Si se encuentra una fila con la descripción correspondiente, cargar el valor en el formulario
      this.paymentForm.get('systemValidity').setValue(selectedRow.valsisKey);
    }
  }

  getSatDec() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    const _params: any = params;
    //_params['filter.idType'] = `$eq:${res.data[i].idGuySat}`;
    console.log('getSatDec-> ', _params);
    this.accountMovementService.getPaymentTypeSat(_params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          this.dataSat = resp.data;
          console.log('this.dataSat ', this.dataSat);
        }
      },
      err => {}
    );
  }
}
