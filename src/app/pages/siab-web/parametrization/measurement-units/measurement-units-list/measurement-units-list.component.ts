import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MeasurementUnitsFormComponent } from '../measurement-units-form/measurement-units-form.component';

@Component({
  selector: 'app-measurement-units-list',
  templateUrl: './measurement-units-list.component.html',
  styles: [],
})
export class MeasurementUnitsListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      capitulo: {
        title: 'Unidad de medida LIGIE',
        sort: false,
      },
      directriz: {
        title: 'Unidad de medida SIAB',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(MeasurementUnitsFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
