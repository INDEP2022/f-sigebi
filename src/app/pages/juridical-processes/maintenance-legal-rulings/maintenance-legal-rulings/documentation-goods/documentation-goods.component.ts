import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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

  constructor(
    private documentService: DocumentsDictumStatetMService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.loading = true;
    // this.data1
    //   .onChanged()
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(change => {
    //     this.getDocuments();
    //   });
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getDocuments());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data']) {
      if (changes['data'].currentValue.length > 0) {
        this.loading = false;
      }
    }
  }

  // getDocuments() {
  //   this.documentService.getAll(new ListParams()).subscribe({
  //     next: data => {
  //       this.dataTable = data.data;
  //       this.data.load(this.dataTable);
  //       this.totalItems = data.count || 0;
  //       this.data.refresh();
  //       this.loading = false;
  //     },
  //     error: data => {
  //       this.loading = false;
  //     },
  //   });
  // }

  openForm(documentsDictumXStateM?: IDocumentsDictumXStateM) {
    let config: ModalOptions = {
      initialState: {
        documentsDictumXStateM,
        callback: (next: boolean) => {
          // if (next) this.getDocuments();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocumentationGoodsDialogComponent, config);
  }
}
