import { Component, inject, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
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
  data = new LocalDataSource();

  private bsModalService = inject(BsModalRef);

  constructor(
    private modalService: BsModalService,
    private orderServiceService: OrderServiceService,
    private genericService: GenericService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: CLASSIFICATION_VEHICLE_COLUMS,
      selectMode: 'multi',
    };

    /* this.data = [
      {
        typeVehicle: 'Particular',
        sale: '1',
        donation: '0',
        destruction: '0',
      },
    ]; */
  }

  ngOnInit(): void {
    this.selectItem(false);
    this.getServiceVehicle();
  }

  getServiceVehicle() {
    this.orderServiceService
      .getServiceVehicle(this.params.getValue())
      .subscribe({
        next: response => {
          const infoVehicle = response.data.map(async (info: any) => {
            const nameTypeVehicle: any = await this.nameVehicle(info.id);
            if (nameTypeVehicle) {
              info.nameTypeVehicle = nameTypeVehicle;
              return info;
            }
          });

          Promise.all(infoVehicle).then(response => {
            this.data.load(response);
            this.totalItems = response.length;
          });
        },
        error: error => {},
      });
  }

  nameVehicle(idVehicle: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.name'] = 'Tipo Vehiculo';
      params.getValue()['filter.keyId'] = idVehicle;
      this.genericService.getAll(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].description);
          //this.typeVehicle = new DefaultSelect(response.data, response.count);
        },
        error: error => {},
      });
    });
  }

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
      this.bsModalService = this.modalService.show(
        CreateClassificateVehicleFormComponent,
        config
      );

      /*this.bsModalService.content.event.subscribe((data: any) => {
        this.data.push(data);
        this.data = [...this.data];
      }); */
    }
  }
}
