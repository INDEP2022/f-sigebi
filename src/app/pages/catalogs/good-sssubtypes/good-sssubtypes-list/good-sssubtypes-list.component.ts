import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodSssubtypesFormComponent } from '../good-sssubtypes-form/good-sssubtypes-form.component';
import { GOOD_SSSUBTYPE_COLUMNS } from './good-sssubtype-columns';

@Component({
  selector: 'app-good-sssubtypes-list',
  templateUrl: './good-sssubtypes-list.component.html',
  styles: [],
})
export class GoodSssubtypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodSssubtype[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private goodSssubtypeService: GoodSssubtypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SSSUBTYPE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodSssubtypes());
  }

  getGoodSssubtypes() {
    this.loading = true;
    this.goodSssubtypeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(goodSssubtype?: IGoodSssubtype) {
    let config: ModalOptions = {
      initialState: {
        goodSssubtype,
        callback: (next: boolean) => {
          if (next) this.getGoodSssubtypes();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodSssubtypesFormComponent, config);
  }

  delete(goodSssubtype: IGoodSssubtype) {
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
