import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CLASSIFICATION_VEHICLE_COLUMS } from '../../columns/classification-vehicle-columns';
import { CreateClassificateVehicleFormComponent } from '../create-classificate-vehicle-form/create-classificate-vehicle-form.component';

@Component({
  selector: 'app-classificate-vehicle-form',
  templateUrl: './classificate-vehicle-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class ClassificateVehicleFormComponent
  extends BasePage
  implements OnInit
{
  showClassificateVehicle: boolean = true;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: any[] = [];
  constructor(private modalService: BsModalService) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: CLASSIFICATION_VEHICLE_COLUMS,
    };
  }

  ngOnInit(): void {}

  newClassificateVehicle() {
    let config = { ...MODAL_CONFIG, class: 'modal-sm modal-dialog-centered' };
    config.initialState = {
      callback: (data: any) => {
        if (data) console.log(data);
      },
    };
    const classificateVehicle = this.modalService.show(
      CreateClassificateVehicleFormComponent,
      config
    );
  }

  editClassificateVehicle() {
    let config = { ...MODAL_CONFIG, class: 'modal-sm modal-dialog-centered' };
    config.initialState = {
      callback: (data: any) => {
        if (data) console.log(data);
      },
    };
    const classificateVehicle = this.modalService.show(
      CreateClassificateVehicleFormComponent,
      config
    );
  }
}
