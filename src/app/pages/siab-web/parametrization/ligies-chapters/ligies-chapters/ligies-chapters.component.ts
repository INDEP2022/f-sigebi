import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LigiesChaptersFormComponent } from '../ligies-chapters-form/ligies-chapters-form.component';

@Component({
  selector: 'app-ligies-chapters',
  templateUrl: './ligies-chapters.component.html',
  styles: [],
})
export class LigiesChaptersComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      capitulo: {
        title: 'Capítulo',
        sort: false,
      },
      desc: {
        title: 'Descripción',
        sort: false,
      },
      directriz: {
        title: 'Directriz Relacionada',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(LigiesChaptersFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
