import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ConfirmProgrammingComponent } from '../../../shared-request/confirm-programming/confirm-programming.component';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';
import { PrintReportModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { RejectProgrammingFormComponent } from '../../shared-components-programming/reject-programming-form/reject-programming-form.component';
import { ESTATE_COLUMNS, ESTATE_COLUMNS_VIEW } from '../columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../columns/users-columns';

@Component({
  selector: 'app-acept-programming-form',
  templateUrl: './acept-programming-form.component.html',
  styles: [],
})
export class AceptProgrammingFormComponent extends BasePage implements OnInit {
  estateSettings = {
    ...this.settings,
    actions: false,
    columns: ESTATE_COLUMNS,
  };

  settingsTransportableGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingGuardGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingWarehouseGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsStation = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  goodsInfoTrans: any[] = [];
  goodsInfoGuard: any[] = [];
  goodsInfoWarehouse: any[] = [];
  totalItems: number = 0;
  totalItemsTransportable: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  idTransferent: number;
  idStation: number;
  programming: Iprogramming;
  usersData: LocalDataSource = new LocalDataSource();
  estateData: any[] = [];
  programmingId: number = 0;
  formLoading: boolean = false;
  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();

  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén INDEP(0)`;
  nameTransferent: string = '';
  nameStation: string = '';
  authorityName: string = '';
  typeRelevantName: string = '';
  nameWarehouse: string = '';
  transGoods: any[] = [];
  guardGoods: any[] = [];
  warehouseGoods: any[] = [];
  emails: any[] = [];

  infoUsers: IUser[] = [];
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private goodService: GoodService,
    private authService: AuthService,
    private emailService: EmailService,
    private taskService: TaskService,
    private router: Router
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_COLUMNS_SHOW,
    };
    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.getProgrammingId();
    const user: any = this.authService.decodeToken();

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUsersProgramming());

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGoodProgramming());
  }

  getProgrammingId() {
    this.formLoading = true;
    this.programmingService
      .getProgrammingId(this.programmingId)
      .subscribe(data => {
        data.startDate = moment(data.startDate).format('DD/MM/YYYY, h:mm:ss ');
        data.endDate = moment(data.endDate).format('DD/MM/YYYY, h:mm:ss a');
        this.programming = data;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getRegionalDelegation();
        this.getTransferent();
        this.getStation();
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
      });
  }

  getRegionalDelegation() {
    this.regionalDelegationService
      .getById(this.programming.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationNumber = data.description;
      });
  }

  getTransferent() {
    this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
        this.nameTransferent = data.nameTransferent;
      });
  }

  getStation() {
    this.paramsStation.getValue()['filter.id'] = this.programming.stationId;
    this.paramsStation.getValue()['filter.idTransferent'] =
      this.programming.tranferId;

    this.stationService.getAll(this.paramsStation.getValue()).subscribe({
      next: response => {
        this.nameStation = response.data[0].stationName;
      },
      error: error => {},
    });
  }

  getAuthority() {
    this.paramsAuthority.getValue()['filter.idAuthority'] =
      this.programming.autorityId;
    this.paramsAuthority.getValue()['filter.idTransferer'] = this.idTransferent;

    this.authorityService.getAll(this.paramsAuthority.getValue()).subscribe({
      next: response => {
        let authority = response.data.find(res => {
          return res;
        });
        this.authorityName = authority.authorityName;
      },
    });
  }

  getTypeRelevant() {
    return this.typeRelevantService
      .getById(this.programming.typeRelevantId)
      .subscribe(data => {
        this.typeRelevantName = data.description;
      });
  }

  getwarehouse() {
    return this.warehouseService
      .getById(this.programming.storeId)
      .subscribe(data => {
        this.nameWarehouse = data.description;
        this.formLoading = false;
      });
  }

  getUsersProgramming() {
    this.loading = true;
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getUsersProgramming(this.params.getValue())
      .subscribe({
        next: response => {
          const usersData = response.data.map(items => {
            items.userCharge = items.charge?.description;
            return items;
          });
          this.infoUsers = usersData;
          this.usersData.load(usersData);
          this.totalItems = this.usersData.count();
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  confirm() {}

  rejectProgramming() {
    const config = MODAL_CONFIG;
    let idProgramming = this.programmingId;
    config.initialState = {
      idProgramming,
      callback: (next: boolean) => {
        if (next) {
        }
      },
    };

    this.modalService.show(RejectProgrammingFormComponent, config);
  }

  signOffice() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (userInfo: IUser) => {
        if (userInfo) {
          this.openReport(userInfo);
        }
      },
    };

    const confirmPro = this.modalService.show(
      ConfirmProgrammingComponent,
      config
    );
  }

  openReport(userInfo: IUser) {
    const idReportAclara = this.programmingId;
    const idTypeDoc = 221;
    let config: ModalOptions = {
      initialState: {
        idReportAclara,
        idTypeDoc,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintReportModalComponent, config);
  }

  /*showProg(user: IUser) {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          console.log('next', next);

          //this.electronicSign();
        }
      },
    };
    const showProg = this.modalService.show(ShowProgrammingComponent, config);
  } */

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  showGoodProgramming() {
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.params.getValue())
      .subscribe(data => {
        this.filterStatusTrans(data.data);
        this.filterStatusGuard(data.data);
        this.filterStatusWarehouse(data.data);
      });
  }

  filterStatusTrans(data: IGoodProgramming[]) {
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_TRANSPORTABLE';
    });

    goodsTrans.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          this.goodsInfoTrans.push(response);
          this.goodsTranportables.load(this.goodsInfoTrans);
          this.totalItemsTransportable = this.goodsTranportables.count();
          this.headingTransportable = `Transportables(${this.goodsTranportables.count()})`;
        },
      });
    });
  }

  filterStatusGuard(data: IGoodProgramming[]) {
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_RESGUARDO_TMP';
    });

    goodsTrans.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          this.goodsInfoGuard.push(response);
          this.goodsGuards.load(this.goodsInfoGuard);
          this.totalItemsGuard = this.goodsGuards.count();
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
        },
      });
    });
  }

  filterStatusWarehouse(data: IGoodProgramming[]) {
    const goodswarehouse = data.filter(items => {
      return items.status == 'EN_ALMACEN_TMP';
    });

    goodswarehouse.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //
          this.goodsInfoWarehouse.push(response);
          this.goodsWarehouse.load(this.goodsInfoWarehouse);
          this.totalItemsWarehouse = this.goodsWarehouse.count();
          this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.count()})`;
        },
      });
    });
  }

  aprobateProgramming() {
    if (!this.programming.contentId) {
      this.alertQuestion(
        'question',
        'Aprobar Programación',
        `¿Esta seguro de aprobar la programación con folio: ${this.programmingId}`
      ).then(question => {
        if (question.isConfirmed) {
          this.sendEmailUsers();
        }
      });
    } else {
      this.alertInfo(
        'info',
        'Acción no permitida',
        'Se necesita firmar el oficio para poder aprobar la solicitud'
      );
    }
  }

  async sendEmailUsers() {
    this.infoUsers.map(user => {
      const emailsUsers = user.email;
      this.emails.push(emailsUsers);
    });

    this.goodsInfoTrans.map(async good => {
      const warehouse = await this.warehouseName(good.storeId);
      const guardObject = {
        goodId: good.goodId,
        uniqueKey: good.uniqueKey,
        goodDescription: good.goodDescription,
        quantity: good.quantity,
        unitMeasure: good.unitMeasure,
        nameWarehouse: warehouse,
      };
      this.transGoods.push(guardObject);
    });

    this.goodsInfoGuard.map(async good => {
      const warehouse = await this.warehouseName(good.storeId);
      const guardObject = {
        goodId: good.goodId,
        uniqueKey: good.uniqueKey,
        goodDescription: good.goodDescription,
        quantity: good.quantity,
        unitMeasure: good.unitMeasure,
        nameWarehouse: warehouse,
      };
      this.guardGoods.push(guardObject);
    });

    this.goodsInfoWarehouse.map(async good => {
      const warehouse = await this.warehouseName(good.storeId);
      const warehouseObject = {
        goodId: good.goodId,
        uniqueKey: good.uniqueKey,
        goodDescription: good.goodDescription,
        quantity: good.quantity,
        unitMeasure: good.unitMeasure,
        nameWarehouse: warehouse,
      };
      this.warehouseGoods.push(warehouseObject);
    });

    const dataEmail = {
      folio: this.programming.folio,
      startDate: this.programming.startDate,
      endDate: this.programming.endDate,
      city: this.programming.city,
      address: this.programming.address,
      usersProg: this.infoUsers,
      goodsTrans: this.transGoods,
      goodsResg: this.guardGoods,
      goodsWarehouse: this.warehouseGoods,
      emailSend: this.emails,
    };

    this.emailService
      .createEmailProgramming(JSON.stringify(dataEmail))
      .subscribe({
        next: () => {
          this.onLoadToast(
            'success',
            'Notificación',
            'Se envio el correo electrónico a los usuarios correctamente'
          );
          this.createTaskNotification();
          this.createTaskExecuteProgramming();
          this.createTaskFormalize();
        },
        error: error => {},
      });
  }

  //Creamos la tarea de notificación al delegado regional//
  async createTaskNotification() {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};

    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Aceptar_Programacion';
    body['ssubtype'] = 'APPROVE';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = _task.assignees;
    task['assigneesDisplayname'] = _task.assigneesDisplayname;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.programmingId);
    task[
      'title'
    ] = `Notificación de Programación con folio: ${this.programming.folio}`;
    task['programmingId'] = this.programmingId;
    //task['requestId'] = this.programmingId;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = user.department;
    task['urlNb'] = 'pages/request/programming-request/schedule-notify';
    task['processName'] = 'SolicitudProgramacion';
    body['task'] = task;

    await this.createTaskOrderService(body);
    this.loading = false;
  }

  //Creamos la tarea de ejecutar la recepción//
  async createTaskExecuteProgramming() {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};
    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Aceptar_Programacion';
    body['ssubtype'] = 'APPROVE_ER';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = _task.assignees;
    task['assigneesDisplayname'] = _task.assigneesDisplayname;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.programmingId);
    task['title'] = `Ejecutar Recepción con folio: ${this.programming.folio}`;
    task['programmingId'] = this.programmingId;
    //task['requestId'] = this.programmingId;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = user.department;
    task['urlNb'] = 'pages/request/programming-request/execute-reception';
    task['processName'] = 'SolicitudProgramacion';
    body['task'] = task;

    await this.createTaskOrderService(body);
    this.loading = false;
  }

  //Creamos la tarea de Formalizar la recepción//
  async createTaskFormalize() {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};

    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Aceptar_Programacion';
    body['ssubtype'] = 'APPROVE_FE';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = _task.assignees;
    task['assigneesDisplayname'] = _task.assigneesDisplayname;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.programmingId);
    task['title'] = `Formalizar entrega con folio: ${this.programming.folio}`;
    task['programmingId'] = this.programmingId;
    //task['requestId'] = this.programmingId;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = user.department;
    task['urlNb'] = 'pages/request/programming-request/formalize-programming';
    task['processName'] = 'SolicitudProgramacion';
    body['task'] = task;

    const taskResult = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult) {
      this.msgGuardado(
        'success',
        'Creación de tarea exitosa',
        `Se creó la tarea ejecutar Recepción con el folio: ${this.programming.folio}`
      );
    }
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

  warehouseName(idWarehouse: number) {
    return new Promise((resolve, reject) => {
      this.warehouseService.getById(idWarehouse).subscribe({
        next: response => {
          return resolve(response.description);
        },
        error: error => {},
      });
    });
  }

  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
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
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['pages/siab-web/sami/consult-tasks']);
      }
    });
  }
}
