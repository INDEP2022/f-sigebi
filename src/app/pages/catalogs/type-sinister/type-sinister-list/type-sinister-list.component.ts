import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeSiniester } from 'src/app/core/models/catalogs/type-siniester.model';
import { TypeSiniesterService } from 'src/app/core/services/catalogs/type-siniester.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeSinisterFormComponent } from '../type-sinister-form/type-sinister-form.component';
import { TYPESINISTER_COLUMS } from './type-sinister-columns';

@Component({
  selector: 'app-type-sinister-list',
  templateUrl: './type-sinister-list.component.html',
  styles: [],
})
export class TypeSinisterListComponent extends BasePage implements OnInit {
  paragraphs: ITypeSiniester[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private typeSinisterService: TypeSiniesterService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPESINISTER_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.typeSinisterService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeSiniester?: ITypeSiniester) {
    let config: ModalOptions = {
      initialState: {
        typeSiniester,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeSinisterFormComponent, config);
  }

  delete(typeSiniester: ITypeSiniester) {
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
