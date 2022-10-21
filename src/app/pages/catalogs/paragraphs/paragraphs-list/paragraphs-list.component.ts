import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { ParagraphsFormComponent } from '../paragraphs-form/paragraphs-form.component';
import { IParagraph } from './../../../../core/models/catalogs/paragraph.model';
import { ParagraphService } from './../../../../core/services/catalogs/paragraph.service';
import { PARAGRAPHS_COLUMNS } from './paragraphs-columns';

@Component({
  selector: 'app-paragraphs-list',
  templateUrl: './paragraphs-list.component.html',
  styles: [],
})
export class ParagraphsListComponent extends BasePage implements OnInit {
  columns: IParagraph[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private paragraphService: ParagraphService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PARAGRAPHS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.paragraphService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<ParagraphsFormComponent>) {
    const modalRef = this.modalService.show(ParagraphsFormComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(paragraph?: IParagraph) {
    this.openModal({ paragraph });
  }

  delete(batch: IParagraph) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
