import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatDocRequireModalComponent } from '../cat-doc-require-modal/cat-doc-require-modal.component';
import { CAT_DOC_REQUIRE_COLUMNS } from './cat-doc-require-columns';

@Component({
  selector: 'app-cat-doc-require',
  templateUrl: './cat-doc-require.component.html',
  styles: [],
})
export class CatDocRequireComponent extends BasePage implements OnInit {
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

  openModal(context?: Partial<CatDocRequireModalComponent>) {
    const modalRef = this.modalService.show(CatDocRequireModalComponent, {
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
      cveDoc: 28,
      description: 'Fecha de resolución',
      typeDic: 'ABANDONO',
    },
    {
      cveDoc: 27,
      description: 'Fecha notificación',
      typeDic: 'DECOMISO',
    },
    {
      cveDoc: 26,
      description: 'Notificación Acuerdo Aseguramiento',
      typeDic: 'DESTRUCCIÓN',
    },
  ];
}
