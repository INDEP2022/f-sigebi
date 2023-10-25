import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { IRequest } from '../../../../core/models/requests/request.model';
import { RequestService } from '../../../../core/services/requests/request.service';
import { TURN_SELECTED_COLUMNS } from './request-in-turn-selected-columns';

@Component({
  selector: 'app-request-in-turn-selected',
  templateUrl: './request-in-turn-selected.component.html',
  styles: [],
})
export class RequestInTurnSelectedComponent extends BasePage implements OnInit {
  requestForm: FormGroup;
  title: string = 'TURNAR LAS SOLICITUDES SELECCIONADAS';
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  requestToTurn: any;
  listUser: IUserProcess[] = [];
  typeUser: string = 'TE';
  user: any;
  username: string = '';
  deleRegionalId: string = '';
  listResquestForTurn: any = [];

  requestService = inject(RequestService);
  userProcessService = inject(UserProcessService);
  taskService = inject(TaskService);
  orderService = inject(OrderServiceService);

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder,
    private authService: AuthService
  ) {
    super();
    this.settings.columns = TURN_SELECTED_COLUMNS;
    this.settings.actions = {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    };
  }

  ngOnInit(): void {
    console.log('Solicitudes a turnar, ', this.requestToTurn);
    this.prepareForm();
    this.removeUnNecessaryData();
    const storeData = this.authService.decodeToken();
    this.deleRegionalId = storeData.delegacionreg;
    this.requestForm.controls['typeUser'].valueChanges.subscribe(
      (data: any) => {
        if (this.typeUser != data) {
          this.params.getValue().page = 1;
          this.params.getValue().limit = 10;
        }
        this.typeUser = data;

        this.getUserList();
      }
    );

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getUserList();
    });
  }

  prepareForm() {
    this.requestForm = this.fb.group({
      typeUser: ['TE'],
    });
  }

  getUserList() {
    this.loading = true;
    this.typeUser = this.requestForm.controls['typeUser'].value;
    this.params.value.addFilter('employeeType', this.typeUser);
    this.params.value.addFilter(
      'regionalDelegation',
      this.deleRegionalId,
      SearchFilter.ILIKE
    );
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['fullName'] = item.firstName + ' ' + item.lastName;
        });

        this.listUser = resp.data;
        this.paragraphs = this.listUser;
        this.totalItems = resp.count;
        this.loading = false;
        this.params.value.removeAllFilters();
      },
      error: error => {
        console.log(error);
        this.loading = false;
        this.params.value.removeAllFilters();
      },
    });
  }

  removeUnNecessaryData() {
    for (let i = 0; i < this.requestToTurn.length; i++) {
      console.log(this.requestToTurn[i]);
      const request = this.requestToTurn[i];
      delete request.delegationName;
      delete request.stateOfRepublicName;
      delete request.transferentName;
      delete request.stationName;
      delete request.authorityName;
      delete request.affairName;
      delete request.dateApplication;
      delete request.datePaper;

      //eliminar objetos
      delete request.delegation;
      delete request.transferent;
      delete request.authority;
      delete request.emisora;
      delete request.state;
      delete request.proceedings;
      delete request.regionalDelegation;
    }
  }

  getRow(user: any) {
    this.user = user.data;
    this.username = user.data.username;
  }

  confirm() {
    if (this.user === undefined) {
      this.onLoadToast('info', 'Información', `Seleccione un usuario`);
      return;
    }
    this.loading = true;
    this.requestToTurn.map(async (item: any, i: number) => {
      let index = i + 1;
      item.requestStatus = 'A_TURNAR';
      item.receiptRoute = 'ELECTRONICA';
      //
      item.affair =
        item.typeOfTransfer == 'FGR_SAE' ||
        item.typeOfTransfer == 'PGR_SAE' ||
        item.typeOfTransfer == 'SAT_SAE'
          ? 39
          : 37;
      item.targetUserType = this.requestForm.controls['typeUser'].value;
      item.targetUser = this.user.id;
      item.modificationDate = new Date().toISOString();
      /* crea solicitud */
      const resposeRequest: any = await this.saveRequest(item);

      if (resposeRequest) {
        /* crea tarea */
        const from = 'REGISTRO_SOLICITUD';
        const to = 'REGISTRO_SOLICITUD';
        const user: any = this.authService.decodeToken();
        const taskResult = await this.createTask(item);

        if (taskResult) {
          console.log('taskResult: ', taskResult);
          if (this.requestToTurn.length === index) {
            this.loading = false;
            const list = this.listResquestForTurn.join(',');
            this.showRequestsTurned(list);
          }
        }
      }
    });
  }

  saveRequest(request: any) {
    /* Se crea la solicitud */
    return new Promise((resolve, reject) => {
      this.listResquestForTurn.push(request.id);
      this.requestService.update(request.id, request as IRequest).subscribe({
        next: resp => {
          resolve(resp);
          /*if (resp.id) {
            resolve(resp);
          } else {
            reject(false);
          }*/
        },
        error: error => {
          this.loading = false;
          this.message('error', 'Error', 'Error al guardar la solicitud');
          reject(error.error.message);
        },
      });
    });
  }

  createTask(request: any) {
    console.log('Creando tarea');
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: any = {};
      //body['type'] = 'SOLICITUD TRANSFERENCIA';

      let task: any = {};
      task['id'] = 0;
      task['reviewers'] = user.username;
      task['assignees'] = this.user.username;
      task['assigneesDisplayname'] = this.user.firstName;
      task['creator'] = user.username;
      task['taskNumber'] = Number(request.id);
      task['title'] =
        'Registro de solicitud (Captura de Solicitud) con folio: ' + request.id;
      task['programmingId'] = 0;
      task['requestId'] = request.id;
      task['expedientId'] = 0;
      task['idDelegationRegional'] = user.department;
      //task['assignedDate'] = new Date().toISOString();
      task['urlNb'] = 'pages/request/transfer-request/registration-request';
      task['processName'] = 'SolicitudTransferencia';
      task['idTransferee'] = this.requestToTurn[0]?.transferenceId;
      task['idAuthority'] = this.requestToTurn[0]?.authorityId;
      task['idstation'] = this.requestToTurn[0]?.stationId;

      console.log('Objeto a enviar: ', task);
      this.taskService.createTask(task).subscribe({
        next: resp => {
          console.log('Se creo la tarea: ', resp);
          resolve(true);
        },
        error: error => {
          console.log(error.error.message);
          this.loading = false;
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  close() {
    this.modalRef.hide();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  showRequestsTurned(list: any) {
    Swal.fire({
      title: 'Turnado Correctamente',
      html: `Se turnaron las siguientes solicitudes exitosamente <strong>${list}</strong>`,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.modalRef.content.callback(true);
        this.close();
      }
    });
  }
}
