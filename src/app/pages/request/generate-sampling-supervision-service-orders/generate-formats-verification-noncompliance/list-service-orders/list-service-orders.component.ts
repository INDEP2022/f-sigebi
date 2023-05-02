import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../../core/shared/base-page';
import { UploadExpedientServiceOrderComponent } from '../upload-expedient-service-order/upload-expedient-service-order.component';
import { SERVICE_ORDERS_COLUMNS } from './columns/service-orders-columns';

@Component({
  selector: 'app-list-service-orders',
  templateUrl: './list-service-orders.component.html',
  styles: [],
})
export class ListServiceOrdersComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() searchForm: any | null = null;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: SERVICE_ORDERS_COLUMNS,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchForm != undefined) {
      console.log(this.searchForm);
    }
  }

  rowsSelected(event: any) {
    console.log(event.selected);
  }

  searchExpedients() {
    this.openModal(UploadExpedientServiceOrderComponent, 'review-results');
  }

  openModal(component: any, data?: any, typeAnnex?: string) {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }
}
