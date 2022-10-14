import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodSsubtypesFormComponent } from '../good-ssubtypes-form/good-ssubtypes-form.component';
import { GOOD_SSUBTYPES_COLUMNS } from './good-ssubtype-columns';

@Component({
  selector: 'app-good-ssubtypes-list',
  templateUrl: './good-ssubtypes-list.component.html',
  styles: [],
})
export class GoodSsubtypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodSsubType[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private goodSsubtypeService: GoodSsubtypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SSUBTYPES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodSsubtypes());
  }

  getGoodSsubtypes() {
    this.loading = true;
    this.goodSsubtypeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(goodSsubtype?: IGoodSsubType) {
    let config: ModalOptions = {
      initialState: {
        goodSsubtype,
        callback: (next: boolean) => {
          if (next) this.getGoodSsubtypes();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodSsubtypesFormComponent, config);
  }

  delete(goodSsubtype: IGoodSsubType) {
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
