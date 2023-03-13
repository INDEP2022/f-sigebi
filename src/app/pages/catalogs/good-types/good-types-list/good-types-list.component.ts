import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodTypeFormComponent } from '../good-type-form/good-type-form.component';
import { GOOD_TYPES_COLUMS } from './good-types-colums';

@Component({
  selector: 'app-good-types-list',
  templateUrl: './good-types-list.component.html',
  styles: [],
})
export class GoodTypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodType[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private goodTypesService: GoodTypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_TYPES_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.goodTypesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<GoodTypeFormComponent>) {
    const modalRef = this.modalService.show(GoodTypeFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(goodType?: IGoodType) {
    this.openModal({ goodType });
  }

  delete(goodType: IGoodType) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(goodType.id);
        this.goodTypesService.remove(goodType.id).subscribe(
          res => {
            this.getExample();
          },
          err => {
            this.loading = false;
          }
        );
      }
    });
  }
}
