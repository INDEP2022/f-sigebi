import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IClarification } from 'src/app/core/models/catalogs/clarification.model';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { IClarificationGoodsReject } from 'src/app/core/models/ms-chat-clarifications/clarification-goods-reject-notifi-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IGoodresdev } from 'src/app/core/models/ms-rejected-good/rejected-good.model';
import { IGetGoodResVe } from 'src/app/core/models/ms-rejectedgood/get-good-goodresdev';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { InappropriatenessFormComponent } from '../inappropriateness-form/inappropriateness-form.component';
import { InappropriatenessPgrSatFormComponent } from '../inappropriateness-pgr-sat-form/inappropriateness-pgr-sat-form.component';

import { NotifyAssetsImproprietyFormComponent } from '../notify-assets-impropriety-form/notify-assets-impropriety-form.component';
import { PrintSatAnswerComponent } from '../print-sat-answer/print-sat-answer.component';
import { RefuseClarificationModalComponent } from '../refuse-clarification-modal/refuse-clarification-modal.component';
import { LIST_ASSETS_COLUMN } from './list-assets-columns';
import { NOTIFY_ASSETS_COLUMNS } from './notify-assets-columns';

@Component({
  selector: 'app-notification-assets-tab',
  templateUrl: './notification-assets-tab.component.html',
  styles: [],
})
export class NotificationAssetsTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() isSaving: boolean;
  @Input() process: string = '';
  idRequest: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsReject = new BehaviorSubject<ListParams>(new ListParams());
  paramsReload = new BehaviorSubject<ListParams>(new ListParams());
  paramsCheckSat = new BehaviorSubject<ListParams>(new ListParams());
  paramsSave = new BehaviorSubject<ListParams>(new ListParams());
  paramsCheckInfo = new BehaviorSubject<ListParams>(new ListParams());
  paramsCheckAclaration = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columns: IGetGoodResVe[] = [];
  columnFilters: any = [];
  totalItems: number = 0;
  notificationsGoods: IGood;
  notificationsList: LocalDataSource = new LocalDataSource();
  valuesNotifications: ClarificationGoodRejectNotification;
  //prueba: IChatClarifications;

  settings2: any;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paramsNotify = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs2: any[] = [];
  totalItems2: number = 0;
  notifyAssetsSelected: any[] = [];
  bsModalRef: BsModalRef;
  formLoading: boolean = false;
  loadingGoods = this.loading;
  loading2 = this.loading;
  requestData: IRequest;
  //verificar por el estado del campo transferente si es SAT O otro
  byInterconnection: boolean = false;

  rowSelected: boolean = false;
  selectedRow: any = null;
  goodsReject: LocalDataSource = new LocalDataSource();
  valueClarification: IClarification;
  valueGood: number;
  valueRejectNotificationId: number;
  dataNotificationSelected: IClarificationGoodsReject;
  clar: boolean = false;
  imp: boolean = false;
  today: Date;
  task: any = null;
  dataTask: ITask;
  buttonsFinish: boolean = false;
  nameTransferent: string = '';
  delRegName: string = '';
  nameStation: string = '';
  nameState: string = '';
  nameAuthority: string = '';
  priority: any = null;
  typeClarification: number = 0;
  good: IGoodresdev[] = [];
  showButton = true;
  notification: ClarificationGoodRejectNotification;
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private rejectedGoodService: RejectedGoodService,
    private chatClarificationsService: ChatClarificationsService,
    private goodService: GoodService,
    private getGoodResVeService: GetGoodResVeService,
    private requestService: RequestService,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private transferentService: TransferenteService,
    private regionalDelegationService: RegionalDelegationService,
    private stationService: StationService,
    private stateOfRepublicService: StateOfRepublicService,
    private authorityService: AuthorityService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.today = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: { ...LIST_ASSETS_COLUMN },
    };
    this.settings2 = {
      ...TABLE_SETTINGS,
      actions: false,

      columns: { ...NOTIFY_ASSETS_COLUMNS },
    };

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'clarificationstatus':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'goodId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'gooddescription':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getGoodsByRequest();
        }
      });
    this.dataRequest();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByRequest());

    this.task = JSON.parse(localStorage.getItem('Task'));

    //Verifica que la tarea esta FINALIZADA, para ocultar botones
    this.paramsReject.getValue()['filter.id'] = this.task.id;
    this.taskService.getAll(this.paramsReject.getValue()).subscribe({
      next: response => {
        this.dataTask = response.data[0];
        if (this.dataTask.State == 'FINALIZADA') {
          this.hideButtons();
        } else {
        }
      },
    });
  }

  dataRequest() {
    this.paramsRequest.getValue()['filter.id'] = this.idRequest;
    this.requestService.getAll(this.paramsRequest.getValue()).subscribe({
      next: async data => {
        data.data.map(data => {
          this.transferentName(data?.transferenceId);
          this.regDelName(data?.regionalDelegationId);
          this.stationName(data?.stationId);
          this.stateName(data?.keyStateOfRepublic);
          this.authorityName(data?.authorityId);
        });
        this.requestData = data.data[0];
      },
      error: error => {},
    });
  }

  transferentName(idTransference: string | number) {
    this.transferentService.getById(idTransference).subscribe({
      next: response => {
        this.nameTransferent = response.nameTransferent;
      },
      error: error => {},
    });
  }

  regDelName(idRegDel: string | number) {
    this.regionalDelegationService.getById(idRegDel).subscribe({
      next: data => {
        this.delRegName = data.description;
      },
      error: error => {},
    });
  }
  stationName(idStation: string | number) {
    this.stationService.getById(idStation).subscribe({
      next: data => {
        this.nameStation = data.stationName;
      },
      error: error => {},
    });
  }

  stateName(stateId: number) {
    this.stateOfRepublicService.getById(stateId).subscribe({
      next: data => {
        this.nameState = data.descCondition;
      },
      error: error => {},
    });
  }

  authorityName(authorityId: string | number) {
    this.authorityService.getById(authorityId).subscribe({
      next: data => {
        this.nameAuthority = data.authorityName;
      },
      error: error => {},
    });
  }

  getGoodsByRequest() {
    this.loadingGoods = true;
    const params1 = new ListParams();
    params1['filter.idrequest'] = `${this.idRequest}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
      ...params1,
    };

    this.getGoodResVeService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.columns);
        this.data.refresh();
        this.loadingGoods = false;
      },
      error: error => (this.loadingGoods = false),
    });
  }

  goodSelect(data: any) {
    if (data.length > 0) {
      this.goodsReject.load(data);
      if (this.goodsReject.count() == 1) {
        this.params2
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getClarificationsByGood(data[0].goodid));
        this.good = data;
      }
    } else {
      this.notificationsList = new LocalDataSource();
    }
  }

  getClarificationsByGood(id: number) {
    this.formLoading = true;
    const params2 = new ListParams();
    params2['filter.goodId'] = `$eq:${id}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
      ...params2,
    };
    this.rejectedGoodService.getAllFilter(params).subscribe({
      next: response => {
        const dataNotification = response.data.map(data => {
          if (data.clarificationType == 'SOLICITAR_ACLARACION') {
            data['clarificationTypeName'] = 'ACLARACIÓN';
          }

          if (data.clarificationType == 'SOLICITAR_IMPROCEDENCIA') {
            data['clarificationTypeName'] = 'IMPROCEDENCIA';
          }
          const formatDate = moment(data.rejectionDate).format('DD-MM-YYYY');
          data.rejectionDate = formatDate;
          return data;
        });
        this.notificationsList.load(dataNotification);
        this.totalItems2 = response.count;
        this.formLoading = false;
      },
      error: error => (this.formLoading = false),
    });
  }

  notifyAssetRowSelected(event: any) {
    this.valuesNotifications = event.data;
    const refuseObj = { ...this.valuesNotifications };
    this.dataNotificationSelected = event.data as IClarificationGoodsReject;
    this.notifyAssetsSelected = event.selected;
    this.valueGood = event.data.goodId;
    this.valueRejectNotificationId = event.data.rejectNotificationId;
  }

  refuseClarification() {
    const dataClarifications2 = this.dataNotificationSelected;

    if (this.rowSelected == false) {
      this.message('Error', 'Seleccione notificación a rechazar');
    } else {
      if (this.selectedRow.answered == 'RECHAZADA') {
        this.message('Error', 'La notificación ya fue rechazada');
      }

      if (
        this.selectedRow.chatClarification.clarificationStatus ==
        'EN_ACLARACION'
      ) {
        this.onLoadToast(
          'warning',
          'Acción no permitida',
          'La notificación ya fue aclarada'
        );
      } else if (this.selectedRow.answered != 'ACLARADA') {
        const refuseObj = { ...this.valuesNotifications }; //Info de sus notificaciones
        const modalConfig = MODAL_CONFIG;
        const idSolicitud = this.idRequest;
        modalConfig.initialState = {
          refuseObj,
          dataClarifications2,
          clarification: this.notifyAssetsSelected,
          idSolicitud,
          callback: (next: boolean) => {
            if (next) {
              this.getClarificationsByGood(refuseObj.goodId);
              this.updateStatusGoodTmp(refuseObj.goodId);
            }
          },
        };
        this.modalService.show(RefuseClarificationModalComponent, modalConfig);
      } else {
        this.onLoadToast(
          'warning',
          'Acción no valida',
          'La notificación ya fue aclarada no se puede rechazar'
        );
      }
    }
  }

  selectRow(row?: any) {
    this.notification = row;
    if (row.chatClarification.clarificationStatus == 'IMPROCEDENCIA') {
      this.showButton = true;
      // const btn8 = document.getElementById('btn8') as HTMLButtonElement | null;
      // btn8?.setAttribute('disabled', '');
    } else {
      this.showButton = true;
    }
    this.selectedRow = row;
    this.rowSelected = true;
  }

  verifyClarification() {
    if (this.goodsReject.count() < this.columns.length) {
      this.onLoadToast(
        'warning',
        'Para verificar el cumplimiento se necesita tener todos los bienes seleccionados',
        ''
      );
    } else {
      this.goodsReject.getElements().then(data => {
        const good = data.map((bien: any) => {
          if (
            bien.clarificationstatus == 'ACLARADO' ||
            bien.clarificationstatus == 'CANCELADO'
          ) {
            return bien;
          }
        });
        const filterGood = good.filter((good: any) => {
          return good;
        });
        if (filterGood.length < this.goodsReject.count()) {
          this.onLoadToast(
            'info',
            'Acción no permitida',
            'El estatus de la notificación de todos los bienes debe de estar en aclarado'
          );
        } else {
          this.alertQuestion(
            'info',
            'Acción',
            'Los bienes seleccionados regresarán al proceso de verificar cumplimiento'
          ).then(async question => {
            if (question.isConfirmed) {
              const updateData = await this.verifyGoodCompliance();
              if (updateData == true) {
                this.createTaskVerifyCompliance();
              }
            }
          });
        }
      });
    }
  }

  verifyGoodCompliance() {
    return new Promise((resolve, reject) => {
      this.goodsReject.getElements().then(data => {
        data.map((bien: IGoodresdev) => {
          console.log('bien', bien);
          this.paramsCheckInfo.getValue()[
            'filter.goodId'
          ] = `$eq:${bien.goodid}`;
          this.rejectedGoodService
            .getAllFilter(this.paramsCheckInfo.getValue())
            .subscribe({
              next: response => {
                response.data.map(notification => {
                  if (
                    notification.clarificationType == 'SOLICITAR_ACLARACION'
                  ) {
                    if (
                      notification.answered == 'ACLARADA' ||
                      notification.answered == 'RECHAZADA'
                    ) {
                      this.updateStatusGood(
                        'ACLARADO',
                        'VERIFICAR_CUMPLIMIENTO',
                        bien.goodid,
                        bien.goodresdev,
                        bien.typeorigin
                      );
                    }
                  } else if (
                    notification.clarificationType == 'SOLICITAR_IMPROCEDENCIA'
                  ) {
                    if (
                      notification.answered == 'IMPROCEDENTE' ||
                      notification.answered == 'RECHAZADA'
                    ) {
                      console.log('IMPROCEDENTE', notification);
                      this.updateStatusGood(
                        'IMPROCEDENTE',
                        'IMPROCEDENTE',
                        bien.goodid,
                        bien.goodresdev,
                        bien.typeorigin
                      );
                    }
                  }
                });
              },
              error: error => {},
            });
        });
        resolve(true);
      });
    });
  }

  /* Metodo para la creación de tarea */
  async createTaskVerifyCompliance() {
    const oldTask: any = await this.getOldTask();
    if (oldTask.assignees != '') {
      const title = `Registro de solicitud (Verificar Cumplimiento) con folio: ${this.requestData.id}`;
      const url = 'pages/request/transfer-request/verify-compliance';
      const from = 'SOLICITAR_ACLARACION';
      const to = 'VERIFICAR_CUMPLIMIENTO';
      const user: any = this.authService.decodeToken();

      const taskResult = await this.createTaskOrderService(
        this.requestData,
        title,
        url,
        from,
        to,
        true,
        this.task.id,
        user.username,
        'SOLICITUD_TRANSFERENCIA',
        'NotificarAclaracion_Improcedencia',
        'VERIFICAR_CUMPLIMIENTO'
      );
      if (taskResult === true) {
        this.msgGuardado(
          'success',
          'Creación de tarea exitosa',
          `Se creó la tarea verificar cumplimiento con el id: ${this.requestData.id}`
        );
      }
    }
  }

  getOldTask() {
    return new Promise((resolve, reject) => {
      const params = new FilterParams();
      params.addFilter('requestId', this.requestData.id);
      const filter = params.getParams();
      this.taskService.getAll(filter).subscribe({
        next: resp => {
          const task = {
            assignees: resp.data[0].assignees,
            assigneesDisplayname: resp.data[0].assigneesDisplayname,
          };
          resolve(task);
        },
        error: error => {
          this.message('error', 'Error al obtener la tarea antigua');
          reject(error.error.message);
        },
      });
    });
  }

  createTaskOrderService(
    request: any,
    title: string,
    url: string,
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
      const user: any = this.authService.decodeToken();
      let body: any = {};

      if (closetask) {
        body['idTask'] = taskId;
        body['userProcess'] = userProcess;
      }
      body['type'] = type;
      body['subtype'] = subtype;
      body['ssubtype'] = ssubtype;

      let task: any = {};
      task['id'] = 0;
      task['assignees'] = this.task.assignees;
      task['assigneesDisplayname'] = this.task.displayName;
      task['creator'] = user.username;
      task['taskNumber'] = Number(request.id);
      task['title'] = title;
      task['programmingId'] = 0;
      task['requestId'] = request.id;
      task['expedientId'] = request.recordId;
      task['urlNb'] = url;
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
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  validateGoodStatus() {
    this.goodsReject.getElements().then(data => {
      data.map((item: IGoodresdev) => {
        if (
          item.clarificationstatus == 'ACLARADO' ||
          item.clarificationstatus == 'CANCELADO'
        ) {
          this.updateStatusGood(
            null,
            'VERIFICAR_CUMPLIMIENTO',
            item.goodid,
            item.goodresdev,
            item.typeorigin
          );
          //Verificar lo de orden de servicio if()
          //Manda a generar la tarea//
        } else {
          this.onLoadToast(
            'info',
            'De los bienes seleccionados, existen bienes sin aclarar para enviar a Verificar Cumplimiento',
            ''
          );
        }
      });
    });
  }

  finishClarifiImpro() {
    let message =
      '¿Está seguro de que desea finalizar la aclaración?\nSe sugiere subir documentación soporte para esta sección';
    this.alertQuestion(
      undefined,
      'Confirmación de Aclaración',
      message,
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        if (
          this.notifyAssetsSelected[0].typeClarification === 'IMPROCEDENCIA'
        ) {
          //el bien se marca como improcedente y desaparece
        } else {
          //estatys cambia a "aclarado"
        }
      }
    });
  }

  acceptClarification() {
    if (this.rowSelected) {
      const notification = this.selectedRow;
      let aclaration: boolean = false;
      let impro: boolean = false;
      let clarificationType1: boolean = false;
      let clarificationType2: boolean = false;
      let type: number = 0;

      if (notification.clarificationType == 'SOLICITAR_ACLARACION') {
        if (notification.answered == 'NUEVA') {
          aclaration = true;
          type = notification.clarification.type;
          if (type == 1) {
            clarificationType1 = true;
          } else if (type == 2) {
            clarificationType2 = true;
          }
        }
      } else if (
        notification.clarificationType == 'SOLICITAR_IMPROCEDENCIA' &&
        notification.answered == 'NUEVA'
      ) {
        impro = true;
      }

      if (aclaration || impro) {
        if (aclaration) {
          if (clarificationType1 || clarificationType2) {
            if (clarificationType1) {
              this.typeClarification = 1;
              this.initializeFormclarification(notification);
            } else if (clarificationType2) {
              this.typeClarification = 2;
              this.initializeFormclarification(notification);
            }
            //Empieza a llamar modal de ACLARACIONES
            this.getRequest(this.typeClarification);
          } else {
            this.onLoadToast(
              'info',
              'Error',
              'Seleccione aclaraciones del mismo tipo'
            );
          }
        } else if (impro) {
          this.initializeFormclarification(notification);
          if (
            this.requestData.transferent.type == 'A' ||
            this.requestData.transferent.type == 'CE'
          ) {
            const type = this.requestData.transferent.type;
            const request = this.requestData;
            const idSolicitud = this.idRequest;

            //Abre formulario improcedencias corta para SAT_SAE y PGR_SAR
            let config = {
              ...MODAL_CONFIG,
              class: 'modal-lg modal-dialog-centered',
            };

            config.initialState = {
              notification,
              request,
              type,
              idSolicitud,
              callback: (next: boolean, idGood: number) => {
                if (next) {
                  this.checkInfoNotification(idGood);
                }
              },
            };
            this.modalService.show(
              InappropriatenessPgrSatFormComponent,
              config
            );
          } else {
            const request = this.requestData;
            const idSolicitud = this.idRequest;
            //Abre formulario para improcedencia MANUAL(NO)
            let config = {
              ...MODAL_CONFIG,
              class: 'modal-lg modal-dialog-centered',
            };
            config.initialState = {
              notification,
              request,
              idSolicitud,
              callback: (next: boolean, idGood: number) => {
                if (next) {
                  this.checkInfoNotification(idGood);
                }
              },
            };

            this.modalService.show(InappropriatenessFormComponent, config);
          }
        }
      } else if (!aclaration && !impro) {
        this.onLoadToast(
          'info',
          'Advertencia',
          'No se han seleccionado aclaraciones o improcedencias pendientes por aclarar'
        );
      } else {
        this.onLoadToast(
          'info',
          'Advertencia',
          'Seleccione solamente aclaraciones o improcedencias'
        );
      }
    } else {
      this.onLoadToast('info', 'Error', 'Selecciona una notificación');
    }
  }

  async initializeFormclarification(
    notification: ClarificationGoodRejectNotification
  ) {
    let inappropriateness: boolean = false;
    if (notification.clarificationType == 'SOLICITAR_IMPROCEDENCIA')
      inappropriateness = true;
    const typeDocument = await this.obtainTypeDocument(
      inappropriateness,
      notification
    );

    let userCreation = notification.creationUser;
    let insertGood: boolean = null;
    let idDocto = null;
  }

  obtainTypeDocument(
    inappropriateness: boolean,
    notification: ClarificationGoodRejectNotification
  ) {
    let typeTransference = this.requestData.typeOfTransfer;
    let generaXML: boolean = false;
    let type: string = null;
    if (
      typeTransference == 'SAT_SAE' &&
      notification.chatClarification.idClarificationType == '2'
    )
      generaXML = true;
  }

  FinishClariImpro() {
    const notification = this.selectedRow;
    if (notification != null) {
      let improcedencia: boolean = false;
      let aclaracion: boolean = false;

      if (notification.clarificationType == 'SOLICITAR_ACLARACION') {
        if (notification.answered == 'EN ACLARACION') {
          aclaracion = true;
        } else {
          this.onLoadToast(
            'info',
            'Acción invalida',
            'Se necesita tener la aclaración en status: EN ACLARACION'
          );
        }
      } else if (notification.clarificationType == 'SOLICITAR_IMPROCEDENCIA') {
        if (notification.answered == 'EN ACLARACION') {
          improcedencia = true;
        } else {
          this.onLoadToast(
            'info',
            'Acción invalida',
            'Se necesita tener la aclaración en status: EN ACLARACION'
          );
        }
      }

      if (aclaracion || improcedencia) {
        if (aclaracion) {
          this.alertQuestion(
            'question',
            'Finalizar',
            '¿Desea Finalizar la Aclaración?'
          ).then(question => {
            if (question.isConfirmed) {
              this.endAclaration();
            }
          });
        } else if (improcedencia) {
          this.alertQuestion(
            'question',
            'Finalizar',
            '¿Desea Finalizar la Improcedencia?'
          ).then(question => {
            if (question.isConfirmed) {
              this.endImpinappropriateness();
            }
          });
        }
      }
    } else {
      this.onLoadToast('info', 'Error', 'Seleccione al menos un registro');
    }
  }

  endAclaration() {
    if (
      this.selectedRow.clarificationType == 'SOLICITAR_ACLARACION' &&
      this.selectedRow.answered == 'EN ACLARACION'
    ) {
      const data: ClarificationGoodRejectNotification = {
        rejectNotificationId: this.selectedRow.rejectNotificationId,
        answered: 'ACLARADA',
        rejectionDate: '2023-04-30',
      };
      this.rejectedGoodService
        .update(this.selectedRow.rejectNotificationId, data)
        .subscribe({
          next: async data => {
            await this.updateStatusGoodTmp(this.selectedRow.goodId);
          },
          error: error => {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al actualizar el status de la notifiación'
            );
          },
        });
    }
  }

  async endImpinappropriateness() {
    if (
      this.selectedRow.clarificationType == 'SOLICITAR_IMPROCEDENCIA' &&
      this.selectedRow.answered == 'EN ACLARACION'
    ) {
      const data: ClarificationGoodRejectNotification = {
        rejectNotificationId: this.selectedRow.rejectNotificationId,
        answered: 'IMPROCEDENTE',
        rejectionDate: '2023-04-30',
      };
      this.rejectedGoodService
        .update(this.selectedRow.rejectNotificationId, data)
        .subscribe({
          next: async data => {
            await this.updateStatusGoodTmp(this.selectedRow.goodId);
          },
          error: error => {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al actualizar el status de la notifiación'
            );
          },
        });
    }
  }

  message(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: undefined,
      width: 300,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        return;
      }
    });
  }

  getRequest(typeClarification?: number) {
    const typeClarifications = typeClarification;
    this.paramsRequest.getValue()['filter.id'] = this.idRequest;
    this.requestService.getAll(this.paramsRequest.getValue()).subscribe({
      next: response => {
        const infoRequest = response.data[0];
        this.openModal(infoRequest, typeClarifications, typeClarification);
      },
    });
  }

  openModal(
    infoRequest?: IRequest,
    idClarification?: number,
    typeClarification?: number
  ): void {
    const typeClarifications = this.typeClarification;
    const dataClarifications2 = this.dataNotificationSelected;
    const rejectedID = this.valueRejectNotificationId;
    const goodValue = this.valueGood;
    const dataNotification = this.valueClarification;
    const idNotify = { ...this.notificationsGoods };
    const idAclara = this.selectedRow.clarification.type; //Id del tipo de aclaración
    const idSolicitud = this.idRequest;

    let config: ModalOptions = {
      initialState: {
        //Quitar algunas variable que se pueden remplazar por los objetos que se estan enviado
        dataClarifications2,
        rejectedID,
        goodValue,
        dataNotification,
        idClarification,
        idAclara,
        clarification: this.notifyAssetsSelected,
        isInterconnection: this.byInterconnection,
        idRequest: this.idRequest,
        infoRequest,
        typeClarifications,
        idSolicitud,
        callback: (next: boolean, idGood: number) => {
          if (next) {
            this.checkInfoNotification(idGood);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      NotifyAssetsImproprietyFormComponent,
      config
    );
  }

  checkInfoNotification(idGood: number) {
    this.paramsCheckInfo.getValue()['filter.goodId'] = `$eq:${idGood}`;
    this.rejectedGoodService
      .getAllFilter(this.paramsCheckInfo.getValue())
      .subscribe({
        next: response => {
          const dataNotification = response.data.map(data => {
            if (data.clarificationType == 'SOLICITAR_ACLARACION') {
              data['clarificationTypeName'] = 'ACLARACIÓN';
            }

            if (data.clarificationType == 'SOLICITAR_IMPROCEDENCIA') {
              data['clarificationTypeName'] = 'IMPROCEDENCIA';
            }
            const formatDate = moment(data.rejectionDate).format('DD-MM-YYYY');
            data.rejectionDate = formatDate;
            return data;
          });
          this.notificationsList.load(dataNotification);
          this.totalItems2 = response.count;
          this.formLoading = false;
        },
        error: error => {},
      });
  }

  //Respuesta del SAT
  satAnswer() {
    if (this.rowSelected == false) {
      this.message('Error', 'Primero seleccione una notificación');
    } else {
      if (this.selectedRow.answered == 'RECHAZADA') {
        this.message('Error', 'La notificación ya fue rechazada');
      } else {
        if (this.selectedRow.chatClarification == null) {
          this.message('Aviso', 'Aún no hay una respuesta del SAT');
        } else {
          if (this.selectedRow.chatClarification.satClarification == null) {
            this.message('Aviso', 'Aún no hay una respuesta del SAT');
          } else {
            const idNotify = { ...this.notificationsGoods };
            const idAclaracion = this.selectedRow.clarification.id; //ID de la aclaración para mandar al reporte del sat
            const idSolicitud = this.idRequest;
            let config: ModalOptions = {
              initialState: {
                idAclaracion,
                idSolicitud,
                callback: (next: boolean) => {
                  this.getClarificationsByGood(idNotify.goodId);
                },
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PrintSatAnswerComponent, config);
          }
        }
      }
    }
  }

  saveData() {
    if (this.selectedRow) {
      if (
        this.selectedRow.chatClarification.clarificationStatus == 'A_ACLARACION'
      ) {
        const updateInfo: IChatClarifications = {
          requestId: this.idRequest,
          goodId: this.selectedRow.goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatClarificationsService
          .update(
            this.selectedRow.chatClarification.idClarification,
            updateInfo
          )
          .subscribe({
            next: data => {
              this.onLoadToast('success', 'Bien guardado correctamente', '');
              this.getGoodsByRequest();
              this.notificationsList = new LocalDataSource();
            },
            error: error => {},
          });
      } else {
        this.onLoadToast(
          'info',
          'La notificación se debe de encontrar en status para a aclaración',
          ''
        );
      }
      //Valida que tenga observaciones que solo se llena si es rechazada la notificación
      if (this.selectedRow.observations != null) {
        //Objeto para modificar ChatClarifications
        const updateInfo: IChatClarifications = {
          requestId: this.idRequest,
          goodId: this.selectedRow.goodId,
          clarificationStatus: null, //Cambia a nulo
        };
        //Servicio para actualizar ChatClarifications
        this.chatClarificationsService
          .update(
            this.selectedRow.chatClarification.idClarification,
            updateInfo
          )
          .subscribe({
            next: data => {
              this.onLoadToast('success', 'Bien guardado correctamente', '');
              this.updateNotifyRejectRefuse();

              this.getGoodsByRequest();
              this.notificationsList = new LocalDataSource();
            },
            error: error => {},
          });
      }
    } else {
      this.onLoadToast(
        'warning',
        'Para guardar información se necesita tener una aclaración o una notificación seleccionada',
        ''
      );
    }
  }

  updateNotifyRejectRefuse() {
    const valuesClarifications = { ...this.valuesNotifications };
    const dataClarifications: ClarificationGoodRejectNotification = {
      clarificationId: valuesClarifications.rejectNotificationId,
      rejectionDate: valuesClarifications.rejectionDate,
      rejectNotificationId: valuesClarifications.rejectNotificationId,
      answered: 'RECHAZADA',
      clarificationType: 'IMPROCEDENCIA',
      observations: null,
    };
    this.rejectedGoodService
      .update(this.selectedRow.rejectNotificationId, dataClarifications)
      .subscribe({
        next: response => {},
        error: error => {},
      });
  }

  updateStatusGoodRefuse() {
    const valuesClarifications = { ...this.valuesNotifications };
    if (valuesClarifications) {
      const good: IGood = {
        id: valuesClarifications.goodId,
        goodId: valuesClarifications.goodId,
        goodStatus: 'ACLARADO',
      };
      this.goodService.update(good).subscribe({
        next: data => {
          this.getGoodsByRequest();
        },
        error: error => {
          console.log(error);
        },
      });
    }
  }

  reloadData() {
    if (this.requestData.typeOfTransfer == 'SAT_SAE') {
      if (this.columns.length > 0) {
        this.columns.map(bien => {
          this.paramsReload.getValue()['filter.goodId'] = bien.goodid;
          this.rejectedGoodService
            .getAllFilter(this.paramsReload.getValue())
            .subscribe({
              next: data => {
                if (bien.clarificationstatus != 'ACLARADO') {
                  data.data.map(notification => {
                    if (
                      notification.clarificationType == 'SOLICITAR_ACLARACION'
                    ) {
                      if (notification.answered == 'EN ACLARACION') {
                        if (
                          notification.chatClarification.clarificationStatus ==
                          'EN_ACLARACION'
                        ) {
                          const data: ClarificationGoodRejectNotification = {
                            rejectNotificationId:
                              notification.rejectNotificationId,
                            rejectionDate: new Date(),
                            answered: 'ACLARADA',
                          };

                          this.rejectedGoodService
                            .update(notification.rejectNotificationId, data)
                            .subscribe({
                              next: () => {},
                              error: error => {
                                console.log(error);
                              },
                            });

                          if (notification.clarification.type == 2) {
                            //
                          }
                        } else if (
                          notification.chatClarification.clarificationStatus ==
                          'RECHAZADO'
                        ) {
                          const data: ClarificationGoodRejectNotification = {
                            rejectNotificationId:
                              notification.rejectNotificationId,
                            answered: 'RECHAZADA',
                            rejectionDate: new Date(),
                          };

                          this.rejectedGoodService
                            .update(notification.rejectNotificationId, data)
                            .subscribe({
                              next: () => {},
                              error: error => {
                                console.log(error);
                              },
                            });
                        }
                      }

                      this.checkStatusNotifications(
                        notification.goodId,
                        bien.typeorigin
                      );
                    } else if (
                      notification.clarificationType ==
                      'SOLICITAR_IMPROCEDENCIA'
                    ) {
                      this.checkStatusNotifications(
                        notification.goodId,
                        bien.typeorigin
                      );
                    } else if (notification.answered == 'IMPROCEDENTE') {
                      this.updateStatusGood(
                        'IMPROCEDENTE',
                        'IMPROCEDENTE',
                        notification.goodId,
                        notification.goodResDevId,
                        bien.typeorigin
                      );
                    }
                  });
                } else {
                  this.onLoadToast(
                    'info',
                    'Todas las notificaciones ya se encuentran aclaradas',
                    ''
                  );
                }
              },
              error: error => {},
            });
        });
      } else {
        this.onLoadToast('warning', 'No se tienen bienes para actualizar', '');
      }
    } else if (this.requestData.typeOfTransfer == 'PGR_SAE') {
      //this.validateStatusAclaration();
    }
  }

  checkStatusNotifications(idGood: number, typeOrigin: string) {
    this.paramsCheckSat.getValue()['filter.goodId'] = idGood;
    this.rejectedGoodService
      .getAllFilter(this.paramsCheckSat.getValue())
      .subscribe({
        next: data => {
          this.notificationsList.load(data.data);
          data.data.map(notification => {
            if (notification.clarificationType == 'SOLICITAR_ACLARACION') {
              if (
                notification.answered == 'NUEVA' ||
                notification.answered == 'EN ACLARACION'
              ) {
                this.clar = true;
              }
            }

            if (notification.clarificationType == 'SOLICITAR_IMPROCEDENCIA') {
              if (
                notification.answered == 'NUEVA' ||
                notification.answered == 'EN ACLARACION'
              ) {
                this.clar = true;
              }
            }

            if (!this.clar) {
              if (notification.answered == 'ACLARADA') {
                this.updateStatusGood(
                  'ACLARADO',
                  null,
                  notification.goodId,
                  notification.goodResDevId,
                  typeOrigin
                );
              } else if (
                notification.clarificationId == 19 &&
                notification.answered == 'RECHAZADA'
              ) {
                this.updateStatusGood(
                  'CANCELADO',
                  null,
                  notification.goodId,
                  notification.goodResDevId,
                  typeOrigin
                );
              }
            }
          });
        },
        error: error => {
          console.log(error);
        },
      });
  }

  saveDocumentResponse(notify: ClarificationGoodRejectNotification) {
    this.requestService.getById(this.idRequest).subscribe({
      next: data => {
        const docInfo = {
          xdelegacionRegional: data?.regionalDelegationId,
          xcontribuyente: data?.indicatedTaxpayer,
          xestado: data?.keyStateOfRepublic,
          xidBien: notify?.goodId,
          xidExpediente: data?.recordId,
          xidTransferente: data?.transferenceId,
          xidSolicitud: this.idRequest,
          //xnoOficio:  // pendiente el no oficio,
          xtipoTransferencia: 'SAT_SAE',
          xnivelRegistroNSBDB: 'Bien',
          xnombreProceso: 'Notificar Aclaraciones',
          xtipoDocumento: 105,
        };
      },
    });
  }

  endClarification() {
    this.data.getElements().then(data => {
      data.map((good: IGoodresdev) => {
        if (
          good.clarificationstatus == 'ACLARADO' ||
          good.clarificationstatus == 'CANCELADO'
        ) {
          if (good.typeorigin == 'DOC_COMPLEMENTARIA') {
            this.alertQuestion(
              'question',
              'Finalizar',
              '¿Desea finalizar el proceso de aclaraciones?'
            ).then(question => {
              if (question.isConfirmed) {
                const result: string = '';
                const status: number = 0;
                this.changeStatusTask();
                //this.endProcess();
                //this.validateGoodStatus();
              }
            });
          } else if (good.typeorigin == 'SOL_TRANSFERENCIA') {
            this.alertQuestion(
              'question',
              'Finalizar',
              '¿Desea finalizar el proceso de aclaraciones?'
            ).then(question => {
              if (question.isConfirmed) {
                const result: string = '';
                const status: number = 0;
                //this.validateGoodStatus();
                //Cambiar estado de la tarea
                this.changeStatusTask();
                //this.endProcess();
              }
            });
          }
        } else {
          this.onLoadToast(
            'warning',
            'Se necesita tener todos los bienes aclarados',
            ''
          );
        }
      });
    });
  }

  //Cambia el State a FINALIZADA
  changeStatusTask() {
    this.task = JSON.parse(localStorage.getItem('Task'));
    this.paramsReject.getValue()['filter.id'] = this.task.id;
    this.taskService.getAll(this.paramsReject.getValue()).subscribe({
      next: response => {
        this.dataTask = response.data[0];
        this.updateStatusTask(this.dataTask);
      },
      error: error => {},
    });
  }

  updateStatusTask(dataTask: ITask) {
    //Contruir objeto con valores para Task
    const model: ITask = {
      id: dataTask.id,
      taskNumber: dataTask.taskNumber,
      assignees: dataTask.assignees,
      assigneesDisplayname: dataTask.assigneesDisplayname,
      State: 'FINALIZADA', //Valor a cambiar
      urlNb: dataTask.urlNb,
      programmingId: dataTask.programmingId,
      requestId: dataTask.requestId,
      expedientId: dataTask.expedientId,
    };

    //Actualizar State a FINALIZADA
    this.taskService.update(dataTask.id, model).subscribe({
      next: response => {
        //Desahabilita los botones
        this.hideButtons();

        //Salir del flujo y a las tareas
        this.endProcess();
      },
      error: error => {
        this.buttonsFinish = true;
      },
    });
  }

  hideButtons() {
    const btn1 = document.getElementById('btn1') as HTMLButtonElement | null;
    btn1?.setAttribute('disabled', '');
    const btn2 = document.getElementById('btn2') as HTMLButtonElement | null;
    btn2?.setAttribute('disabled', '');
    const btn3 = document.getElementById('btn3') as HTMLButtonElement | null;
    btn3?.setAttribute('disabled', '');
    const btn4 = document.getElementById('btn4') as HTMLButtonElement | null;
    btn4?.setAttribute('disabled', '');
    const btn5 = document.getElementById('btn5') as HTMLButtonElement | null;
    btn5?.setAttribute('disabled', '');
    const btn6 = document.getElementById('btn6') as HTMLButtonElement | null;
    btn6?.setAttribute('disabled', '');
    const btn7 = document.getElementById('btn7') as HTMLButtonElement | null;
    btn7?.setAttribute('disabled', '');
  }

  endProcess() {
    const result: string = '';
    const status: number = 0;
    this.data.getElements().then(item => {
      item.map((data: IGoodresdev) => {
        if (data.typeorigin == 'DOC_COMPLEMENTARIA') {
          const dataGood: ClarificationGoodRejectNotification = {
            statusProcess: 'VERIFICAR_CUMPLIMIENTO',
          };
          this.rejectedGoodService.update(data.goodresdev, dataGood).subscribe({
            next: response => {},
            error: error => {},
          });
        } else if (data.typeorigin == 'SOL_TRANSFERENCIA') {
          this.router.navigate(['pages/siab-web/sami/consult-tasks']);
        }
      });
    });
  }

  updateStatusGood(
    statusGood?: string,
    statusProcess?: string,
    idGood?: number,
    idGoodResDev?: number,
    typeOrigin?: string
  ) {
    if (typeOrigin == 'SOL_TRANSFERENCIA') {
      if (statusGood) {
        const good: IGood = {
          id: idGood,
          goodId: idGood,
          goodStatus: statusGood,
          processStatus: statusProcess,
        };
        this.goodService.update(good).subscribe({
          next: data => {
            console.log('actualizado', data);
          },
          error: error => {
            console.log(error);
          },
        });
      }

      if (statusProcess) {
        const good: IGood = {
          id: idGood,
          goodId: idGood,
          goodStatus: statusGood,
          processStatus: statusProcess,
        };
        this.goodService.update(good).subscribe({
          next: data => {},
          error: error => {
            console.log(error);
          },
        });
      }
    } else if (typeOrigin == 'DOC_COMPLEMENTARIA') {
      if (statusGood) {
        const goodReject: ClarificationGoodRejectNotification = {
          statusGood: statusGood,
          statusProcess: statusProcess, // Verificar porque se tiene id
        };

        this.rejectedGoodService.update(idGoodResDev, goodReject).subscribe({
          next: response => {},
          error: error => {},
        });
      }

      if (statusProcess) {
        const goodReject: ClarificationGoodRejectNotification = {
          statusGood: statusGood,
          statusProcess: statusProcess, // Verificar porque se tiene id
        };

        this.rejectedGoodService.update(idGoodResDev, goodReject).subscribe({
          next: response => {},
          error: error => {},
        });
      }
    }
  }

  changeStatuesTmp() {
    if (this.rowSelected == false) {
      this.message('Error', 'Primero seleccione una notificación');
    } else {
      if (
        this.selectedRow.answered == 'ACLARADA' &&
        this.selectedRow.chatClarification.clarificationStatus == 'ACLARADO'
      ) {
        this.onLoadToast(
          'info',
          'Acción no permitida',
          'Ya se simulo una respuesta del SAT'
        );
      }
      if (this.selectedRow.answered == 'RECHAZADA') {
        this.message('Error', 'La notificación ya fue rechazada');
      } else {
        if (this.selectedRow.chatClarification == null) {
          this.message('Aviso', 'Aún no hay una respuesta del SAT');
        }

        if (
          this.selectedRow.answered == 'EN ACLARACION' &&
          this.selectedRow.chatClarification.clarificationStatus ==
            'EN_ACLARACION' &&
          this.selectedRow.chatClarification.satClarify == null
        ) {
          if (this.selectedRow.clarificationType == 'SOLICITAR_ACLARACION') {
            this.updateChatClarificationsTmp();
          } else if (
            this.selectedRow.clarificationType == 'SOLICITAR_IMPROCEDENCIA'
          ) {
            this.updateChatImprClarificationTmp();
          }
        } else if (this.selectedRow.answered != 'RECHAZADA') {
          this.onLoadToast(
            'info',
            'Acción no permitida',
            'El status de la notificación y el de la aclaración debe de estar: EN ACLARACIÓN'
          );
        }
      }
    }
  }

  updateChatClarificationsTmp() {
    //Cambiar estado a ChatClarifications
    const refuseObj = { ...this.valuesNotifications };
    const respuesta = `RESPUESTA DEL SAT ${refuseObj.chatClarification.id}`;
    const modelChatClarifications: IChatClarifications = {
      id: Number(refuseObj.chatClarification.idClarification), //ID primaria /Esta propiedad es importante, se le debe asignar a bienes_recha_notif_aclara
      requestId: Number(refuseObj.chatClarification.id),
      goodId: refuseObj.chatClarification.idProperty,
      satClarify: respuesta,
      //clarifiNewsRejectId: Number(this.refuseObj.chatClarification.clarificationDate), //Establecer ID de bienes_recha_notif_aclara
      clarificationStatus: 'ACLARADO', //Este estado cambia cuando se manda a guardar el formulario, tanto largo como corto
    };

    this.chatClarificationsService
      .update(
        refuseObj.chatClarification.idClarification,
        modelChatClarifications
      )
      .subscribe({
        next: async data => {
          const idGood = Number(modelChatClarifications.goodId);
          //this.getClarificationsByGood(idGood);
          this.updateStatusClarificationsTmp(data.goodId);
          //this.updateStatusGoodTmp(data.goodId);
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  updateChatImprClarificationTmp() {
    //Cambiar estado a ChatClarifications
    const refuseObj = { ...this.valuesNotifications };
    const respuesta = `RESPUESTA DEL SAT ${refuseObj.chatClarification.id}`;
    const modelChatClarifications: IChatClarifications = {
      id: Number(refuseObj.chatClarification.idClarification), //ID primaria /Esta propiedad es importante, se le debe asignar a bienes_recha_notif_aclara
      requestId: Number(refuseObj.chatClarification.id),
      goodId: refuseObj.chatClarification.idProperty,
      satClarify: respuesta,
      //clarifiNewsRejectId: Number(this.refuseObj.chatClarification.clarificationDate), //Establecer ID de bienes_recha_notif_aclara
      clarificationStatus: 'IMPROCEDENTE', //Este estado cambia cuando se manda a guardar el formulario, tanto largo como corto
    };

    this.chatClarificationsService
      .update(
        refuseObj.chatClarification.idClarification,
        modelChatClarifications
      )
      .subscribe({
        next: async data => {
          const idGood = Number(modelChatClarifications.goodId);
          //this.getClarificationsByGood(idGood);
          this.updateStatusClarificationsImpTmp(data.goodId);
          //this.updateStatusGoodTmp(data.goodId);
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  updateStatusClarificationsTmp(goodId: number) {
    const refuseObj = { ...this.valuesNotifications };
    //Cambiar estado a clarifications
    const modelClarifications: ClarificationGoodRejectNotification = {
      rejectNotificationId: refuseObj.rejectNotificationId,
      rejectionDate: this.today,
      answered: 'ACLARADA',
      observations: null,
    };
    this.rejectedGoodService
      .update(refuseObj.rejectNotificationId, modelClarifications)
      .subscribe({
        next: data => {
          this.updateStatusGoodTmp(goodId);
          //this.updateChatClarifications();
          //this.updateClarifications(); Actualizar Objeto de Clarifications/notificaciones, pasar clarification a nulo y type a nul
        },
        error: error => (this.loading = false),
      });
  }

  updateStatusClarificationsImpTmp(goodId: number) {
    const refuseObj = { ...this.valuesNotifications };
    //Cambiar estado a clarifications
    const modelClarifications: ClarificationGoodRejectNotification = {
      rejectNotificationId: refuseObj.rejectNotificationId,
      rejectionDate: this.today,
      answered: 'IMPROCEDENTE',
      observations: null,
    };
    this.rejectedGoodService
      .update(refuseObj.rejectNotificationId, modelClarifications)
      .subscribe({
        next: data => {
          this.updateStatusGoodTmp(goodId);
          //this.updateChatClarifications();
          //this.updateClarifications(); Actualizar Objeto de Clarifications/notificaciones, pasar clarification a nulo y type a nul
        },
        error: error => (this.loading = false),
      });
  }

  updateStatusGoodTmp(idGood: number) {
    return new Promise((resolve, reject) => {
      this.paramsCheckAclaration.getValue()['filter.goodId'] = `$eq:${idGood}`;

      this.rejectedGoodService
        .getAllFilter(this.paramsCheckAclaration.getValue())
        .subscribe({
          next: data => {
            const dataNotification = data.data.map(data => {
              if (data.clarificationType == 'SOLICITAR_ACLARACION') {
                data['clarificationTypeName'] = 'ACLARACIÓN';
              }

              if (data.clarificationType == 'SOLICITAR_IMPROCEDENCIA') {
                data['clarificationTypeName'] = 'IMPROCEDENCIA';
              }
              const formatDate = moment(data.rejectionDate).format(
                'DD-MM-YYYY'
              );
              data.rejectionDate = formatDate;
              return data;
            });

            this.notificationsList.load(dataNotification);

            this.notificationsList.getElements().then(item => {
              item.map((data: ClarificationGoodRejectNotification) => {
                if (data.clarificationType == 'SOLICITAR_ACLARACION') {
                  if (
                    data.answered == 'ACLARADA' ||
                    data.answered == 'RECHAZADA'
                  ) {
                    const good: IGood = {
                      id: data.goodId,
                      goodId: data.goodId,
                      goodStatus: 'ACLARADO',
                    };
                    this.goodService.update(good).subscribe({
                      next: data => {
                        this.getGoodsByRequest();
                        this.notificationsList = new LocalDataSource();
                      },
                      error: error => {
                        console.log(error);
                      },
                    });
                  }
                } else if (
                  data.clarificationType == 'SOLICITAR_IMPROCEDENCIA'
                ) {
                  if (
                    data.answered == 'IMPROCEDENTE' ||
                    data.answered == 'RECHAZADA'
                  ) {
                    const good: IGood = {
                      id: data.goodId,
                      goodId: data.goodId,
                      goodStatus: 'ACLARADO',
                    };
                    this.goodService.update(good).subscribe({
                      next: data => {
                        this.getGoodsByRequest();
                        this.notificationsList = new LocalDataSource();
                      },
                      error: error => {
                        console.log(error);
                      },
                    });
                  }
                }
              });
            });
          },
        });
      resolve(true);
    });
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
        this.endClarification();
      }
    });
  }
}
