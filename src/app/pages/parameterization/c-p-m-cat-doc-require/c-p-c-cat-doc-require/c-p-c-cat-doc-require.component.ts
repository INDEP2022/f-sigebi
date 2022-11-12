import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCCatDocRequireModalComponent } from '../c-p-c-cat-doc-require-modal/c-p-c-cat-doc-require-modal.component';
import { CAT_DOC_REQUIRE_COLUMNS } from './cat-doc-require-columns';

@Component({
  selector: 'app-c-p-c-cat-doc-require',
  templateUrl: './c-p-c-cat-doc-require.component.html',
  styles: [],
})
export class CPCCatDocRequireComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...CAT_DOC_REQUIRE_COLUMNS },
    };
  }

  ngOnInit(): void {}

  openModal(context?: Partial<CPCCatDocRequireModalComponent>) {
    const modalRef = this.modalService.show(CPCCatDocRequireModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
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

  data = [
    {
      cveDoc: 501,
      description: 'Descripción 01',
      typeDic: 'Tipo de Dictamen 01',
    },
    {
      cveDoc: 503,
      description: 'Descripción 03',
      typeDic: 'Tipo de Dictamen 03',
    },
    {
      cveDoc: 504,
      description: 'Descripción 04',
      typeDic: 'Tipo de Dictamen 04',
    },
  ];
}
