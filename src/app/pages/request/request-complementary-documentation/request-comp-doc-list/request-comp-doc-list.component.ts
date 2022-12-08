import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IRequestTask } from 'src/app/core/models/requests/request-task.model';
import { COLUMNS } from './columns';
//Provisional Data
import { dataRequest } from './data';

@Component({
  selector: 'app-request-comp-doc-list',
  templateUrl: './request-comp-doc-list.component.html',
  styles: [],
})
export class RequestCompDocListComponent extends BasePage implements OnInit {
  tasks: IRequestTask[] = dataRequest;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public router: Router) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {}

  editRequest(event: any) {
    console.log(event);
    this.router.navigate(
      ['tasks', event.data.process, event.data.requestNumber],
      { relativeTo: this.activatedRoute }
    );

    /*switch (event.data.process) {
      case 'COMPLEMENTARY-DOCS':
        // en el caso de que sea una solicitud de programacion
        this.router.navigate(
          ['tasks', event.data.process, event.data.requestNumber],
          { relativeTo: this.activatedRoute }
        );
        break;
      case 'RegistroSolicitudes':
        // en el caso de que el proceso seleccionado sea Bienes Similares
        this.router.navigate([
          'pages/request/manage-similar-goods/register-request-goods',
          event.data.requestNumber,
        ]);
        break;
      case 'RE_RegistrarDocumentacion':
        // en el caso de que sea el proceso de registrar solicitud de resarcimiento economico
        this.router.navigate([
          'pages/request/economic-compensation/register-documentation',
          event.data.requestNumber,
        ]);
        break;
      case 'RE_SolicitarRecursos':
        // en el caso de que sea el proceso de registrar solicitud de recursos economicos
        this.router.navigate([
          'pages/request/economic-compensation/economic-resources',
          event.data.requestNumber,
        ]);
        break;
      case 'SolicitudeTransferencia':
        // en el caso de que sea una solicitud de programacion
        this.router.navigate([
          'pages/request/transfer-request/registration-request',
          1,
        ]);
        break;
      case 'RE_RevisarLineamientos':
        // en el caso de que sea el proceso de revision de lineamientos
        this.router.navigate([
          'pages/request/economic-compensation/guidelines-revision',
          event.data.requestNumber,
        ]);
        break;
      default:
        break;
    }*/
  }
}
