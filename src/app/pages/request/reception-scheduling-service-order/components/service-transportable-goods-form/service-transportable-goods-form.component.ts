import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICE_TRANSPORTABLE_COLUMNS } from '../../columns/service-transportable-columns';
import { CreateManualServiceFormComponent } from '../create-manual-service-form/create-manual-service-form.component';
import { CreateServiceFormComponent } from '../create-service-form/create-service-form.component';

@Component({
  selector: 'app-service-transportable-goods-form',
  templateUrl: './service-transportable-goods-form.component.html',
  styleUrls: ['./service-transportable-goods.scss'],
})
export class ServiceTransportableGoodsFormComponent
  extends BasePage
  implements OnInit
{
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() rejected: boolean;
  title: string = '';
  showButtonServiceManual: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  data: any[] = [];
  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: SERVICE_TRANSPORTABLE_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.titleTab();
  }

  titleTab() {
    if (this.op == 2 || this.op == 4 || this.op == 10 || this.op == 14) {
      this.title = 'Servicios prestados';
    } else if (this.op != 2) {
      this.title = 'Servicio para bienes transportables';
    }
  }

  newService() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-content-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
          this.showButtonServiceManual = true;
        }
      },
    };
    const createService = this.modalService.show(
      CreateServiceFormComponent,
      config
    );
  }

  newServiceManual() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-content-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          console.log(data);
        }
      },
    };
    const createServiceManual = this.modalService.show(
      CreateManualServiceFormComponent,
      config
    );
  }

  deleteService() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro que deseas eliminar el servicio?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Servicio eliminado correctamente', '');
      }
    });
  }
}
