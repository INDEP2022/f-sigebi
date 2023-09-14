import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { GoodService } from 'src/app/core/services/good/good.service';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUserRowSelectEvent } from 'src/app/core/interfaces/ng2-smart-table.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_DOCUMENTS } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/abandonments-declaration-trades/columns';

@Component({
  selector: 'app-listdocs',
  templateUrl: './listdocs.component.html',
  styles: [],
})
export class ListdocsComponent extends BasePage implements OnInit {
  @Output() dataDocs = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<true>();
  dataDocs_: any;
  settings2 = { ...this.settings };
  data2: any = [];
  selectedDocs: any[] = [];
  typeOffice: any;
  arrayOfDocsCreados: any;
  managementNumber: any;
  rulingType: any;
  IAttDocument: any;
  constructor(
    private modalRef: BsModalRef,
    private documentsService: DocumentsService,
    private mJobManagementService: MJobManagementService
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
    // this.data2 = Documents;
    let arr_11 = [];
    for (let i = 0; i < this.IAttDocument.length; i++) {
      arr_11.push(this.IAttDocument[i].cveDocument);
    }
    const arr = arr_11;
    const str = arr.join(','); // "25,26,25,28"

    console.log(this.typeOffice);
    this.getDocsParaDictum(this.typeOffice, str);
  }

  selectProceedings(event: IUserRowSelectEvent<any>) {
    console.log('EVENT', event);
    this.selectedDocs = event.selected;
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    let data = this.selectedDocs;
    console.log('aaa', this.selectedDocs);
    console.log('bb', this.arrayOfDocsCreados);

    if (this.arrayOfDocsCreados.length > 0) {
      for (let i = 0; i < this.arrayOfDocsCreados.length; i++) {
        await this.docsSeleccionados(this.arrayOfDocsCreados[i]);
      }
    } else {
      for (let i = 0; i < this.selectedDocs.length; i++) {
        // if (arrayOfDocsCreados.cveDocument != this.selectedDocs[i].key) {
        let obj = {
          managementNumber: this.managementNumber,
          cveDocument: this.selectedDocs[i].key,
          rulingType: this.rulingType,
        };
        console.log(obj);
        await this.createDocumentOficiManagement(obj);
        // }
      }
    }

    this.loading = false;
    // this.refresh.emit(true);
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  async docsSeleccionados(arrayOfDocsCreados: any) {
    for (let i = 0; i < this.selectedDocs.length; i++) {
      if (arrayOfDocsCreados.cveDocument != this.selectedDocs[i].key) {
        let obj = {
          managementNumber: arrayOfDocsCreados.managementNumber,
          cveDocument: this.selectedDocs[i].key,
          rulingType: arrayOfDocsCreados.rulingType,
        };
        console.log(obj);
        await this.createDocumentOficiManagement(obj);
      }
    }
  }

  async createDocumentOficiManagement(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.createDocumentOficeManag(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }
  getDocsParaDictum(typeOffice: any, inNot: any) {
    const params = new ListParams();
    params['filter.typeDictum'] = `$eq:${typeOffice}`;
    params['filter.key'] = `$not:$in:${inNot}`;
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
