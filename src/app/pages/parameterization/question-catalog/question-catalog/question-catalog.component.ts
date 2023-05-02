import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { QuestionCatalogModalComponent } from '../question-catalog-modal/question-catalog-modal.component';
import { QUESTION_CATALOG_COLUMNS, RESPONSE_CATALOG_COLUMNS } from './columns';
//models
import { IQuestion } from 'src/app/core/models/catalogs/question.model';
import { IResponse } from 'src/app/core/models/catalogs/response.model';
//services
import { QuestionService } from 'src/app/core/services/catalogs/question.service';
import { ResponseService } from 'src/app/core/services/catalogs/response.service';
import { ResponseCatalogModalComponent } from '../response-catalog-modal/response-catalog-modal.component';

@Component({
  selector: 'app-question-catalog',
  templateUrl: './question-catalog.component.html',
  styles: [],
})
export class QuestionCatalogComponent extends BasePage implements OnInit {
  questionI: IQuestion[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  responseI: IResponse[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  settings2;

  constructor(
    private modalService: BsModalService,
    private questionService: QuestionService,
    private responseService: ResponseService
  ) {
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
    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...RESPONSE_CATALOG_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getQuestion());
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getResponse());
  }

  getQuestion() {
    this.loading = true;
    this.questionService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.questionI = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(questionI?: IQuestion) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      questionI,
      callback: (next: boolean) => {
        if (next) this.getQuestion();
      },
    };
    this.modalService.show(QuestionCatalogModalComponent, modalConfig);
  }

  showDeleteAlert(questionI: IQuestion) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(questionI.id);
      }
    });
  }

  delete(id: number) {
    this.questionService.remove(id).subscribe({
      next: () => this.getQuestion(),
    });
  }

  // Catálogo de Respuesta
  getResponse() {
    this.loading = true;
    this.responseService.getAll(this.params2.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.responseI = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm2(responseI?: IResponse) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      responseI,
      callback: (next: boolean) => {
        if (next) this.getResponse();
      },
    };
    this.modalService.show(ResponseCatalogModalComponent, modalConfig);
  }

  showDeleteAlert2(responseI: IResponse) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(responseI.id);
      }
    });
  }

  delete2(id: number) {
    this.responseService.remove(id).subscribe({
      next: () => this.getQuestion(),
    });
  }
}
