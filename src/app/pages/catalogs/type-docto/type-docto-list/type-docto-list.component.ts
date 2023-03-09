import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeDocto } from 'src/app/core/models/catalogs/type-docto.model';
import { TypeDoctoService } from 'src/app/core/services/catalogs/type-docto.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeDoctoFormComponent } from '../type-docto-form/type-docto-form.component';
import { TYPEDOCTO_COLUMS } from './type-docto-columns';

@Component({
  selector: 'app-type-docto-list',
  templateUrl: './type-docto-list.component.html',
  styles: [],
})
export class TypeDoctoListComponent extends BasePage implements OnInit {
  paragraphs: ITypeDocto[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private typeDoctoService: TypeDoctoService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPEDOCTO_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.typeDoctoService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeDocto?: ITypeDocto) {
    let config: ModalOptions = {
      initialState: {
        typeDocto,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeDoctoFormComponent, config);
  }

  delete(typeDocto: ITypeDocto) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.typeDoctoService.remove(typeDocto.id).subscribe({
          next: response => {
            this.onLoadToast('success', 'Exito', 'Eliminado Correctamente');
            this.getExample();
          },
          error: err => {
            this.onLoadToast('error', 'Error', 'Intente nuevamente');
          },
        });
      }
    });
  }
}
