import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestList } from 'src/app/core/models/catalogs/request-list.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_LIST_COLUMNS } from '../../view-of-requests/request-list/request-list-columns';

@Component({
  selector: 'app-destination-info-request-list',
  templateUrl: './destination-info-request-list.component.html',
  styleUrls: ['./destination-info-request-list.component.scss'],
})
export class DestinationInfoRequestListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  requests: IRequestList[] = [];
  totalItems: number = 0;

  constructor(public router: Router) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: '' };
    this.settings.columns = REQUEST_LIST_COLUMNS;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    // Llamar servicio para obtener solicitudes del usuario
    this.requests = [
      {
        title:
          'INFORMACIÓN DE BIENES: Registo de Documentación Complementaria, No. Solicitud: 1898',
        noRequest: 1898,
        numTask: 45092,
        noInstance: 212048,
        created: 'tester_nsbxt',
        process: 'SID_RegistrarSolicitud',
      },
      {
        title:
          'Generar Solicitud de Información y Oficio de Respuesta, No. Solicitud: 1898',
        noRequest: 1898,
        numTask: 45092,
        noInstance: 212054,
        created: 'tester_nsbxt',
        process: 'SID_GenerarOficio',
      },
      {
        title:
          'Revisión del Oficio de Respuesta de Información, No. Solicitud: 1898',
        noRequest: 1898,
        numTask: 45092,
        noInstance: 212056,
        created: 'tester_nsbxt',
        process: 'SID_RevisarOficio',
      },
    ];
    this.totalItems = this.requests.length;
  }

  redirectRequest(event: any) {
    const { process, noRequest } = event.data;
    switch (process) {
      case 'SID_RegistrarSolicitud':
        // en el caso de que sea una solicitud de registrar informacion de destino
        this.router.navigate([
          'pages/request/register-documentation/step/destination-information',
          noRequest,
        ]);
        break;

      case 'SID_GenerarOficio':
        // en el caso de que sea una solicitud de generar oficio de respuesta de informacion de destino
        this.router.navigate([
          'pages/request/destination-information-request/register-response-minute',
          noRequest,
        ]);
        break;

      case 'SID_RevisarOficio':
        // en el caso de que sea una solicitud de revisar oficio de respuesta de informacion de destino
        this.router.navigate([
          'pages/request/destination-information-request/review-response-minute',
          noRequest,
        ]);
        break;

      default:
        break;
    }
  }
}
