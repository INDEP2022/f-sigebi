import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LigieMeasurementUnitsFormComponent } from '../ligie-measurement-units-form/ligie-measurement-units-form.component';

@Component({
  selector: 'app-ligie-measurement-units-list',
  templateUrl: './ligie-measurement-units-list.component.html',
  styles: [],
})
export class LigieMeasurementUnitsListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      directriz: {
        title: 'Unidad',
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
    this.modalService.show(LigieMeasurementUnitsFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
