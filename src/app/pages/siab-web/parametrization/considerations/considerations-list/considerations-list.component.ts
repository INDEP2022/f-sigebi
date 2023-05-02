import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ConsiderationFormComponent } from '../consideration-form/consideration-form.component';

@Component({
  selector: 'app-considerations-list',
  templateUrl: './considerations-list.component.html',
  styles: [],
})
export class ConsiderationsListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      column1: {
        title: 'Capitulo',
        sort: false,
      },
      column2: {
        title: 'Partida',
        sort: false,
      },
      column3: {
        title: 'Subpartida',
        sort: false,
      },
      column4: {
        title: 'SubSubpartida',
        sort: false,
      },
      column5: {
        title: 'NOM',
        sort: false,
      },
      column6: {
        title: 'Destino',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(ConsiderationFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
