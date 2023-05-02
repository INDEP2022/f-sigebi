import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CLASSIFICATION_VEHICLE_COLUMS } from '../../reception-scheduling-service-order/columns/classification-vehicle-columns';
import { CreateClassificateVehicleFormComponent } from '../../reception-scheduling-service-order/components/create-classificate-vehicle-form/create-classificate-vehicle-form.component';

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
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() rejected: boolean;
  showClassificateVehicle: boolean = true;
  params = new BehaviorSubject<ListParams>(new ListParams());
  editButton: boolean = false;
  createVehicle: boolean = true;
  dataItem: boolean = false;
  totalItems: number = 0;
  item: any;
  data: any[] = [];

  constructor(private modalService: BsModalService) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: CLASSIFICATION_VEHICLE_COLUMS,
      selectMode: 'multi',
    };

    this.data = [
      {
        typeVehicle: 'Particular',
        sale: '1',
        donation: '0',
        destruction: '0',
      },
    ];
  }

  ngOnInit(): void {}

  selectItem(item?: any) {
    if (item.isSelected == true) {
      this.dataItem = true;
      this.createVehicle = false;
      this.item = item;
    } else {
      this.dataItem = false;
      this.createVehicle = true;
      this.item = null;
    }
  }

  formClassificateVehicle(item = this.item?.data) {
    if (item) {
      let config: ModalOptions = {
        initialState: {
          item,
          callback: (next: boolean) => {
            //if (next) this.getLabelsOkey();
          },
        },
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(CreateClassificateVehicleFormComponent, config);
    } else {
      let config: ModalOptions = {
        initialState: {
          callback: (next: boolean) => {
            //if (next) this.getLabelsOkey();
          },
        },
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(CreateClassificateVehicleFormComponent, config);
    }
  }
}
