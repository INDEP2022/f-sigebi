import { Component, OnInit } from '@angular/core';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocCompensationSatXml } from 'src/app/core/models/catalogs/doc-compensation-sat-xml.model';
import { DocCompensationSatXmlService } from 'src/app/core/services/catalogs/doc-compensation-sat-xml.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocCompensationSatXmlFormComponent } from '../doc-compensation-sat-xml-form/doc-compensation-sat-xml-form.component';
import { COMPENSATION_COLUMNS } from './doccompensationsatxml-columns';

@Component({
  selector: 'app-doc-compensation-sat-xml-list',
  templateUrl: './doc-compensation-sat-xml-list.component.html',
  styles: [],
})
export class DocCompensationSatXmlListComponent
  extends BasePage
  implements OnInit
{
  paragraphs: IDocCompensationSatXml[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private docConpensation: DocCompensationSatXmlService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = COMPENSATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.docConpensation.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(compensationSatXml?: IDocCompensationSatXml) {
    let config: ModalOptions = {
      initialState: {
        compensationSatXml,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocCompensationSatXmlFormComponent, config);
  }

  delete(compensationSatXml: IDocCompensationSatXml) {
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
