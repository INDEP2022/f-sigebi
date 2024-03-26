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
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { NoTransferService } from 'src/app/core/services/no-transfer/no-transfer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { ModalNotTransferredComponent } from './modal-not-transferred/modal-not-transferred.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-goods-not-transferred',
  templateUrl: './goods-not-transferred.component.html',
  styles: [],
})
export class GoodsNotTransferredComponent extends BasePage implements OnInit {
  @Input() goodsList: any;

  @Input() requestId: number;
  title = 'Bienes no transferidos';

  @Input() readonly: boolean = false;
  private tranferService = inject(NoTransferService);

  @Output() goods = new EventEmitter<any>();
  columns: any[] = [];

  data: INoTransfer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  typeRelevant: any[] = [];
  unitMessure: any[] = [];
  process = null;

  constructor(
    private modalService: BsModalService,
    private typeRelevantService: TypeRelevantService,
    private unitMessureService: StrategyServiceService,
    private route: ActivatedRoute,
  ) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.getTypeRelevant(new ListParams());

    if (this.readonly) {
      this.settings.actions = null;
      this.settings.edit = null;
      this.settings.delete = null;
    } else {
      this.settings.actions.delete = true;
    }

    this.process = this.route.snapshot.paramMap.get('process');
    if (this.process != 'register-abandonment-instruction' ||
      this.process != 'approve-abandonment') {
      this.title = 'Bienes transferentes faltantes';
    }

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
        this.data = response.data;
        this.data.forEach((e: any) => {
          e.strRelevant = this.typeRelevant.find(
            x => x.id === e.relevantType
          )?.description;
          e.strUnit = this.unitMessure.find(
            x => x.nbCode === e.unitExtent
          )?.description;
        });
        this.getData();
      },
      error: error => { },
    });
  }

  getDrawers() {
    this.loading = true;
    this.getData();
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

        this.tranferService
          .removeNoTransfer(data.goodNumbertransferredId)
          .subscribe({
            next: response => {
              this.data = response.data;

              this.getAllNotTransferred();
            },
            error: error => (this.loading = false),
          });
      }
    });
  }

  getTypeRelevant(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.typeRelevant = data.data;
        this.getCatalogUnit(params);
      },
    });
  }

  getCatalogUnit(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    params['limit'] = 100;
    this.unitMessureService.getMedUnits(params).subscribe({
      next: data => {
        this.unitMessure = data.data;
        this.getAllNotTransferred();
        this.getPagination();
      },
    });
  }
}
