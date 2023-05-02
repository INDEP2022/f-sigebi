import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GuidelinesFormComponent } from '../guidelines-form/guidelines-form.component';

@Component({
  selector: 'app-guidelines-list',
  templateUrl: './guidelines-list.component.html',
  styles: [],
})
export class GuidelinesListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      capitulo: {
        title: 'ID',
        sort: false,
      },
      directriz: {
        title: 'Directriz',
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
    this.modalService.show(GuidelinesFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
