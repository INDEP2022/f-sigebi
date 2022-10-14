import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeRelevant } from 'src/app/core/models/catalogs/type-relevant.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeRelevantFormComponent } from '../type-relevant-form/type-relevant-form.component';
import { TYPERELEVANT_COLUMS } from './type-relevant-columns';

@Component({
  selector: 'app-type-relevant-list',
  templateUrl: './type-relevant-list.component.html',
  styles: [],
})
export class TypeRelevantListComponent extends BasePage implements OnInit {
  paragraphs: ITypeRelevant[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private typeRelevantService: TypeRelevantService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPERELEVANT_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.typeRelevantService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeRelevant?: ITypeRelevant) {
    let config: ModalOptions = {
      initialState: {
        typeRelevant,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeRelevantFormComponent, config);
  }

  delete(typeRelevant: ITypeRelevant) {
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
