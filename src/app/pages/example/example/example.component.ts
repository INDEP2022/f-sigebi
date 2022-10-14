import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';
import { ExampleService } from 'src/app/core/services/catalogs/example.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ExampleFormComponent } from '../example-form/example-form.component';
import { EXAMPLE_COLUMNS } from './example-columns';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styles: [],
})
export class ExampleComponent extends BasePage implements OnInit, OnDestroy {
  paragraphs: Example[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private exampleService: ExampleService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = EXAMPLE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.exampleService.getAll(this.params.getValue()).subscribe(
      response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openModal(context?: Partial<ExampleFormComponent>) {
    const modalRef = this.modalService.show(ExampleFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  add() {
    this.openModal();
  }

  edit(paragraph: Example) {
    this.openModal({ edit: true, paragraph });
  }

  delete(paragraph: Example) {
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
