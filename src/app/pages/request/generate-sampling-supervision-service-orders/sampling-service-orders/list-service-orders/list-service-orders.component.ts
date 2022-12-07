import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../../core/shared/base-page';
import { UploadExpedientServiceOrderFormComponent } from '../upload-expedient-service-order-form/upload-expedient-service-order-form.component';
import { LIST_ORDERS_SELECTED_COLUMNS } from './columns/list-orders-selected-columns';

@Component({
  selector: 'app-list-service-orders',
  templateUrl: './list-service-orders.component.html',
  styles: [],
})
export class ListServiceOrdersComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() orders: any[];
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  rowSelected: any[] = [];

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ORDERS_SELECTED_COLUMNS,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paragraphs.load(this.orders);
  }

  rowsSelected(event: any) {
    this.rowSelected = event.selected;
  }

  eliminar() {
    for (let i = 0; i < this.rowSelected.length; i++) {
      let value = this.rowSelected[i];
      let index = this.orders.indexOf(value);
      this.paragraphs['data'].splice(index, 1);
    }

    this.paragraphs.refresh();
  }

  uploadExpedient() {
    this.openModal(UploadExpedientServiceOrderFormComponent, '');
  }

  openModal(component: any, typeComponent?: string) {
    let config: ModalOptions = {
      initialState: {
        data: '',
        typeComponent: typeComponent,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }
}
