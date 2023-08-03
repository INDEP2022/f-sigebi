import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { IUserTurn } from 'src/app/core/models/user-turn/user-turn.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { UsersSelectedToTurnComponent } from '../../../shared-request/users-selected-to-turn/users-selected-to-turn.component';
import { userData } from '../../perform-programming/perform-programming-form/data-perfom-programming';

@Component({
  selector: 'app-schedule-reception-form',
  templateUrl: './schedule-reception-form.component.html',
  styles: [],
})
export class ScheduleReceptionFormComponent extends BasePage implements OnInit {
  requestForm: ModelForm<any>;
  users = new DefaultSelect(userData);
  date: string = '';
  nameUser: string = '';
  typeUserLog: string = '';
  regionalDelegationNum: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  typeUser: string = 'SAE';
  checked: string = 'checked';
  userName: string = '';
  nickName: string = '';
  delegationUser: string = '';
  typeEvent: string = '';
  taskId: number = 0;
  programmingId: number = 0;
  role: string = '';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingRequestService: ProgrammingRequestService,
    private router: Router,
    private bsModalRef: BsModalRef,
    private authService: AuthService,
    private programmingGoodService: ProgrammingGoodService,
    private genericService: GenericService,
    private activateRouter: ActivatedRoute,
    private taskService: TaskService
  ) {
    super();
    let now = moment();
    this.date = now.format();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUserInfo();
    this.userLogData();
    this.getTypeEvent();
  }

  getUserInfo() {
    this.programmingRequestService.getUserInfo().subscribe((data: any) => {
      this.nameUser = data.name;
      this.typeUserLog = data.employeetype;
      this.regionalDelegationNum = data.department;
      this.role = data.puesto;
    });
  }

  createProgramming() {
    return new Promise((resolve, reject) => {
      const programmingData: IGoodProgramming = {
        typeUser: this.typeUserLog,
        regionalDelegationNumber: this.regionalDelegationNum,
      };
      this.programmingGoodService.createProgramming(programmingData).subscribe({
        next: async (response: IGoodProgramming) => {
          resolve(response);
        },
        error: error => {
          this.onLoadToast('error', 'Error', 'Error al crear la solicitud');
          reject(error.error);
        },
      });
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  getTypeEvent() {
    this.params.getValue()['filter.name'] = 'Tipo Evento';
    this.genericService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.typeEvent = response.data[0].description;
      },
      error: error => {},
    });
  }

  userLogData() {
    let userLog = this.authService.decodeToken();

    this.delegationUser = userLog.delegacionreg;
  }

  prepareForm() {
    this.requestForm = this.fb.group({
      creationUser: [null, [Validators.required]],
      targetUserType: ['TE'],
      date: this.date,
      typeEvent: 'Recepción Fisica',
    });
  }

  selectTypeUser(event: Event) {
    this.typeUser = (event.target as HTMLInputElement).value;
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      `¿Desea turnar la solicitud a ${this.userName}?`
    ).then(async question => {
      if (question.isConfirmed) {
        const programmingResult: any = await this.createProgramming();
        if (programmingResult) {
          this.loading = true;
          this.programmingId = programmingResult.id;
          this.requestForm.get('creationUser').setValue(this.nameUser);
          const user: any = this.authService.decodeToken();
          let body: any = {};

          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Programar_Recepcion';
          body['ssubtype'] = 'TURNAR';

          let task: any = {};
          task['id'] = 0;
          task['assignees'] = this.nickName;
          task['assigneesDisplayname'] = this.userName;
          task['creator'] = user.username;
          task['taskNumber'] = Number(this.programmingId);
          task['title'] =
            'Realizar Programación con folio: ' + this.programmingId;
          task['programmingId'] = this.programmingId;
          //task['requestId'] = this.programmingId;
          task['expedientId'] = 0;
          task['idDelegationRegional'] = this.regionalDelegationNum;
          task['urlNb'] =
            'pages/request/programming-request/perform-programming';
          task['processName'] = 'SolicitudProgramacion';
          body['task'] = task;
          const taskResult = await this.createTaskOrderService(body);
          this.loading = false;
          if (taskResult) {
            this.msgGuardado(
              'success',
              'Creación de Tarea Correcta',
              `Se creó la tarea Realizar Programación con el folio: ${this.programmingId}`
            );
          }
        }
      }
    });
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  openModalSelectUser() {
    const delegationUserLog = this.delegationUser;
    const role = this.role;
    const process = 'schedule';
    const typeUserSelect = this.requestForm.get('targetUserType').value;
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
        delegationUserLog,
        role,
        process,
        typeUserSelect,
        callback: (user: IUserTurn) => {
          if (user) {
            this.userName = user.fullName;
            this.nickName = user.username;
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UsersSelectedToTurnComponent, config);
  }

  msgGuardado(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
      }
    });
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
