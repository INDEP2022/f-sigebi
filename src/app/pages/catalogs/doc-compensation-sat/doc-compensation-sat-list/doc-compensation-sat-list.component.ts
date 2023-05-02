import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocCompesationSat } from 'src/app/core/models/catalogs/doc-compesation-sat.model';
import { DocCompensationSATService } from 'src/app/core/services/catalogs/doc-compesation-sat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocCompensationSatFormComponent } from '../doc-compensation-sat-form/doc-compensation-sat-form.component';
import { DOCCOMPENSATIONSAT_COLUMS } from './doc-compensation-sat-columns';

@Component({
  selector: 'app-doc-compensation-sat-list',
  templateUrl: './doc-compensation-sat-list.component.html',
  styles: [],
})
export class DocCompensationSatListComponent
  extends BasePage
  implements OnInit
{
  paragraphs: IDocCompesationSat[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private docCompesationSatService: DocCompensationSATService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DOCCOMPENSATIONSAT_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.docCompesationSatService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(docCompesationSat?: IDocCompesationSat) {
    let config: ModalOptions = {
      initialState: {
        docCompesationSat,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocCompensationSatFormComponent, config);
  }

  delete(docCompesationSat: IDocCompesationSat) {
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
