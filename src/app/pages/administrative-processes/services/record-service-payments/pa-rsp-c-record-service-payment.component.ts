import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-rsp-c-record-service-payment',
  templateUrl: './pa-rsp-c-record-service-payment.component.html',
  styles: [],
})
export class PaRspCRecordServicePaymentComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  data: any[] = [
    {
      request: 'Solictu1234',
      goodNumber: '2563',
      service: 'CVE_SERVICE+DI_DESCRIPTION',
      requestDate: '29-12-1999',
      paymentDate: 'FEC_PAGO',
      amount: '$10000000',
      isPayment: false,
    },
    {
      request: 'abc3422',
      goodNumber: '2563',
      service: 'CVE_SERVICE+DI_DESCRIPTION',
      requestDate: '29-12-2020',
      paymentDate: 'FEC_PAGO',
      amount: '$10000000',
      isPayment: true,
    },
  ];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: true },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    /*this.form.get("pb_type").valueChanges.subscribe(x => {
      console.log(x)
       this.filter(x);
    });*/
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null, [Validators.required]],
      pb_type: ['pb_lista', [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openGlobal(requestId: string) {
    //Change Routing
    this.router.navigate([
      'pages/administrative-processes/services/global',
      requestId,
    ]);
  }
}
