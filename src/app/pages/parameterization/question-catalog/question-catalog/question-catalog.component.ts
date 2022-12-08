import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { QuestionCatalogModalComponent } from '../question-catalog-modal/question-catalog-modal.component';
import { QUESTION_CATALOG_COLUMNS } from './question-catalog-columns';

@Component({
  selector: 'app-question-catalog',
  templateUrl: './question-catalog.component.html',
  styles: [],
})
export class QuestionCatalogComponent extends BasePage implements OnInit {
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
      columns: { ...QUESTION_CATALOG_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<QuestionCatalogModalComponent>) {
    const modalRef = this.modalService.show(QuestionCatalogModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      noQuestion: 1,
      textQuestion: '¿Pregunta?',
      maxScore: 101,
      typeQuestion: 'Abierta',
      noResponse: 1,
      initValue: 1,
      resValue: 201,
      resText: 'Si',
    },
    {
      noQuestion: 2,
      textQuestion: '¿Pregunta?',
      maxScore: 102,
      typeQuestion: 'Cerrada',
      noResponse: 2,
      initValue: 2,
      resValue: 202,
      resText: 'Tal vez',
    },
    {
      noQuestion: 3,
      textQuestion: '¿Pregunta?',
      maxScore: 103,
      typeQuestion: 'Cerrada',
      noResponse: 3,
      initValue: 3,
      resValue: 203,
      resText: 'No',
    },
  ];
}
