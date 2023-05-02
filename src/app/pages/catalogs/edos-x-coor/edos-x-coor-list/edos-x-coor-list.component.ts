import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IEdosXCoor } from 'src/app/core/models/catalogs/edos-x-coor.model';
import { EdosXCoorService } from 'src/app/core/services/catalogs/edos-x-coor.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EdosXCoorFormComponent } from '../edos-x-coor-form/edos-x-coor-form.component';
import { EDOSXCOOR_COLUMS } from './edos-x-coor-columns';

@Component({
  selector: 'app-edos-x-coor-list',
  templateUrl: './edos-x-coor-list.component.html',
  styles: [],
})
export class EdosXCoorListComponent extends BasePage implements OnInit {
  paragraphs: IEdosXCoor[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private edosXCoorService: EdosXCoorService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = EDOSXCOOR_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.edosXCoorService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(edosXCoor?: IEdosXCoor) {
    let config: ModalOptions = {
      initialState: {
        edosXCoor,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(EdosXCoorFormComponent, config);
  }

  delete(edosXCoor: IEdosXCoor) {
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
