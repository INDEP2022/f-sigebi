import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestList } from 'src/app/core/models/catalogs/request-list.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegistrationOfRequestsComponent } from '../registration-of-requests/registration-of-requests.component';
import { RequestFormComponent } from '../request-form/request-form.component';
import { REQUEST_LIST_COLUMNS } from './request-list-columns';

var usuario: IRequestList[] = [
{
  title: 'Registro de solicitud (Captura de Solicitud) con folio 45009',
  noRequest: 45009,
  numTask: 260301,
  noInstance: 820169,
  created: 'tester_nsbxt',
  process: 'SolicitudeTransferencia'
}
]

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  params = new BehaviorSubject<ListParams>(new ListParams);
  paragraphs: IRequestList[] = [];
  totalItems: number = 0;
  lastClick: number = 0;

  constructor(
    public modalService: BsModalService
  ) {
    super();
    this.settings.columns = REQUEST_LIST_COLUMNS;
    this.settings.selectMode = ''
    this.settings.actions = {
      columnTitle: 'Acciones',
      position:'right',
      add: false,
      edit: false,
      delete: false
    }
   }

  ngOnInit(): void {
    this.paragraphs = usuario;
  }

  openCreateRequestForm(event?: IRequestList) {
    this.openModel('modal-lg',RequestFormComponent)
  }

  editRequest(event: any) {
    this.lastClick += 1;
    setTimeout(() => {
      if (this.lastClick > 1) {
        this.openModel('modalSizeXL',RegistrationOfRequestsComponent,event.data);
      } 
      this.lastClick = 0;
    }, 500);
  }

  private openModel(sizeModal:string, modalComponent:any,parameter?:IRequestList):void{
    let config:ModalOptions = {
      initialState: {
        parameter: parameter,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        }
      },
      class: `${sizeModal} modal-dialog-centered`,
      ignoreBackdropClick: true,
    }
    this.modalService.show(modalComponent, config);
  }
}
