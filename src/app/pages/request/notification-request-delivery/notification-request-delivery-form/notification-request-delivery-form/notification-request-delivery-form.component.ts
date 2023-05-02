import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { EXPEDIENTS_REQUEST_COLUMNS } from '../../../shared-request/expedients-tabs/sub-tabs/expedients-request-tab/expedients-request-columns';
import { NotificationFormComponent } from './components/notification-form/notification-form.component';

@Component({
  selector: 'app-notification-request-delivery-form',
  templateUrl: './notification-request-delivery-form.component.html',
  styles: [],
})
export class NotificationRequestDeliveryFormComponent
  extends BasePage
  implements OnInit
{
  settingsExpedientRequest = {
    ...this.settings,
    columns: EXPEDIENTS_REQUEST_COLUMNS,
    actions: false,
  };

  paramsExpedientsRequest = new BehaviorSubject<ListParams>(new ListParams());

  totalItemsExpedientsRequest: number = 0;

  expedientsRequest: any[] = [];

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  notification() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {},
    };

    const createDocument = this.modalService.show(
      NotificationFormComponent,
      config
    );
  }

  save() {
    this.alertQuestion(
      'warning',
      'Guardar',
      '¿Desea guardar la solicitud con folio 1889?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Guardado', 'Solicitud guardada correctamente');
      }
    });
  }

  turn() {
    this.alertQuestion(
      'warning',
      'Guardar',
      '¿Desea turnar la solicitud con folio 1889?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Turnado', 'Solicitud turnada correctamente');
      }
    });
  }
}
