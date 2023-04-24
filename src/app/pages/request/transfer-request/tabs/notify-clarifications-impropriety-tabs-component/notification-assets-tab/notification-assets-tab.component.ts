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
  paramsSave = new BehaviorSubject<ListParams>(new ListParams());
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

  //verificar por el estado del campo transferente si es SAT O otro
  byInterconnection: boolean = false;

  rowSelected: boolean = false;
  selectedRow: any = null;
  goodsReject: IGoodresdev[] = [];
  valueClarification: IClarification;
  valueGood: number;
  valueRejectNotificationId: number;
  dataNotificationSelected: IClarificationGoodsReject;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private rejectedGoodService: RejectedGoodService,
    private chatClarificationsService: ChatClarificationsService,
    private goodService: GoodService,
    private getGoodResVeService: GetGoodResVeService,
    private requestService: RequestService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
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
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByRequest());
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
        console.log('data res', response);
        this.notificationsList.load(response.data);
        this.totalItems2 = response.count;
        this.formLoading = false;
      },
      error: error => (this.formLoading = false),
    });
  }

  notifyAssetRowSelected(event: any) {
    this.valuesNotifications = event.data;
    console.log(
      'Información de la notificación seleccionada',
      this.valuesNotifications
    );
    const refuseObj = { ...this.valuesNotifications };
    //let idRefuse = refuseObj.rejectNotificationId;
    //console.log("ID del rechazo", idRefuse)
    //verificar cuantas aclaraciones se pueden seleccionar para aceptarlas
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
      let aclarados: boolean = true;
      this.goodsReject.map(item => {
        console.log(item);
        if (item.clarificationstatus != 'ACLARADO') {
          if (item.clarificationstatus != 'CANCELADO') {
            aclarados = false;
          }
        }

        if (aclarados) {
          console.log('FALTAN');
        }
        /*if (
          items.clarificationstatus == 'ACLARADO' ||
          items.clarificationstatus == 'CANCELADO'
        ) {
          this.alertQuestion(
            'warning',
            'Confirmación',
            'Los bines seleccionados regresaran al proceso de Verificar Cumplimiento'
          ).then(question => {
            if (question.isConfirmed) {
              this.validateGoodStatus();
            }
            //this.redirectGoodTracker(question);
          });
        } else {
          this.onLoadToast(
            'info',
            'De los bienes seleccionados, existen bienes sin aclarar para enviar a Verificar Cumplimiento',
            ''
          );
        }  */
      });
    }
  }

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
      console.log('id tipo aclaración seleccionado');

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
    const dataClarifications = { ...this.valuesNotifications };
    const idAclara = this.selectedRow.clarification.type; //Id del tipo de aclaración
    let config: ModalOptions = {
      initialState: {
        dataClarifications2,
        rejectedID,
        goodValue,
        dataNotification,
        idClarification,
        dataClarifications,
        idAclara,
        clarification: this.notifyAssetsSelected,
        isInterconnection: this.byInterconnection,
        idRequest: this.idRequest,
        callback: (next: boolean) => {
          if (next) {
            //this.selectedRow.answered = 'EN';
            this.notificationsList.getElements().then(data => {
              data.map((item: ClarificationGoodRejectNotification) => {
                if (
                  item.rejectNotificationId ==
                  this.selectedRow.rejectNotificationId
                ) {
                  item.answered = 'EN ACLARACION';
                  item.chatClarification.clarificationStatus = 'A_ACLARACION';
                }
              });
              this.notificationsList.refresh();
            });
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

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
  //Respuesta del SAT
  satAnswer() {
    if (this.rowSelected == false) {
      this.message('Error', 'Primero seleccione una notificación');
    } else {
      if (this.selectedRow.answered == 'RECHAZADA') {
        this.message('Error', 'La notificación ya fue rechazada');
      } else {
        const idNotify = { ...this.notificationsGoods };
        const idAclaracion = this.selectedRow.clarification.id; //ID de la aclaración para mandar al reporte del sat
        if (this.selectedRow.satClarify == null) {
          this.message('Aviso', 'Aún no hay una respuesta del SAT');
          return;
        }

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
    console.log('Objeto de la notificación rechazazada', dataClarifications);
    this.rejectedGoodService
      .update(this.selectedRow.rejectNotificationId, dataClarifications)
      .subscribe({
        next: response => {
          console.log('Se actualizó', response), this.updateStatusGoodRefuse();
        },
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
          console.log('Bien actualizado', data);
        },
        error: error => {
          console.log(error);
        },
      });
    }
  }

  reloadData() {
    console.log('Prueba');
    this.columns.map(item => {
      console.log('item', item);
      this.paramsReload.getValue()['filter.goodId'] = item.goodid;
      this.rejectedGoodService
        .getAllFilter(this.paramsReload.getValue())
        .subscribe({
          next: data => {
            if (item.clarificationstatus != 'ACLARADO') {
              data.data.map(notify => {
                //console.log('TODAS notify', notify);
                if (notify.clarificationType == 'SOLICITAR_ACLARACION') {
                  if (notify.answered == 'EN ACLARACION') {
                    //Falta validación estatus aclaración
                    //De donde saca el id de respuesta del sat
                    if (notify.clarification.type == 2) {
                      console.log('notify', notify);
                    }
                  }
                }
              });
            }
          },
          error: error => {},
        });
    });
    /*this.columns.map(item => {
      this.paramsReload.getValue()['filter.goodId'] = item.goodid;
      this.rejectedGoodService
        .getAllFilter(this.paramsReload.getValue())
        .subscribe({
          next: data => {
            if (item.clarificationstatus != 'ACLARADO') {
              data.data.map(notify => {
                if (notify.clarificationType == 'SOLICITAR_ACLARACION') {
                  if (notify.answered == 'EN ACLARACION') {
                    this.saveDocumentResponse(notify);
                    if (
                      notify?.chatClarification?.clarificationStatus ==
                      'A_ACLARACION'
                    ) {
                      if (notify.clarification.type == 1) {
                        if (notify.documentClarificationId == null) {
                          this.saveDocumentResponse(notify);
                        }
                      }
                    } else if (
                      notify.chatClarification.clarificationStatus ==
                      'RECHAZADO'
                    ) {
                      //SE ACTUALIZA ANSWERED A RECHAZADA
                    } 
                  }
                  if (notify.answered != 'RECHAZADA' && notify.clarificationId == 19)
                  {
                    this.updateStatusGood("CANCELADO", "", notify.goodId, notify.goodResDevId, item.typeorigin);
                  } else{
                    this.updateStatusGood(
                      'ACLARADO',
                      '',
                      notify.goodId,
                      notify.goodResDevId,
                      item.typeorigin
                    );
                  } 
                } else if (
                  notify.clarificationType == 'SOLICITAR_IMPROCEDENCIA'
                ) {
                  if (notify.answered == 'CONTESTADO') {
                    this.updateStatusGood(
                      'ACLARADO',
                      '',
                      notify.goodId,
                      notify.goodResDevId,
                      item.typeorigin
                    );
                  } else if (notify.answered == 'IMPROCEDENTE') {
                    this.updateStatusGood('IMPROCEDENTE', 'IMPROCEDENTE', notify.goodId, notify.goodResDevId, item.typeorigin);
                  } 
                }
              });
            }
          },
          error: error => {},
        });
    });*/
  }

  saveDocumentResponse(notify: ClarificationGoodRejectNotification) {
    console.log(notify);
    this.requestService.getById(this.idRequest).subscribe({
      next: data => {
        console.log(data);
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

        console.log('genera doc', docInfo);
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
        console.log('aclaraciones', item);
        this.paramsReject.getValue()['filter.goodId'] = item.goodid;
        this.rejectedGoodService
          .getAllFilter(this.paramsReject.getValue())
          .subscribe({
            next: response => {
              console.log('Notificaciones', response);
              response.data.map(async notify => {
                if (notify.clarificationType == 'SOLICITAR_ACLARACION') {
                  //if (notify.answered != 'CONTESTADO') {
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
                  //if (notify.answered != 'CONTESTADO') {
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
      console.log('bien', idGood);
      console.log('status good', statusGood);
      console.log('status process', statusProcess);
      console.log('idGoodResDev', idGoodResDev);
      console.log('fecha', new Date());

      if (statusGood) {
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
      } else {
        const good: IGood = {
          id: idGood,
          goodId: idGood,
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

      if (statusProcess) {
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
      } else {
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
      }

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
}
