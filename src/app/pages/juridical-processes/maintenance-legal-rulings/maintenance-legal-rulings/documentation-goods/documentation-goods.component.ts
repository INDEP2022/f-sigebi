import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCUMENTS_DICTUM_X_STATE } from './documentation-goods.columns';

@Component({
  selector: 'app-documentation-goods',
  templateUrl: './documentation-goods.component.html',
})
export class DocumentationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    mode: 'external',

    columns: DOCUMENTS_DICTUM_X_STATE,
  };
  dataTable: IDocumentsDictumXStateM[] = [];
  constructor(private documentService: DocumentsDictumStatetMService) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        this.getDocuments();
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocuments());
  }

  getDocuments() {
    this.documentService.getAll().subscribe({
      next: data => {
        this.dataTable = data.data;
        this.data.load(this.dataTable);
        this.data.refresh();
        this.loading = false;
      },
      error: data => {
        this.loading = false;
      },
    });
  }
}
