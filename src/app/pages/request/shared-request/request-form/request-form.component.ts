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
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
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
  keyStateName: string = 'Entidad';

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
  route = inject(ActivatedRoute);
  affairService = inject(AffairService);
  userProcessService = inject(UserProcessService);

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
    const task: any = JSON.parse(window.localStorage.getItem('Task'));
    const id = Number(this.activateRouter.snapshot.paramMap.get('id'));
    this.prepareForm();
    this.getRegionalDeleg(new ListParams());
    this.getTransferent(new ListParams());
    console.log('taskId', task);
    if (id && this.op == 2) {
      this.getIssue();
    }
    //comparo el id de la solicitud que esta en task con el id de la ruta
    if (task) {
      if (Number(task.taskId) != id) {
        this.generateFirstTask();
      } else {
        //si la solicitud tiene id
        this.taskId = task.id;
        this.requestId = id;
        this.getRequest(this.requestId);
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
      task['title'] =
        this.op != 2
          ? 'Registro de solicitud con folio: ' + this.requestId
          : 'Documentacion Complementaria con folio: ' + this.requestId;
      task['programmingId'] = 0;
      task['requestId'] = this.requestId;
      task['expedientId'] = 0;
      task['idDelegationRegional'] = user.department;
      task['urlNb'] =
        this.op != 2
          ? 'pages/request/list/new-transfer-request'
          : 'pages/request/request-comp-doc/create';
      const taskResult: any = await this.createOnlyTask(task);
      if (taskResult) {
        this.taskId = Number(taskResult.data[0].id);
        console.log('task Id', this.taskId);
        this.loadingTurn = false;
      }
    }
  }

  complementaryDocumentationField(form: ModelForm<IRequest>) {
    // agregar nuevo campos al formulario para solicitudes de documentacion complementaria
    // Cambia el nombre al campo de Entidad a Estado
    this.keyStateName = 'Estado';
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

  getIssue(event?: any, id?: string): void {
    let params = new ListParams();
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    params['filter.nbOrigen'] = `$eq:SAMI`;
    this.affairService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.issues = new DefaultSelect(data.data, data.count);
        if (id) {
          this.requestForm.controls['affair'].setValue(id);
        }
      },
      error: error => {
        console.log('no se encontraron datos en asuntos ', error);
      },
    });
  }

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
        op: this.op,
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
    }).then(async result => {
      if (result.isConfirmed) {
        this.loadingTurn = true;
        const form = this.requestForm.getRawValue();
        form.id = this.requestId;
        form.requestStatus = this.op != 2 ? 'POR_TURNAR' : 'Recepcion';
        let date = this.requestForm.controls['applicationDate'].value;
        form.applicationDate = date.toISOString();

        const updateRequest = await this.updateSavedRequest(form);
        if (updateRequest) {
          this.loadingTurn = false;
          Swal.fire({
            title: 'Guardado',
            text: ` Solicitud guardada con el folio: ${this.requestId}`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#9D2449',
            cancelButtonColor: '#B38E5D',
            confirmButtonText: 'Aceptar',
          }).then(async result => {
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
          });
        }
      }
    });
  }

  turnRequest(): void {
    if (this.op == 2) {
      this.onLoadToast(
        'info',
        'No guarda',
        'falta implementarse el registro de tareas'
      );
      return;
    }

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
        const requestResult: any = await this.updateTurnedRequest(form);
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
          task['idDelegationRegional'] = actualUser.department;
          body['task'] = task;

          let orderservice: any = {};
          orderservice['pActualStatus'] = 'REGISTRO_SOLICITUD';
          orderservice['pNewStatus'] = 'REGISTRO_SOLICITUD';
          orderservice['pIdApplication'] = idRequest;
          orderservice['pCurrentDate'] = new Date().toISOString();
          orderservice['pOrderServiceIn'] = '';

          body['orderservice'] = orderservice;

          const taskResult = await this.createTaskOrderService(body);
          console.log('tarea', taskResult);
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
      form.requestStatus = this.op != 2 ? 'POR_TURNAR' : 'Recepcion';
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

  updateTurnedRequest(form: any) {
    return new Promise((resolve, reject) => {
      form.requestStatus = this.op != 2 ? 'A_TURNAR' : 'Recepcion';
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

  updateSavedRequest(form: any) {
    return new Promise((resolve, reject) => {
      form.requestStatus = 'POR_TURNAR';
      form.receiptRoute = 'FISICA';
      form.affair = this.op == 2 ? form.affair : 37;
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
          if (resp.length == 0) {
            this.onLoadToast(
              'error',
              'Error al crear tarea',
              'El servicio de crear tareas no esta funcionando por el momento'
            );
            reject(false);
          } else {
            resolve(resp);
          }
        },
        error: error => {
          console.log(error.error.message);
          this.onLoadToast(
            'error',
            'Error al crear tarea',
            'El servicio de crear tareas no esta funcionando por el momento'
          );
          reject(false);
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

  getRequest(requestId: number | string) {
    this.requestService.getById(requestId).subscribe({
      next: resp => {
        this.requestForm.controls['paperNumber'].setValue(resp.paperNumber);
        this.requestForm.controls['keyStateOfRepublic'].setValue(
          resp.keyStateOfRepublic
        );
        this.requestForm.controls['transferenceId'].setValue(
          resp.transferenceId
        );
        this.requestForm.controls['stationId'].setValue(resp.stationId);
        this.requestForm.controls['authorityId'].setValue(resp.authorityId);
        if (this.op == 2 && resp.affair) {
          this.getIssue('', resp.affair);
        }
        this.requestForm.controls['targetUserType'].setValue(
          resp.targetUserType
        );
        if (resp.targetUser) {
          this.getAllUsers(resp.targetUser);
        }
      },
    });
  }

  getAllUsers(id: string) {
    const params = new FilterParams();
    this.params.value.addFilter('id', id);
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        this.userName = resp.data[0].firstName;
        this.nickName = resp.data[0].username;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
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
