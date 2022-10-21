import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
//Components
import { PaPdmAspCAudienceSirsaePaymentsComponent } from '../../dispersion-payment-details/audience-sirsae-payments/pa-pdm-asp-c-audience-sirsae-payments.component';
import { PaPdmOwobCOrderWOBillingComponent } from '../../dispersion-payment-details/order-w-o-billing-audience/pa-pdm-owob-c-order-w-o-billing.component';
import { PaPdmSpCSirsaePaymentsComponent } from '../../dispersion-payment-details/sirsae-payments/pa-pdm-sp-c-sirsae-payments.component';

@Component({
  selector: 'app-pa-pdm-cbp-c-composition-batch-payments',
  templateUrl: './pa-pdm-cbp-c-composition-batch-payments.component.html',
  styles: [],
})
export class PaPdmCbpCCompositionBatchPaymentsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  lastDate: string = '29/08/2022';
  data: any[] = [
    {
      batch: '1008',
      customerTaxId: 'ACM030407M3A',
      description: 'Vehículo apto para circulación',
      status: 'VEND',
      warranty: 180000,
      advance: 50000,
      address: 'KM 1.0 Carr',
    },
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  definitive: boolean = false;
  total: number = 105666395.52;
  warranty: number = 0.0;
  amountL: number = 633983.31;

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null],
    });
  }

  add() {
    //this.openModal();
  }

  edit(data: any) {
    //console.log(data)
    //this.openModal({ edit: true, paragraph });
  }

  delete(data: any) {
    console.log(data);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  definitiveChange($event: any): void {
    //console.log(this.definitive)
  }

  sirsaePayment(): void {
    const modalRef = this.modalService.show(PaPdmSpCSirsaePaymentsComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  audienceSirsae(): void {
    const modalRef = this.modalService.show(
      PaPdmAspCAudienceSirsaePaymentsComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  audienceSirsaeOrderWOBilling(): void {
    const modalRef = this.modalService.show(PaPdmOwobCOrderWOBillingComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
