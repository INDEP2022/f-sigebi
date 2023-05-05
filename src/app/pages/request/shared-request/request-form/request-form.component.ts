import { Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { UsersSelectedToTurnComponent } from '../users-selected-to-turn/users-selected-to-turn.component';
//Provisional Data
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  FilterParams,
  ListParams,
} from '../../../../common/repository/interfaces/list-params';
import { ITransferente } from '../../../../core/models/catalogs/transferente.model';
import { AuthorityService } from '../../../../core/services/catalogs/authority.service';
import { RegionalDelegationService } from '../../../../core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from '../../../../core/services/catalogs/state-of-republic.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';
import { RequestService } from '../../../../core/services/requests/request.service';
import { issuesData } from './data';

@Component({
  selector: 'app-create-request',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent extends BasePage implements OnInit {
  @Input() op: number; // op con valor 1 = Recepción Manual, op con valor 2 = Documentación Complementaria
  @Input() edit: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  showSearchForm: boolean = true;
  bsValue = new Date();
  requestForm: ModelForm<any>;
  isReadOnly: boolean = true;
  requestId: number = 0;
  taskId: number = 0;

  loadingTurn = false;
  bsModalRef: BsModalRef;
  checked: string = 'checked';
  userName: string = '';
  nickName: string = '';
  idTransferer: number = null;
  idStation: number = null;
  transferents$ = new DefaultSelect<ITransferente>();
  selectRegionalDeleg = new DefaultSelect<any>();
  selectEntity = new DefaultSelect<any>();
  selectStation = new DefaultSelect<IStation>();

  selectAuthority = new DefaultSelect<IAuthority>();
  selectTransfe: any; //= new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectIssue = new DefaultSelect<any>();

  issues = new DefaultSelect<any>();

  //injeccions
  authService = inject(AuthService);
  regionalDelegationService = inject(RegionalDelegationService);
  delegationStateService = inject(DelegationStateService);
  stateOfRepublicService = inject(StateOfRepublicService);
  stationService = inject(StationService);
  authorityService = inject(AuthorityService);
  transferentService = inject(TransferenteService);
  requestService = inject(RequestService);
  taskService = inject(TaskService);
  orderService = inject(OrderServiceService);
  activateRouter = inject(ActivatedRoute);

  selectedRegDel: any = null;

  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    public location: Location,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getIssue();
    this.getRegionalDeleg(new ListParams());
    this.getTransferent(new ListParams());
    const task: any = JSON.parse(window.localStorage.getItem('Task'));
    const id = Number(this.activateRouter.snapshot.paramMap.get('id'));
    console.log('taskId', task);

    //comparo el id de la solicitud que esta en task con el id de la ruta
    if (task) {
      if (Number(task.taskId) != id) {
        this.generateFirstTask();
      } else {
        //copio la tarea
        this.taskId = task.id;
        //copio el id de la solicitud
        this.requestId = id;
      }
    } else {
      this.generateFirstTask();
    }

    this.requestForm.controls['transferenceId'].valueChanges.subscribe(
      (data: any) => {
        if (data != null) {
          this.idTransferer = data;
          this.getStation(data);
        } else {
          this.requestForm.controls['stationId'].setValue(null);
          this.requestForm.controls['authorityId'].setValue(null);
        }
      }
    );

    this.requestForm.controls['stationId'].valueChanges.subscribe(
      (data: any) => {
        if (data != null) {
          this.idStation = data;
          this.getAuthority(new ListParams());
        }
      }
    );
  }

  prepareForm(): void {
    this.requestForm = this.fb.group({
      id: [null],
      applicationDate: [{ value: null, disabled: true }],
      paperNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(50),
        ],
      ],
      regionalDelegationId: [{ value: null, disabled: true }], // cargar la delegacion a la que pertence
      transferenceId: [null, Validators.required],
      keyStateOfRepublic: [null, Validators.required],
      stationId: [null, Validators.required],
      authorityId: [null, Validators.required],
      targetUserType: ['TE'],
      affair: [null],
      targetUser: [null],
      requestStatus: [null],
    });
    this.requestForm.controls['applicationDate'].patchValue(this.bsValue);

    //se agregan campos documentación complementaria según el valor del parametro OP
    if (this.op == 2) this.complementaryDocumentationField(this.requestForm);
  }

  async generateFirstTask() {
    this.loadingTurn = true;
    const form = this.requestForm.getRawValue();
    const requestResult: any = await this.createRequest(form);
    if (requestResult) {
      this.requestId = requestResult.id;
      const user: any = this.authService.decodeToken();

      let task: any = {};
      task['id'] = 0;
      task['assignees'] = user.username;
      task['assigneesDisplayname'] = user.username;
      task['creator'] = user.username;
      task['taskNumber'] = Number(this.requestId);
      task['title'] = 'Registro de solicitud con folio: ' + this.requestId;
      task['programmingId'] = 0;
      task['requestId'] = this.requestId;
      task['expedientId'] = 0;
      task['urlNb'] = 'pages/request/list/new-transfer-request';

      const taskResult: any = await this.createOnlyTask(task);
      if (taskResult) {
        this.taskId = Number(taskResult.data[0].id);
        console.log('task Id', this.taskId);
        this.loadingTurn = false;
      }
    }
  }

  complementaryDocumentationField(form: ModelForm<IRequest>) {
    // agregar nuevos campos al formulario para solicitudes de documentacion complementaria
    form.addControl('keyStateOfRepublic', this.fb.control('', []));
    form.addControl('affair', this.fb.control('', []));
  }

  getRegionalDelegationId() {
    const id = this.authService.decodeToken().department;
    return id;
  }

  getRegionalDeleg(params?: ListParams) {
    const regDelId = Number(this.getRegionalDelegationId());
    this.regionalDelegationService.getById(regDelId).subscribe((data: any) => {
      this.requestForm.controls['regionalDelegationId'].setValue(data.id);
      this.selectRegionalDeleg = new DefaultSelect([data], data.count);

      this.getEntity(new ListParams(), regDelId);
    });
  }

  getEntity(params: ListParams, id?: number | string): void {
    params.page = 1;
    params.limit = 10;
    params['filter.regionalDelegation'] = `$eq:${id}`;
    this.delegationStateService.getAll(params).subscribe({
      next: data => {
        const stateCode = data.data
          .map((x: any) => {
            if (x.stateCode != null) {
              return x.stateCode;
            }
          })
          .filter(x => x != undefined);

        this.selectEntity = new DefaultSelect(stateCode, stateCode.length);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getStation(id: any) {
    const params = new ListParams();
    params['filter.idTransferent'] = `$eq:${this.idTransferer}`;
    params['filter.stationName'] = `$ilike:${params.text}`;
    params['sortBy'] = 'stationName:ASC';
    //delete params.limit;
    //delete params.page;
    delete params['search'];
    delete params.text;
    this.stationService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.stationName}`;
          return data;
        });
        this.selectStation = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectStation = new DefaultSelect();
      },
    });
  }

  getAuthority(params?: ListParams) {
    params['filter.authorityName'] = `$ilike:${params.text}`;
    params['filter.idStation'] = `$eq:${this.idStation}`;
    params['filter.idTransferer'] = `$eq:${this.idTransferer}`;
    params['sortBy'] = 'authorityName:ASC';
    //delete params.limit;
    //delete params.page;
    delete params['search'];
    delete params.text;
    this.authorityService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.idAuthority} - ${data.authorityName}`;
          return data;
        });
        this.selectAuthority = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectAuthority = new DefaultSelect();
      },
    });
  }

  replaceAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getTransferent(params?: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        const text = this.replaceAccents(params.text);
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferents$ = new DefaultSelect(data.data, data.count);

        if (params.text) {
          let copyData = [...data.data];
          copyData.map(data => {
            data.nameAndId = this.replaceAccents(data.nameAndId);
            return data;
          });

          copyData = copyData.filter(item => {
            return text.toUpperCase() === ''
              ? item
              : item.nameAndId.toUpperCase().includes(text.toUpperCase());
          });

          copyData.map(x => {
            x.nameAndId = `${x.id} - ${x.nameTransferent}`;
            return x;
          });

          if (copyData.length > 0) {
            this.transferents$ = new DefaultSelect(copyData, copyData.length);
          }
        }
      },
      error: () => {
        this.transferents$ = new DefaultSelect();
      },
    });
  }

  getState(event: any): void {}

  getIssue(event?: any): void {
    //Provisional data
    let data = issuesData;
    let count = data.length;
    this.issues = new DefaultSelect(data, count);
  }

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
        /*callback: (next: boolean) => {
          if (next) this.getExample();
        },*/
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      UsersSelectedToTurnComponent,
      config
    );
    this.bsModalRef.content.event.subscribe((res: any) => {
      this.userName = res.firstName;
      this.nickName = res.username;
      this.requestForm.controls['targetUser'].setValue(res.id);
    });
  }

  save() {
    Swal.fire({
      title: 'Guardar Solicitud',
      text: '¿Desea Guardar la solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.loadingTurn = true;
        const form = this.requestForm.getRawValue();

        form.requestStatus = 'POR_TURNAR';
        let date = this.requestForm.controls['applicationDate'].value;
        form.applicationDate = date.toISOString();

        let action = null;
        let haveId = false;

        if (form.id === null) {
          action = this.requestService.create(form);
        } else {
          action = this.requestService.update(form.id, form);
          haveId = true;
        }
        /* se guarda la solicitud */
        action.subscribe(
          async (data: any) => {
            const idRequest = data.id;
            let body: any = {};
            const user: any = this.authService.decodeToken();
            body['id'] = 0;
            body['assignees'] =
              this.nickName === '' ? 'SIN ASIGNACION' : this.nickName;
            body['assigneesDisplayname'] =
              this.userName === '' ? 'SIN ASIGNACION' : this.userName;
            body['creator'] = user.username;
            body['taskNumber'] = 0;
            body['title'] = 'Captura: ' + data.id;
            body['istestTask'] = 's';
            body['programmingId'] = 0;
            body['requestId'] = data.id;
            body['expedientId'] = 0;
            body['processName'] = 'SolicitudTransferencia';
            body['urlNb'] = 'pages/request/list/new-transfer-request';
            if (haveId === false) {
              /* se crea una tarea */
              this.taskService.createTask(body).subscribe({
                next: resp => {
                  this.loadingTurn = false;
                  this.msgModal(
                    'Se guardó la solicitud con el Folio Nº '.concat(
                      `<strong>${data.id}</strong>`
                    ),
                    'Solicitud Guardada',
                    'success'
                  );
                },
              });
            } else {
              const id = await this.getTaskByTaskNumer(data.id);
              if (id) {
                //obtener el id de la tarea
                await this.updateTask(body, idRequest);
                //actualizar la tarea
              }
            }
          },
          error => {
            this.loadingTurn = false;
          }
        );
      }
    });
  }

  turnRequest(): void {
    if (this.requestForm.controls['targetUser'].value === null) {
      this.onLoadToast(
        'info',
        'Información',
        `Seleccione un usuario para poder turnar la solicitud!`
      );
      return;
    }

    Swal.fire({
      title: 'Turnar Solicitud',
      text: '¿Desea Turnar la solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Aceptar',
    }).then(async result => {
      if (result.isConfirmed) {
        this.loadingTurn = true;
        const form = this.requestForm.getRawValue();
        form.id = this.requestId;
        const idRequest = form.id;
        const requestResult: any = await this.updateRequest(form);
        if (requestResult) {
          const actualUser: any = this.authService.decodeToken();
          let body: any = {};
          // debugger;
          body['idTask'] = this.taskId;
          body['userProcess'] = actualUser.username;

          body['type'] = 'SOLICITUD_TRANSFERENCIA';
          body['subtype'] = 'Nueva_Solicitud';
          body['ssubtype'] = 'TURNAR';

          let task: any = {};
          task['id'] = 0;
          task['assignees'] = this.nickName;
          task['assigneesDisplayname'] = this.userName;
          task['creator'] = actualUser.username;
          task['taskNumber'] = Number(idRequest);
          task['title'] =
            'Registro de solicitud (Captura de Solicitud) con folio: ' +
            idRequest;
          task['programmingId'] = 0;
          task['requestId'] = idRequest;
          task['expedientId'] = 0;
          task['urlNb'] = 'pages/request/transfer-request/registration-request';
          task['processName'] = 'SolicitudTransferencia';
          body['task'] = task;

          let orderservice: any = {};
          orderservice['pActualStatus'] = 'REGISTRO_SOLICITUD';
          orderservice['pNewStatus'] = 'REGISTRO_SOLICITUD';
          orderservice['pIdApplication'] = idRequest;
          orderservice['pCurrentDate'] = new Date().toISOString();
          orderservice['pOrderServiceIn'] = '';

          body['orderservice'] = orderservice;

          const taskResult = await this.createTaskOrderService(body);
          if (taskResult) {
            this.loadingTurn = false;
            this.msgModal(
              'Se turnar la solicitud con el Folio Nº '
                .concat(`<strong>${idRequest}</strong>`)
                .concat(` al usuario ${this.userName}`),
              'Solicitud Creada',
              'success'
            );
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
          }
        }
      }
    });
  }

  createRequest(form: any) {
    return new Promise((resolve, reject) => {
      form.requestStatus = 'POR_TURNAR';
      form.receiptRoute = 'FISICA';
      form.affair = null;
      form.applicationDate = null;
      this.requestService.create(form).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loadingTurn = false;
          this.msgModal('error', 'Error', 'Error al crear la solicitud');
          reject(error.error);
        },
      });
    });
  }

  updateRequest(form: any) {
    return new Promise((resolve, reject) => {
      form.requestStatus = 'A_TURNAR';
      form.receiptRoute = 'FISICA';
      form.affair = 37;
      form.typeOfTransfer = 'MANUAL';
      //form.originInfo = 'SOL_TRANSFERENCIA'
      let date = this.requestForm.controls['applicationDate'].value;
      form.applicationDate = date.toISOString();

      this.requestService.update(form.id, form).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loadingTurn = false;
          this.msgModal('error', 'Error', 'Error al guardar la solicitud');
          reject(error.error);
        },
      });
    });
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error.error.message);
          this.loadingTurn = false;
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  createOnlyTask(task: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTask(task).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error.error.message);
        },
      });
    });
  }

  getTaskByTaskNumer(taskNumber: number) {
    return new Promise((resolve, reject) => {
      let params = new ListParams();
      params['filter.taskNumber'] = `$eq:${taskNumber}`;
      this.taskService.getAll(params).subscribe({
        next: resp => {
          if (resp.id) {
            resolve(resp.id);
          }
        },
      });
    });
  }

  updateTask(body: any, idRequest: string) {
    return new Promise((resolve, reject) => {
      this.taskService.update(body.id, body).subscribe({
        next: resp => {
          this.msgModal(
            'Se guardó la solicitud con el Folio Nº '.concat(
              `<strong>${idRequest}</strong>`
            ),
            'Solicitud Guardada',
            'success'
          );
        },
      });
    });
  }

  msgModal(message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: typeMsg,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.requestForm.reset();
        this.requestForm.controls['applicationDate'].patchValue(this.bsValue);
        this.getRegionalDeleg(new ListParams());
        this.userName = '';
        this.loadingTurn = false;
      }
    });
  }
}
