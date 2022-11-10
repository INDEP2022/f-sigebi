import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCCatDepositoryPaymentModalComponent } from '../c-p-c-cat-depository-payment-modal/c-p-c-cat-depository-payment-modal.component';
import { CAT_DEPOSITORY_PAY_COLUMNS } from './cat-depository-payment-columns';

@Component({
  selector: 'app-c-p-c-cat-depository-payment',
  templateUrl: './c-p-c-cat-depository-payment.component.html',
  styles: [],
})
export class CPCCatDepositoryPaymentComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...CAT_DEPOSITORY_PAY_COLUMNS },
    };
  }

  ngOnInit(): void {}

  openModal(context?: Partial<CPCCatDepositoryPaymentModalComponent>) {
    const modalRef = this.modalService.show(
      CPCCatDepositoryPaymentModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  data = [
    {
      payConcept: 'CONCEPTO DE PAGO 01',
      description: 'DESCRIPCIÓN 01',
    },
    {
      payConcept: 'CONCEPTO DE PAGO 02',
      description: 'DESCRIPCIÓN 02',
    },
    {
      payConcept: 'CONCEPTO DE PAGO 03',
      description: 'DESCRIPCIÓN 03',
    },
    {
      payConcept: 'CONCEPTO DE PAGO 04',
      description: 'DESCRIPCIÓN 04',
    },
  ];
}
