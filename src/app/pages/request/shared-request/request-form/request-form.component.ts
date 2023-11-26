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
  delegationId: number = 0;
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
  displayOfficeCenter: boolean = false;

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
    if (id && this.op == 2) {
    }
    this.getIssue(new ListParams());
    //comparo el id de la solicitud que esta en task con el id de la ruta
    if (task) {
      if (Number(task.taskId) != id) {
        //this.generateFirstTask();
      } else {
        //si la solicitud tiene id
        this.taskId = task.id;
        this.requestId = id;
        this.getRequest(this.requestId);
      }
    } else {
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
    const disableRegDele = this.op == 2 ? false : true;
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
      regionalDelegationId: [{ value: null, disabled: disableRegDele }], // cargar la delegacion a la que pertence
      transferenceId: [null, Validators.required],
      keyStateOfRepublic: [null, Validators.required],
      stationId: [null, Validators.required],
      authorityId: [null, Validators.required],
      targetUserType: ['SAE'],
      affair: [null],
      targetUser: [null],
      requestStatus: [null],
    });
    this.requestForm.controls['applicationDate'].patchValue(this.bsValue);
    this.requestForm
      .get('regionalDelegationId')
      .setValue(this.getRegionalDelegationId());
    this.getEntity(new ListParams(), this.getRegionalDelegationId());

    //se agregan campos documentación complementaria según el valor del parametro OP
    if (this.op == 2) this.complementaryDocumentationField(this.requestForm);
  }

  async generateFirstTask() {
    return new Promise(async (resolve, reject) => {
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

          this.loadingTurn = false;
        }
        resolve(true);
      }
    });
  }

  complementaryDocumentationField(form: ModelForm<IRequest>) {
    // agregar nuevo campos al formulario para solicitudes de documentacion complementaria
    // Cambia el nombre al campo de Entidad a Estado
    this.keyStateName = 'Estado';
    //form.addControl('affair', this.fb.control('', [Validators.required]));
    this.requestForm.controls['affair'].addValidators([Validators.required]);
    this.requestForm.updateValueAndValidity();
  }

  getRegionalDelegationId() {
    const id = this.authService.decodeToken().department;
    return id;
  }

  async getRegionalDeleg(params?: ListParams) {
    const regDelId = this.getRegionalDelegationId();
    let count = 0;
    this.regionalDelegationService.getAll(params).subscribe({
      next: async resp => {
        if (count == 0) {
          const exist = resp.data.some((x: any) => x.id == regDelId);
          if (exist == false) {
            const actualDeleg: any = await this.getDelegation(+regDelId);
            resp.data.unshift(actualDeleg);
          }
        }

        this.selectRegionalDeleg = new DefaultSelect(resp.data, resp.count);
        count++;
      },
    });
  }

  regDeleChange(e: any) {
    if (e != undefined) {
      this.getEntity(new ListParams(), e.id);
    } else {
      this.requestForm.get('keyStateOfRepublic').setValue(null);
      this.selectEntity = new DefaultSelect();
    }
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
      error: error => { },
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
    params['filter.typeTransferent'] = `$eq:NO`;
    const isNumber = !isNaN(Number(params.text));
    if (params.text != '' && isNumber != true) {
      params['filter.nameTransferent'] = `$ilike:${params.text}`;
    } else if (params.text != '' && isNumber == true) {
      params['filter.id'] = `$ilike:${params.text}`;
    }
    const ptext = params.text;
    params.text = '';
    params['search'] = '';
    this.transferentService.getAll(params).subscribe({
      next: data => {
        const text = this.replaceAccents(ptext);
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferents$ = new DefaultSelect(data.data, data.count);

        if (ptext) {
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

  changeTransf(event: any) {
    if (event == undefined) {
      this.transferents$ = new DefaultSelect();
      this.requestForm.controls['transferenceId'].setValue(null);
      this.getTransferent(new ListParams());
    }
  }

  getState(event: any): void { }

  /*getIssue(event?: any, id?: string): void {
    let params = new ListParams();
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }

    params['filter.nbOrigen'] = `SAMI`;
    this.affairService.getAll(params).subscribe({
      next: data => {
        console.log('asuntos', data);
        this.issues = new DefaultSelect(data.data, data.count);
         if (id) {
          this.requestForm.controls['affair'].setValue(id);
        } 
      },
      error: error => {
        console.log('no se encontraron datos en asuntos ', error);
      },
    });
  } */

  getIssue(params?: ListParams): void {
    params['filter.nbOrigen'] = 'SAMI';
    this.affairService.getAll(params).subscribe({
      next: data => {
        this.issues = new DefaultSelect(data.data, data.count);
        /* if (id) {
          this.requestForm.controls['affair'].setValue(id);
        } */
      },
      error: error => {
        console.log('no se encontraron datos en asuntos ', error);
      },
    });
  }

  affairChange(e: any) {
    console.log(e);
    if (
      e.processDetonate == 'ABANDONO' ||
      e.processDetonate == 'EXT_DOMINIO' ||
      e.processDetonate == 'DECOMISO'
    ) {
      this.displayOfficeCenter = true;
    } else {
      this.displayOfficeCenter = false;
    }
  }

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
        op: this.op,
        officeCentral: this.displayOfficeCenter,
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
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then(async result => {
      if (result.isConfirmed) {
        this.loadingTurn = true;
        const form = this.requestForm.getRawValue();
        form.id = this.requestId;
        form.requestStatus = this.op != 2 ? 'POR_TURNAR' : 'Recepcion';
        let date = this.requestForm.controls['applicationDate'].value;
        form.applicationDate = date.toISOString();

        const createRequest = await this.createRequest(this.requestForm.value);
        if (createRequest) {
          const updateRequest = await this.updateSavedRequest(form);
          if (updateRequest) {
            this.loadingTurn = false;
            Swal.fire({
              title: 'Guardado',
              text: ` Solicitud guardada con el folio: ${this.requestId}`,
              icon: 'success',
              //showCancelButton: true,
              confirmButtonColor: '#9D2449',
              cancelButtonColor: '#B38E5D',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false,
            }).then(async result => { });
          }
        }
      }
    });
  }

  async turnRequest() {
    console.log('this.op ', this.op);
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      '¿Desea Turnar la solicitud?'
    ).then(async question => {
      if (question) {
        if (this.op == 2) {
          /*this.getRegionalDeleg(new ListParams());
          const createTask = await this.generateFirstTask();
          if (createTask) {
            this.msgModal(
              'Se turnó la solicitud con el Folio Nº '
                .concat(`<strong>${this.requestId}</strong>`)
                .concat(` al usuario ${this.userName}`),
              'Solicitud Creada',
              'success'
            );*/

          //crea tareas de prueba se puede eliminar
          this.turnRequestOp2();
          /*  } */
        } else {
          if (this.requestForm.controls['targetUser'].value === null) {
            this.alert(
              'warning',
              'Atención',
              `Seleccione un usuario para poder turnar la solicitud`
            );
            return;
          } else {
            this.getRegionalDeleg(new ListParams());
            const createTask = await this.generateFirstTask();

            if (createTask) {
              this.loadingTurn = true;
              const form = this.requestForm.getRawValue();
              form.id = this.requestId;
              const idRequest = form.id;
              const requestResult: any = await this.updateTurnedRequest(form);
              if (requestResult) {
                const actualUser: any = this.authService.decodeToken();
                let body: any = {};
                body['idTask'] = this.taskId;
                body['userProcess'] = actualUser.username;

                body['type'] = 'SOLICITUD_TRANSFERENCIA';
                body['subtype'] = 'Nueva_Solicitud';
                body['ssubtype'] = 'TURNAR';

                let task: any = {};
                task['id'] = 0;
                task['reviewers'] = this.nickName;
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
                task['urlNb'] =
                  'pages/request/transfer-request/registration-request';
                task['processName'] = 'SolicitudTransferencia';
                task['idDelegationRegional'] = actualUser.department;
                task['idstation'] = form.stationId;
                task['idTransferee'] = form.transferenceId;
                task['idAuthority'] = form.authorityId;

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
                    'Se turnó la solicitud con el Folio Nº '
                      .concat(`<strong>${idRequest}</strong>`)
                      .concat(` al usuario <strong>${this.userName}</strong>`),
                    'Solicitud Creada',
                    'success'
                  );
                  this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
                }
              }
            }
          }
        }
      }
    });
  }

  createRequest(form: any) {
    return new Promise((resolve, reject) => {
      form.requestStatus = this.op != 2 ? 'POR_TURNAR' : 'Recepcion';
      form.receiptRoute = 'FISICA';
      form.affair = this.op == 2 ? form.affair : 37;
      let date = this.requestForm.controls['applicationDate'].value;
      form.applicationDate = date.toISOString();
      form.typeOfTransfer = 'MANUAL';
      //form.regionalDelegationId = this.delegationId;

      this.requestService.create(form).subscribe({
        next: resp => {
          resolve(resp);
          this.requestId = resp.id;
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
      form.affair = this.op == 2 ? form.affair : 37;
      form.typeOfTransfer = 'MANUAL';
      //form.regionalDelegationId = this.delegationId;
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
      form.id = this.requestId;
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
          //this.getIssue('', resp.affair);
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
      allowOutsideClick: false,
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

  idTransferente: number = 0;
  idEmisora: number = 0;
  idAuthoridad: number = 0;

  async turnRequestOp2() {
    this.getRegionalDeleg(new ListParams());
    const createTask = await this.generateFirstTask();
    if (createTask) {
      this.loadingTurn = true;
      const form = this.requestForm.getRawValue();
      //Estableciendo valores a transferente, emisora y autoridad
      this.idTransferente = form.transferenceId;
      this.idEmisora = form.stationId;
      this.idAuthoridad = form.authorityId;
      form.id = this.requestId;
      const idRequest = form.id;
      const { title, urlNb, processName } = this.getValuesForTurn();
      /*  const title =
        'BIENES SIMILARES Registro de Documentación Complementaria,No. Solicitud: ' +
        idRequest;
      const urlNb = 'pages/request/request-comp-doc';
      const processName = 'similar-good-register-documentation'; */

      const requestResult: any = await this.updateTurnedRequest(form);
      if (requestResult) {
        const actualUser: any = this.authService.decodeToken();
        let body: any = {};
        body['idTask'] = this.taskId;
        body['userProcess'] = actualUser.username;

        /** VALIDAR DATOS */
        body['type'] = 'SOLICITUD_TRANSFERENCIA';
        body['subtype'] = 'Nueva_Solicitud';
        body['ssubtype'] = 'TURNAR';

        let task: any = {};
        task['id'] = 0;
        task['assignees'] = this.nickName;
        task['assigneesDisplayname'] = this.userName;
        task['reviewers'] = actualUser.username;
        task['creator'] = actualUser.username;
        task['taskNumber'] = Number(idRequest);
        task['title'] = title + idRequest;
        task['programmingId'] = 0;
        task['requestId'] = idRequest;
        task['expedientId'] = 0;
        task['urlNb'] = urlNb;
        task['processName'] = processName;
        task['idstation'] = this.idEmisora;
        task['idTransferee'] = this.idTransferente;
        task['idAuthority'] = this.idAuthoridad;
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
        if (taskResult) {
          this.loadingTurn = false;
          this.msgModal(
            'Se turnó la solicitud con el Folio Nº'
              .concat(`<strong>${idRequest}</strong>`)
              .concat(` al usuario <strong>${this.userName}</strong>`),
            'Solicitud Creada',
            'success'
          );
          this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
        }
      }
    }
  }

  getValuesForTurn(): any {
    const affair = +this.requestForm.controls['affair'].value;
    let title = '';
    let url = '';
    let process = '';
    switch (affair) {

      case 10: //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
        title =
          'DEVOLUCIÓN: Registro de Documentación Complementaria, No. Solicitud:';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'DRegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      case 33: //GESTIONAR BINES SIMILARES RESARCIMIENTO
        title =
          'BIENES SIMILARES Registro de Documentación Complementaria,No. Solicitud:';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'BSRegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      case 40: //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
        title =
          'RESOLUCIÓN ADMINISTRATIVA DE PAGO EN ESPECIE Registro de Documentación Complementaria,No. Solicitud:';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'RERegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      case 41: //INFORMACIÓN DE BIENES: REGISTRO DE DOCUMENTACIÓN COMPLEMENTARIA
        title =
          'SOLICITUD DE INFORMACIÓN DEL DESTINO DEL BIEN Registro de Documentación Complementaria,No. Solicitud:';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'IBRegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      default:
        break;
    }
  }

  getDelegation(id: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se puedo obtener la delegacón');
        },
      });
    });
  }
}
