import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LigieSubDeparturesFormComponent } from '../ligie-sub-departures-form/ligie-sub-departures-form.component';

@Component({
  selector: 'app-ligie-sub-departures-list',
  templateUrl: './ligie-sub-departures-list.component.html',
  styles: [],
})
export class LigieSubDeparturesListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      capitulo: {
        title: 'Capitulo',
        sort: false,
      },
      directriz: {
        title: 'Partida',
        sort: false,
      },
      desc: {
        title: 'Subpartida',
        sort: false,
      },
      descripcion: {
        title: 'Descripción',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(LigieSubDeparturesFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
