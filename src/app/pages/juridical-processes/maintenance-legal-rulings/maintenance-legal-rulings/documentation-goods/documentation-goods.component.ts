import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentationGoodsDialogComponent } from '../dialogs/documentation-goods-dialog/documentation-goods-dialog.component';
import { DOCUMENTS_DICTUM_X_STATE } from './documentation-goods.columns';

@Component({
  selector: 'app-documentation-goods',
  templateUrl: './documentation-goods.component.html',
})
export class DocumentationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy, OnChanges
{
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: true,
      delete: false,
    },
    hideSubHeader: true,
    mode: 'external',

    columns: DOCUMENTS_DICTUM_X_STATE,
  };
  dataTable: IDocumentsDictumXStateM[] = [];

  @Input() set loadingData(value: boolean) {
    this.loading = value;
  }

  @Input() set data(value: IDocumentsDictumXStateM[]) {
    this.dataTable = value;
  }

  @Output() loadingDialog = new EventEmitter<boolean>();

  constructor(
    private documentService: DocumentsDictumStatetMService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data']) {
      if (changes['data'].currentValue.length > 0) {
        this.loading = false;
      }
    }
  }

  openForm(documentsDictumXStateM?: IDocumentsDictumXStateM) {
    let config: ModalOptions = {
      initialState: {
        documentsDictumXStateM,
        callback: (next: boolean) => {
          if (next) this.loadingDialog.emit(next);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocumentationGoodsDialogComponent, config);
  }
}
