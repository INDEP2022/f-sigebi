import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { COLUMNS } from './columns';
import { PaymentGlobComponent } from './payment-glob/payment-glob.component';

@Component({
  selector: 'app-payment-services-good',
  templateUrl: './payment-services-good.component.html',
  styleUrls: ['./payment-services-good.component.scss'],
})
export class PaymentServicesGoodComponent
  extends BasePageWidhtDinamicFiltersExtra
  implements OnInit
{
  constructor(
    private modalService: BsModalService,
    private dataService: PaymentServicesService
  ) {
    super();
    this.service = this.dataService;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: {
        ...COLUMNS,
      },
    };
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  regGlobalPayment() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ti_fecha_global: new Date(),
      callback: (next: boolean) => {
        if (next) {
          // this.getData();
        }
      },
    };
    this.modalService.show(PaymentGlobComponent, modalConfig);
  }
}
