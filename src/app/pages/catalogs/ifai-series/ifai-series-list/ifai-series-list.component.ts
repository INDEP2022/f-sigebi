import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIfaiSerie } from 'src/app/core/models/catalogs/ifai-serie.model';
import { IfaiSerieService } from 'src/app/core/services/catalogs/ifai-serie.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IfaiSeriesFormComponent } from '../ifai-series-form/ifai-series-form.component';
import { IFAI_SERIE_COLUMNS } from './ifai-serie-columns';

@Component({
  selector: 'app-ifai-series-list',
  templateUrl: './ifai-series-list.component.html',
  styles: [],
})
export class IfaiSeriesListComponent extends BasePage implements OnInit {
  paragraphs: IIfaiSerie[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private ifaiSerieService: IfaiSerieService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = IFAI_SERIE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.ifaiSerieService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(ifaiSerie?: IIfaiSerie) {
    console.log(ifaiSerie);
    let config: ModalOptions = {
      initialState: {
        ifaiSerie,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(IfaiSeriesFormComponent, config);
  }

  delete(ifaiSerie: IIfaiSerie) {
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
