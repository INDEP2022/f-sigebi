import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-list-reference',
  templateUrl: './list-reference.component.html',
  styles: [],
})
export class ListReferenceComponent extends BasePage implements OnInit {
  title: string = '';
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataParams: any;
  L_IMPORTE: any;
  constructor(
    private modalRef: BsModalRef,
    private paymentService: PaymentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      // columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getFcomerC3();
  }

  rowsSelected(event: any) {}
  close() {
    this.modalRef.hide();
  }

  async getFcomerC3() {
    this.paymentService.getFcomerC3(this.L_IMPORTE).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
