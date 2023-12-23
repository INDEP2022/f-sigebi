import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { INoTransfer } from 'src/app/core/models/no-transfer/no-transfer';
import { NoTransferService } from 'src/app/core/services/no-transfer/no-transfer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { ModalNotTransferredComponent } from './modal-not-transferred/modal-not-transferred.component';

@Component({
  selector: 'app-goods-not-transferred',
  templateUrl: './goods-not-transferred.component.html',
  styles: [],
})
export class GoodsNotTransferredComponent extends BasePage implements OnInit {
  @Input() goodsList: any;

  @Input() requestId: number;

  private tranferService = inject(NoTransferService);

  @Output() goods = new EventEmitter<any>();
  columns: any[] = [];

  data: INoTransfer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.getAllNotTransferred();
    this.getPagination();
  }

  openModal(context?: Partial<ModalNotTransferredComponent>) {
    const modalRef = this.modalService.show(ModalNotTransferredComponent, {
      initialState: { ...context, requestId: this.requestId },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getAllNotTransferred();
      }
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

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  getAllNotTransferred() {
    const param = new FilterParams();
    param.addFilter('applicationId', this.requestId);
    const filter = param.getParams();
    this.tranferService.getAllNoTransfer(filter).subscribe({
      next: response => {
        console.log(response);
        this.data = response.data;
        this.getData();
      },
      error: error => {},
    });
  }

  getDrawers() {
    this.loading = true;
    this.getAllNotTransferred();
    this.loading = false;
  }

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Eliminado correctamente', '');
      }

      this.tranferService
        .removeNoTransfer(data.goodNumbertransferredId)
        .subscribe({
          next: data => this.getDrawers(),
          error: error => (this.loading = false),
        });
    });
  }
}
