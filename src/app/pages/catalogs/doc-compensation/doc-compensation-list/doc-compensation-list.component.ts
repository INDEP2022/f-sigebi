import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocCompensation } from 'src/app/core/models/catalogs/doc-compensation.model';
import { DocCompensationService } from 'src/app/core/services/catalogs/doc-compensation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { DocCompensationFormComponent } from '../doc-compensation-form/doc-compensation-form.component';
import { DOC_COMPENSATION_COLUMNNS } from './doc-compensation-columns';

@Component({
  selector: 'app-doc-compensation-list',
  templateUrl: './doc-compensation-list.component.html',
  styles: [],
})
export class DocCompensationListComponent extends BasePage implements OnInit {
  docCompensation: IDocCompensation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private docCompensationService: DocCompensationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DOC_COMPENSATION_COLUMNNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocCompensation());
  }

  getDocCompensation() {
    this.loading = true;
    this.docCompensationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.docCompensation = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(docCompensation?: IDocCompensation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      docCompensation,
      callback: (next: boolean) => {
        if (next) this.getDocCompensation();
      },
    };
    this.modalService.show(DocCompensationFormComponent, modalConfig);
  }

  showDeleteAlert(docCompensation: IDocCompensation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(docCompensation.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.docCompensationService.remove(id).subscribe({
      next: () => this.getDocCompensation(),
    });
  }
}
