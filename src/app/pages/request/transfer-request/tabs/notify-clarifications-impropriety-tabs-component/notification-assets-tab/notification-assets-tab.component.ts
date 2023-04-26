import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
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
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
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
  goodsReject: IGoodresdev[] = [];
  valueClarification: IClarification;
  valueGood: number;
  valueRejectNotificationId: number;
  dataNotificationSelected: IClarificationGoodsReject;
  clar: boolean = false;
  imp: boolean = false;
  today: Date;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private rejectedGoodService: RejectedGoodService,
    private chatClarificationsService: ChatClarificationsService,
    private goodService: GoodService,
    private getGoodResVeService: GetGoodResVeService,
    private requestService: RequestService,
    private authService: AuthService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.today = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    //la accion del guardar llega al hijo
  }

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
      selectMode: 'multi',
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
  }

  dataRequest() {
    this.requestService.getById(this.idRequest).subscribe({
      next: data => {
        this.requestData = data;
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
    this.goodsReject = data;
    if (this.goodsReject.length == 1) {
      this.params2
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getClarificationsByGood(data[0].goodid));
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
        this.notificationsList.load(response.data);
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
      } else {
        const refuseObj = { ...this.valuesNotifications }; //Info de sus notificaciones

        const modalConfig = MODAL_CONFIG;
        modalConfig.initialState = {
          refuseObj,
          dataClarifications2,
          clarification: this.notifyAssetsSelected,
          callback: (next: boolean) => {
            if (next) {
              this.getClarificationsByGood(refuseObj.goodId);
              //this.selectedRow.answered = 'EN';
              /*this.notificationsList.getElements().then(data => {
              data.map((item: ClarificationGoodRejectNotification) => {
                if (
                  item.rejectNotificationId ==
                  this.selectedRow.rejectNotificationId
                ) {
                  item.answered = 'EN ACLARACION';
                  item.chatClarification.clarificationStatus = 'EN_ACLARACION';
                  item.clarificationType = 'ACLARACIÓN';
                }
              });
              this.notificationsList.refresh();
            });*/
            }
          },
        };
        this.modalService.show(RefuseClarificationModalComponent, modalConfig);
      }
    }

    //ver si los datos se devolveran por el mismo modal o se guardan

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }

  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  verifyClarification() {
    if (this.goodsReject.length < this.columns.length) {
      this.onLoadToast(
        'warning',
        'Para verificar el cumplimiento se necesita tener todos los bienes seleccionados',
        ''
      );
    } else {
      this.goodsReject.map(bien => {
        if (
          bien.clarificationstatus == 'ACLARADO' ||
          bien.clarificationstatus == 'CANCELADO'
        ) {
          /*this.updateStatusGood(
            null,
            'VERIFICAR_CUMPLIMIENTO',
            bien.goodid,
            bien.goodresdev,
            bien.typeorigin
          ); */
          let user = this.authService.decodeToken();
          if (user.employeetype == 'TE') {
            //Se actualiza el orden de servicio
          }

          //this.createTaskVerifyCompliance();
        } else {
          this.onLoadToast(
            'info',
            'Aun se tiene aclaraciones sin ser aclaradas',
            ''
          );
        }
      });
    }
  }

  /* Metodo para notificacion de aclaraciones */
  /*async createTaskVerifyCompliance() {
    this.loader.load = true;
    const title = `Registro de solicitud (Verificar Cumplimiento) con folio: ${this.requestData.id}`;
    const url = 'pages/request/transfer-request/verify-compliance';
    const from = 'NOTIFICAR_ACLARACIONES';
    const to = 'VERIFICAR_CUMPLIMIENTO';
    const user: any = this.authService.decodeToken();
    const taskRes = await this.createTaskOrderService(
      this.requestData,
      title,
      url,
      from,
      to,
      true,
      this.task.id,
      user.username,
      'SOLICITUD_TRANSFERENCIA',
      'Destino_Documental',
      'NOTIFICAR_ACLARACIONES'
    );
    if (taskRes) {
      this.loader.load = false;
      this.msgGuardado(
        'success',
        'Verificación de Cumplimiento',
        `Se generó una Verificación de Cumplimiento con el folio: ${this.requestData.id}`
      );
    }
  } */

  /*createTaskOrderService(
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
  } */

  validateGoodStatus() {
    this.goodsReject.map(item => {
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
  }

  finishClarifiImpro() {
    let message =
      '¿Esta seguro de que desea finalizar la aclaración?\nSe sugiere subir documentación soporte para esta sección';
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

  acceptClariImpro() {
    if (this.rowSelected == false) {
      this.message('Error', 'Seleccione notificación a aceptar');
    } else {
      if (this.selectedRow.answered == 'RECHAZADA') {
        this.message('Error', 'La notificación ya fue rechazada');
      }

      if (this.selectedRow.clarification.type < 1) {
        this.message('Error', 'Seleccione almenos un registro!');
        return;
      }
      this.openModal();
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

  openModal(idClarification?: number): void {
    const dataClarifications2 = this.dataNotificationSelected;
    const rejectedID = this.valueRejectNotificationId;
    const goodValue = this.valueGood;
    const dataNotification = this.valueClarification;
    const idNotify = { ...this.notificationsGoods };
    const idAclara = this.selectedRow.clarification.type; //Id del tipo de aclaración
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
        next: data => {
          this.notificationsList.load(data.data);
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
            let config: ModalOptions = {
              initialState: {
                idAclaracion,
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
              //console.log('data update', data);
              //this.getClarificationsByGood()
              this.onLoadToast('success', 'Bien guardado correctamente', '');
              this.getGoodsByRequest();
              this.notificationsList = new LocalDataSource();
            },
            error: error => {},
          });
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
              //console.log('data update', data);
              //this.getClarificationsByGood()
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
    /*if (this.columns) {
      this.columns.map(item => {
        this.paramsSave.getValue()['filter.goodId'] = item.goodid;
        this.rejectedGoodService
          .getAllFilter(this.paramsSave.getValue())
          .subscribe({
            next: data => {
              data.data.map(item => {
                if (
                  item.chatClarification.clarificationStatus == 'A_ACLARACION'
                ) {
                  const updateInfo: IChatClarifications = {
                    requestId: this.idRequest,
                    goodId: item.goodId,
                    clarificationStatus: 'EN_ACLARACION',
                  };
                  //console.log(item.chatClarification);
                  this.chatClarificationsService
                    .update(item.chatClarification.idClarification, updateInfo)
                    .subscribe({
                      next: data => {
                        //console.log('data update', data);
                        //this.getClarificationsByGood()
                        this.onLoadToast(
                          'success',
                          'Bien guardado correctamente',
                          ''
                        );
                      },
                      error: error => {},
                    });
                }
              });
            },
            error: error => {},
          });
      });
    } else {
      this.onLoadToast('warning', 'No se encontraron bienes para aclarar', '');
    } */
  }

  updateNotifyRejectRefuse() {
    //Actualiza información de la notificación rechazada
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
        error: error => {
          console.log('No se actualizó', error.error);
        },
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
    if (this.requestData.typeOfTransfer == 'MANUAL') {
      // El tipo debe de ser SAT_SAE el nombre manual no existe
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
                          // Se debe de tener ACLARADO
                          console.log('notification', notification);

                          const data: ClarificationGoodRejectNotification = {
                            rejectNotificationId:
                              notification.rejectNotificationId,
                            rejectionDate: new Date(),
                            answered: 'ACLARADA',
                          };

                          this.rejectedGoodService
                            .update(notification.rejectNotificationId, data)
                            .subscribe({
                              next: () => {
                                console.log('Aclarada');
                              },
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
                              next: () => {
                                console.log('Rechazado');
                              },
                              error: error => {
                                console.log(error);
                              },
                            });
                        }
                      }

                      //this.checkStatusNotifications(notification.goodId);
                    } else if (
                      notification.clarificationType ==
                      'SOLICITAR_IMPROCEDENCIA'
                    ) {
                      console.log('SOLICITAR_IMPROCEDENCIA', notification);
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
        this.onLoadToast('warning', 'No se tienen bienen para actualizar', '');
      }
    } else if (this.requestData.typeOfTransfer == 'PGR_SAE') {
      this.validateStatusAclaration();
    }
  }

  checkStatusNotifications(idGood: number, typeOrigin: string) {
    this.paramsCheckSat.getValue()['filter.goodId'] = idGood;
    this.rejectedGoodService
      .getAllFilter(this.paramsCheckSat.getValue())
      .subscribe({
        next: data => {
          console.log('Data ya actualizada ', data);
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
            console.log('faltran', this.clar);
            console.log('improcedente', this.imp);
          });
        },
        error: error => {
          console.log(error);
        },
      });

    /*if (
      notification.chatClarification.clarificationStatus == 'EN_ACLARACION' ||
      notification.chatClarification.clarificationStatus == 'NUEVA'
    ) {
      this.clar = true;
    } */
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
    /*this.columns.map(item => {
      this.paramsReload.getValue()['filter.goodId'] = item.goodid;
      this.rejectedGoodService
        .getAllFilter(this.paramsReload.getValue())
        .subscribe({
          next: data => {
            data.data.map(notify => {
              console.log('notify', notify);
            });
          },
          error: error => {},
        });
    }); */
  }

  endClarification() {
    this.validateStatusAclaration();
    this.data.getElements().then(data => {
      if (data.length > 0) {
        data.map((item: IGoodresdev) => {
          if (item.clarificationstatus == 'REGISTRO_SOLICITUD') {
            if (item.typeorigin == 'DOC_COMPLEMENTARIA') {
              this.alertQuestion(
                'question',
                'Finalizar',
                'Desea finalizar el proceso de aclaraciones'
              ).then(question => {
                if (question.isConfirmed) {
                  const result: string = '';
                  const status: number = 0;
                  this.endProcess();
                  //this.validateGoodStatus();
                }
                //this.redirectGoodTracker(question);
              });
            } else if (item.typeorigin == 'SOL_TRANSFERENCIA') {
              this.alertQuestion(
                'question',
                'Finalizar',
                'Desea finalizar el proceso de aclaraciones'
              ).then(question => {
                if (question.isConfirmed) {
                  const result: string = '';
                  const status: number = 0;
                  this.endProcess();
                  //this.validateGoodStatus();
                }
                //this.redirectGoodTracker(question);
              });
            }
          } else {
            this.onLoadToast(
              'warning',
              'Es necesario que tenga aclaradas todas las solicitudes de aclaración',
              ''
            );
          }
        });
      } else {
        this.onLoadToast('warning', 'No se tienen bienes con aclaraciones', '');
      }
    });
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
          //No se tiene codigo//
        }
      });
    });
  }

  validateStatusAclaration() {
    this.data.getElements().then(data => {
      data.map((item: IGoodresdev) => {
        this.paramsReject.getValue()['filter.goodId'] = item.goodid;
        this.rejectedGoodService
          .getAllFilter(this.paramsReject.getValue())
          .subscribe({
            next: response => {
              response.data.map(async notify => {
                if (notify.clarificationType == 'SOLICITAR_ACLARACION') {
                  //if (notify.answered != 'ACLARADA') {
                  this.updateStatusGood(
                    'ACLARADO',
                    '',
                    notify.goodId,
                    notify.goodResDevId,
                    item.typeorigin
                  );
                  //}
                }
                if (notify.clarificationType == 'SOLICITAR_IMPROCEDENCIA') {
                  //if (notify.answered != 'ACLARADA') {
                  this.updateStatusGood(
                    'ACLARADO',
                    '',
                    notify.goodId,
                    notify.goodResDevId,
                    item.typeorigin
                  );
                  //}
                  if (notify.answered == 'IMPROCEDENTE') {
                    this.updateStatusGood(
                      'IMPROCEDENTE',
                      'IMPROCEDENTE',
                      notify.goodId,
                      notify.goodResDevId,
                      item.typeorigin
                    );
                  }
                }
              });
            },
            error: error => {},
          });
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
          next: data => {},
          error: error => {
            console.log(error);
          },
        });
      }

      if (statusGood == null) {
        const good: IGood = {
          id: idGood,
          goodId: idGood,
          processStatus: statusProcess,
        };
        /*this.goodService.update(good).subscribe({
          next: data => {
            console.log('Bien actualizado', data);
          },
          error: error => {
            console.log(error);
          },
        }); */
      }

      /*if (statusProcess) {
        const good: IGood = {
          id: idGood,
          goodId: idGood,
          goodStatus: statusGood,
          processStatus: statusProcess,
        };
        this.goodService.update(good).subscribe({
          next: data => {
            console.log('Bien actualizado', data);
          },
          error: error => {
            console.log(error);
          },
        });
      } 

      if (statusProcess == null) {
        const good: IGood = {
          id: idGood,
          goodId: idGood,
          goodStatus: statusGood,
        };
        console.log(good);
        this.goodService.update(good).subscribe({
          next: data => {
            console.log('Bien actualizado', data);
          },
          error: error => {
            console.log(error);
          },
        });
      } */

      /**/
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
      } else {
        const goodReject: ClarificationGoodRejectNotification = {
          statusProcess: statusProcess,
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
      } else {
        const goodReject: ClarificationGoodRejectNotification = {
          statusGood: statusGood,
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
      if (this.selectedRow.answered == 'RECHAZADA') {
        this.message('Error', 'La notificación ya fue rechazada');
      } else {
        if (this.selectedRow.chatClarification == null) {
          this.message('Aviso', 'Aún no hay una respuesta del SAT');
        } else {
          this.updateChatClarificationsTmp();
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
          this.updateStatusClarificationsTmp(data.goodId);
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
      clarificationType: 'ACLARACIÓN',
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
    this.paramsCheckAclaration.getValue()['filter.goodId'] = `$eq:${idGood}`;

    this.rejectedGoodService
      .getAllFilter(this.paramsCheckAclaration.getValue())
      .subscribe({
        next: data => {
          this.notificationsList.load(data.data);
          const filterAclaration = data.data.filter((item: any) => {
            if (item.answered == 'ACLARADA' || item.answered == 'RECHAZADA') {
              return item;
            }
          });

          if (filterAclaration.length == this.notificationsList.count()) {
            const valuesClarifications = { ...this.valuesNotifications };
            const good: IGood = {
              id: valuesClarifications.goodId,
              goodId: valuesClarifications.goodId,
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
        },
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
        //this.close();
      }
    });
  }
}
