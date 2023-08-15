import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerReldisDisp } from 'src/app/core/services/ms-payment/payment-service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { COLUMNS_RELUSU } from './columns-relusu';
import { NewCanRelusuComponent } from './new-can-relusu/new-can-relusu.component';

@Component({
  selector: 'app-can-relusu',
  templateUrl: './can-relusu.component.html',
  styleUrls: [],
})
export class CanRelusuComponent extends BasePage implements OnInit {
  data = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settings1 = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Eliminar',
      delete: true,
      edit: false,
      add: false,
    },
    columns: {
      ...COLUMNS_RELUSU,
      inddistance: {
        title: 'Envío Correo de Distribución',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        valuePrepareFunction: (cell: any, row: any) => {
          return cell == 1 ? true : false;
        },
        onComponentInitFunction: (instance: any) =>
          this.managgeToggleIstance(instance, 'inddistance'),
      },
      indsirsae: {
        title: 'No. Envío a SIRSAE',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        valuePrepareFunction: (cell: any, row: any) => {
          return cell == 1 ? true : false;
        },
        onComponentInitFunction: (instance: any) =>
          this.managgeToggleIstance(instance, 'indsirsae'),
      },
    },
  };

  constructor(
    private bsModal: BsModalRef,
    private modalService: BsModalService,
    private paymentService: PaymentService,
    private serviceUser: SecurityService
  ) {
    super();
    this.getData();
  }

  managgeToggleIstance(instance: CheckboxElementComponent, checkData: any) {
    instance.toggle.subscribe((data: any) => {
      console.log(data.row);
      const dataSelect =
        checkData === 'inddistance' ? data.row.indsirsae : data.row.inddistance;
      console.log(dataSelect);
      if (data.toggle) {
        this.loading = true;
        console.log(false);
        this.updateData(data.row, checkData, true);
      } else {
        if ([0, null, '0'].includes(dataSelect)) {
          console.log(true);
          this.alert(
            'warning',
            `${data.row.user} sin Especificar al Menos una Opción`,
            ''
          );
          this.data.load(this.data['data']);
        } else {
          this.updateData(data.row, checkData, false);
        }
      }
    });
  }

  //Actualizar Data
  updateData(data: any, checkData: string, toggle: boolean) {
    const model: IComerReldisDisp = {
      user: data.user,
      inddistance:
        checkData == 'inddistance' ? (toggle ? 1 : 0) : data.inddistance,
      indsirsae: checkData == 'indsirsae' ? (toggle ? 1 : 0) : data.indsirsae,
      numberRecord: data.numberRecord,
      indlibpg: data.indlibpg,
    };

    this.paymentService.updateComerReldisDisp(data.user, model).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Se Actualizó el Usuario', '');
        this.getData();
      },
      err => {
        console.log(err);
        this.alert(
          'error',
          'Se Presentó un Error Inesperado al Actualizar',
          ''
        );
        this.data.load(this.data['data']);
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  close() {
    this.bsModal.hide();
  }

  getData() {
    this.loading = true;
    this.paymentService.getComerReldisDisp().subscribe(
      async res => {
        const newData = await Promise.all(
          res.data.map(async (e: any) => {
            const resp = await this.getUserName(e.user);
            return {
              ...e,
              name: JSON.parse(JSON.stringify(resp)).name,
            };
          })
        );

        console.log(newData);
        this.data.load(newData);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        console.log(err);
        this.data.load([]);
        this.totalItems = 0;
      }
    );
  }

  getUserName(user: string) {
    return new Promise((resolve, reject) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('user', user);

      this.serviceUser.getAllUsersTracker(paramsF.getParams()).subscribe(
        res => {
          console.log(res);
          resolve({ name: res.data[0].name });
        },
        err => {
          console.log(err);
          resolve({ name: 'USUARIO NO LOCALIZADO' });
        }
      );
    });
  }

  //Generar nuevo
  newRegister() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        callback: (e: boolean) => {
          if (e) {
            this.getData();
          }
        },
      },
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(NewCanRelusuComponent, modalConfig);
  }

  //Elimar registro
  deleteRegister(e: any) {
    console.log(e.data);
    //TODO
    this.paymentService.deleteComerReldisDisp(e.data.user).subscribe(
      res => {
        this.alert('success', 'Registro Eliminado', '');
        this.getData();
      },
      err => {
        this.alert(
          'error',
          'Se Presentó un Error Inesperado al Intentar Borrar el Registro',
          'Por Favor Intentelo Nuevamente'
        );
      }
    );
  }
}
