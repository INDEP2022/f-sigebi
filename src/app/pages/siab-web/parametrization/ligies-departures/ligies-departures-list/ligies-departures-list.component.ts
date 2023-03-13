import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LigiesDeparturesFormComponent } from '../ligies-departures-form/ligies-departures-form.component';

@Component({
  selector: 'app-ligies-departures-list',
  templateUrl: './ligies-departures-list.component.html',
  styles: [],
})
export class LigiesDeparturesListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      capitulo: {
        title: 'Capítulo',
        sort: false,
      },
      directriz: {
        title: 'Partida',
        sort: false,
      },
      desc: {
        title: 'Descripción',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(LigiesDeparturesFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
