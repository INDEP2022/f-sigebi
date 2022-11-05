import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCQuestionCatalogModalComponent } from '../c-p-c-question-catalog-modal/c-p-c-question-catalog-modal.component';
import { QUESTION_CATALOG_COLUMNS } from './question-catalog-columns';

@Component({
  selector: 'app-c-p-c-question-catalog',
  templateUrl: './c-p-c-question-catalog.component.html',
  styles: [],
})
export class CPCQuestionCatalogComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;

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

  ngOnInit(): void {}

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<CPCQuestionCatalogModalComponent>) {
    const modalRef = this.modalService.show(CPCQuestionCatalogModalComponent, {
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
