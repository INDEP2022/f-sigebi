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
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import {
  IDataDocumentosBien,
  IDocumentsDictumXStateM,
} from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
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
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: false,
      add: false,
      position: 'left',
    },
    columns: { ...DOCUMENTS_DICTUM_X_STATE },
    noDataMessage: 'No se encontrarón registros',
  };

  dataTable: IDocumentsDictumXStateM[] = [];
  @Input() dictation: IDictation;

  @Input() set loadingData(value: boolean) {
    this.loading = value;
  }

  @Input() set data(value: IDataDocumentosBien) {
    this.dataTable = value?.data;
    this.totalItems = value?.count || 0;
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
      if (changes['data']?.currentValue?.length > 0) {
        this.loading = false;
      }
    }
  }

  openForm(documentsDictumXStateM?: IDocumentsDictumXStateM) {
    let config: ModalOptions = {
      initialState: {
        dataCreate: this.dictation
          ? {
              officialNumber: this.dictation.id,
              typeDictum: this.dictation.typeDict,
            }
          : null,
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
