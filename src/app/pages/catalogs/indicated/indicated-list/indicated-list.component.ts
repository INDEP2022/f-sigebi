import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IndicatedFormComponent } from '../indicated-form/indicated-form.component';
import { INDICATED_COLUMNS } from './indicated-columns';

@Component({
  selector: 'app-indicated-list',
  templateUrl: './indicated-list.component.html',
  styles: [],
})
export class IndicatedListComponent extends BasePage implements OnInit {
  paragraphs: IIndiciados[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private indicatedService: IndiciadosService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = INDICATED_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIndicated());
  }

  getIndicated() {
    this.loading = true;
    this.indicatedService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(indicated?: IIndiciados) {
    let config: ModalOptions = {
      initialState: {
        indicated,
        callback: (next: boolean) => {
          if (next) this.getIndicated();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(IndicatedFormComponent, config);
  }

  delete(indicated: IIndiciados) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.indicatedService.remove(indicated.id).subscribe({
          next: data => this.getIndicated(),
          error: error => (this.loading = false),
        });
      }
    });
  }
}
