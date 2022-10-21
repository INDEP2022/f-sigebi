import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDrawer } from 'src/app/core/models/catalogs/drawer.model';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { DrawerService } from 'src/app/core/services/catalogs/drawer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DrawerFormComponent } from '../drawer-form/drawer-form.component';
import { DRAWERS_COLUMNS } from './drawers-columns';

@Component({
  selector: 'app-drawers-list',
  templateUrl: './drawers-list.component.html',
  styles: [],
})
export class DrawersListComponent extends BasePage implements OnInit {
  paragraphs: IDrawer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private drawerService: DrawerService
  ) {
    super();
    this.settings.columns = DRAWERS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDrawers());
  }

  getDrawers() {
    this.loading = true;
    this.drawerService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(drawer?: IDrawer) {
    let config: ModalOptions = {
      initialState: {
        drawer,
        callback: (next: boolean) => {
          if (next) this.getDrawers();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DrawerFormComponent, config);
  }

  delete(drawer: IDrawer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        let { noDrawer, noBobeda } = drawer;
        const idBobeda = (noBobeda as ISafe).idSafe;
        noBobeda = idBobeda;
        this.drawerService.removeByIds({ noDrawer, noBobeda }).subscribe({
          next: data => this.getDrawers(),
          error: error => (this.loading = false),
        });
      }
    });
  }
}
