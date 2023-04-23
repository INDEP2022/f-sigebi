import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  title: string = '¿DESEAS TURNAR LAS SOLICITUDES SELECCIONAS?';
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  requestToTurn: any;
  listUser: IUserProcess[] = [];
  typeUser: string = 'TE';
  user: any;
  username: string = '';
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
    this.prepareForm();
    this.removeUnNecessaryData();

    this.requestForm.controls['typeUser'].valueChanges.subscribe(
      (data: any) => {
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
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        const result = resp.data.map((item: any) => {
          return (item['fullName'] = item.firstName + ' ' + item.lastName);
        });
        console.log(result);
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
      this.onLoadToast('info', 'Informacion', `Seleccione un usuario!`);
      return;
    }
    debugger;
    this.loading = true;
    this.requestToTurn.map(async (item: any, i: number) => {
      let index = i + 1;
      item.requestStatus = 'A_TURNAR';
      item.receiptRoute = 'ELECTRONICA';
      item.affair = 39;
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
        const taskResult = await this.createTaskOrderService(
          resposeRequest,
          from,
          to,
          false,
          0,
          user.username,
          'SOLICITUD_TRANSFERENCIA',
          'Nueva_Solicitud',
          'TURNAR'
        );

        if (taskResult) {
          if (this.requestToTurn.length === index) {
            this.message(
              'success',
              'Turnado Exitoso',
              'Se turnaron las solicitudes correctamente'
            );

            this.loading = false;
            this.modalRef.content.callback(true);
            this.close();
          }
        }
      }
    });
  }

  saveRequest(request: any) {
    /* Se crea la solicitud */
    return new Promise((resolve, reject) => {
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

  createTaskOrderService(
    request: any,
    from: string,
    to: string,
    closetask: boolean,
    taskId: string | number,
    userProcess: string,
    type: string,
    subtype: string,
    ssubtype: string
  ) {
    return new Promise((resolve, reject) => {
      debugger;
      const user: any = this.authService.decodeToken();
      let body: any = {};
      //body['type'] = 'SOLICITUD TRANSFERENCIA';
      if (closetask) {
        body['idTask'] = taskId;
        body['userProcess'] = userProcess;
      }

      body['type'] = type;
      body['subtype'] = subtype;
      body['ssubtype'] = ssubtype;

      let task: any = {};
      task['id'] = 0;
      task['assignees'] = this.user.username;
      task['assigneesDisplayname'] = this.user.firstName;
      task['creator'] = user.username;
      task['taskNumber'] = Number(request.id);
      task['title'] =
        'Registro de solicitud (Captura de Solicitud) con folio: ' + request.id;
      task['programmingId'] = 0;
      task['requestId'] = request.id;
      task['expedientId'] = 0;
      task['urlNb'] = 'pages/request/transfer-request/registration-request';
      body['task'] = task;

      let orderservice: any = {};
      orderservice['pActualStatus'] = from;
      orderservice['pNewStatus'] = to;
      orderservice['pIdApplication'] = request.id;
      orderservice['pCurrentDate'] = new Date().toISOString();
      orderservice['pOrderServiceIn'] = '';

      body['orderservice'] = orderservice;

      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
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
}
