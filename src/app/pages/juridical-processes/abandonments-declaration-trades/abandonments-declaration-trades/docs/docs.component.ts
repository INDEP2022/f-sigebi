import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { GoodService } from 'src/app/core/services/good/good.service';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUserRowSelectEvent } from 'src/app/core/interfaces/ng2-smart-table.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_DOCUMENTS } from '../columns';
import { Documents } from '../models';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styles: [],
})
export class DocsComponent extends BasePage implements OnInit {
  @Output() dataDocs = new EventEmitter<any>();
  dataDocs_: any;
  settings2 = { ...this.settings };
  data2: any = [];
  selectedDocs: any[] = [];
  constructor(
    private modalRef: BsModalRef,
    private documentsService: DocumentsService
  ) {
    super();
    this.settings2 = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...COLUMNS_DOCUMENTS },
    };
  }

  ngOnInit(): void {
    this.data2 = Documents;
    // this.getDocsParaDictum();
  }

  selectProceedings(event: IUserRowSelectEvent<any>) {
    console.log('EVENT', event);
    this.selectedDocs = event.selected;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let data = this.selectedDocs;

    this.loading = false;
    // this.refresh.emit(true);
    this.dataDocs.emit(data);
    this.modalRef.hide();
  }

  getDocsParaDictum() {
    const params = new ListParams();
    params['filter.key'] = `$in:25,26,27,28`;
    this.documentsService.getDocParaDictum(params).subscribe({
      next: (resp: any) => {
        this.data2 = resp.data;
        this.loading = false;
      },
      error: error => {
        console.log('error DOCS PARA DICTUM', error.error.message);
        this.loading = false;
      },
    });
  }
}
