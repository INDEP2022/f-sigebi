import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatDocRequireModalComponent } from '../cat-doc-require-modal/cat-doc-require-modal.component';
import { CAT_DOC_REQUIRE_COLUMNS } from './cat-doc-require-columns';
//Models
import { IDocumentsForDictum } from 'src/app/core/models/catalogs/documents-for-dictum.model';
//services
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-doc-require',
  templateUrl: './cat-doc-require.component.html',
  styles: [],
})
export class CatDocRequireComponent extends BasePage implements OnInit {
  documentsForDictum: IDocumentsForDictum[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private documentsForDictumService: DocumentsForDictumService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...CAT_DOC_REQUIRE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocumentsForDictum());
  }

  getDocumentsForDictum() {
    this.loading = true;
    this.documentsForDictumService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.documentsForDictum = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(documentsForDictum?: IDocumentsForDictum) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      documentsForDictum,
      callback: (next: boolean) => {
        if (next) this.getDocumentsForDictum();
      },
    };
    this.modalService.show(CatDocRequireModalComponent, modalConfig);
  }

  showDeleteAlert(documentsForDictum: IDocumentsForDictum) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(documentsForDictum.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.documentsForDictumService.remove(id).subscribe({
      next: () => this.getDocumentsForDictum(),
    });
  }
}
