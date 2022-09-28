import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/example';
import { ExampleService } from 'src/app/core/services/example.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ExampleFormComponent } from '../example-form/example-form.component';
import { EXAMPLE_COLUMNS } from './example-columns';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styles: [],
})
export class ExampleComponent extends BasePage implements OnInit {
  loading: boolean = false;
  settings = TABLE_SETTINGS;
  params: ListParams = new ListParams();
  paragraphs: Example[] = [];
  bsModalRef?: BsModalRef;
  totalItems: number = 0;

  constructor(
    private exampleService: ExampleService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = EXAMPLE_COLUMNS;
    this.settings.actions.delete = true;
  }

  add() {
    this.openModal();
  }

  edit(paragraph: Example) {
    this.openModal({ edit: true, paragraph });
  }

  delete(paragraph: Example) {
    this.alertQuestion('warning', 'Eliminar', 'Desea eliminar este registro?').then((question) => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  openModal(context?: Partial<ExampleFormComponent>) {
    const modalRef = this.modalService.show(ExampleFormComponent, {
      initialState: context, class: 'modal-md modal-dialog-centered', ignoreBackdropClick: true
    });
    modalRef.content.refresh.subscribe((next) => {
      if (next) this.getExample();
    });
  }

  ngOnInit(): void {
    this.getExample();
  }

  getExample() {
    this.loading = true;
    this.exampleService.getAll(this.params).subscribe(
      (response) => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      (error) => (this.loading = false)
    );
  }

  pageChanged(event: PageChangedEvent) {
    this.params.inicio = event.page;
    this.getExample();
  }

  search(term: string) {
    this.params.text = term;
    this.getExample();
  }
}
