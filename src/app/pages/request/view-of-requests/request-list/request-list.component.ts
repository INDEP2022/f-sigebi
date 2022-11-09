import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestList } from 'src/app/core/models/catalogs/request-list.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_LIST_COLUMNS } from './request-list-columns';

var usuario: IRequestList[] = [
  {
    title: 'Registro de solicitud (Captura de Solicitud) con folio 45009',
    noRequest: 45009,
    numTask: 260301,
    noInstance: 820169,
    created: 'tester_nsbxt',
    process: 'SolicitudeTransferencia',
  },
  {
    title: 'Registo de solicitud (programar solicitud) con folio 45010',
    noRequest: 45010,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'Solicitud de programación',
  },
];

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: IRequestList[] = [];
  totalItems: number = 0;
  lastClick: number = 0;

  constructor(public modalService: BsModalService, public router: Router) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: '' };
    this.settings.columns = REQUEST_LIST_COLUMNS;
    /* this.settings.actions = {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    }; */
  }

  ngOnInit(): void {
    this.paragraphs = usuario;
  }

  /* openCreateRequestForm(event?: IRequestList) {
    this.router.navigate(['pages/request/list/new-transfer-request']);
  } */

  openCreateProgrammingRequest() {
    this.router.navigate;
  }

  editRequest(event: any) {
    this.lastClick += 1;
    setTimeout(() => {
      if (this.lastClick > 1) {
        //en el caso de que sea una solicitud de programacion
        this.router.navigate([
          'pages/request/transfer-request/registration-request',
          1,
        ]);
      }
      this.lastClick = 0;
    }, 500);
  }

  private openModel(
    sizeModal: string,
    modalComponent: any,
    parameter?: IRequestList
  ): void {
    let config: ModalOptions = {
      initialState: {
        parameter: parameter,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: `${sizeModal} modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(modalComponent, config);
  }
}
