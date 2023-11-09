import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { IDictamenSeq } from 'src/app/core/models/ms-goods-query/opinionDelRegSeq-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-inappropriateness-pgr-sat-form',
  templateUrl: './inappropriateness-pgr-sat-form.component.html',
  styles: [],
})
export class InappropriatenessPgrSatFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  notification: ClarificationGoodRejectNotification;
  request: IRequest;

  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;
  folioReporte: string;

  //Parámetro que identifica el tipoTransferente
  type: any;
  paramsReload = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  dataChatClarifications: IChatClarifications[];
  idSolicitud: any;
  formLoading: boolean = false;
  delegationUser: any;

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private rejectedGoodService: RejectedGoodService,
    private requestService: RequestService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    //this.dictamenSeq();
    this.getInfoDoc();
    this.prepareForm();
  }

  getInfoDoc() {
    let documentTypeId: number = 0;
    const idClarType = this.notification.chatClarification.idClarificationType;
    if (
      (this.request.typeOfTransfer == 'PGR_SAE' && idClarType == '2') ||
      (this.request.typeOfTransfer == 'SAT_SAE' && idClarType == '2')
    ) {
      documentTypeId = 111;
    }

    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.applicationId'] = this.idSolicitud;
    params.getValue()['filter.documentTypeId'] = documentTypeId;
    this.documentService
      .getAllClarificationDocImpro(params.getValue())
      .subscribe({
        next: response => {
          const clarificationImpro: IClarificationDocumentsImpro =
            response.data[0];

          if (clarificationImpro.clarification == 'SOLICITAR_IMPROCEDENCIA') {
            if (clarificationImpro?.managedTo) {
              this.form
                .get('managedTo')
                .setValue(clarificationImpro?.managedTo);
            }

            if (clarificationImpro?.positionAddressee) {
              this.form
                .get('positionAddressee')
                .setValue(clarificationImpro?.positionAddressee);
            }

            if (clarificationImpro?.paragraphInitial) {
              this.form
                .get('paragraphInitial')
                .setValue(clarificationImpro?.paragraphInitial);
            }

            if (clarificationImpro?.foundation) {
              this.form
                .get('foundation')
                .setValue(clarificationImpro?.foundation);
            }
          }
        },
        error: error => {},
      });
  }

  prepareForm() {
    this.form = this.fb.group({
      managedTo: [this.request?.nameOfOwner || null], //NOMBRE DESTINATARIO
      positionAddressee: [this.request?.holderCharge || null], // CARGO DESTINATARIO
      paragraphInitial: [null],
      foundation: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    let token = this.authService.decodeToken();

    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/?/${year}`;
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/?/${year}`;
    }

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.notification?.clarificationType,

      foundation: this.form.controls['foundation'].value,

      version: 1,
      paragraphInitial: this.form.controls['paragraphInitial'].value,
      applicationId: this.request.id,

      invoiceLearned: this.folioReporte,
      managedTo: this.request?.nameOfOwner
        ? this.request?.nameOfOwner
        : this.form.controls['managedTo'].value,
      positionAddressee: this.request?.holderCharge
        ? this.request?.holderCharge
        : this.form.controls['positionAddressee'].value,
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '111',
      modificationUser: token.name,
      creationDate: new Date(),
      assignmentInvoiceDate: new Date(),
      rejectNoticeId: this.notification?.rejectNotificationId,
      areaUserCapture: token.name,
    };

    this.loading = true;

    const checkExistDocImp: any = await this.checkDataExist(111);
    if (checkExistDocImp.id != 0) {
      this.documentService
        .updateClarDocImp(Number(checkExistDocImp.id), modelReport)
        .subscribe({
          next: async data => {
            this.openReport(checkExistDocImp);
            //await this.updateObservation(this.form.get('observations').value);
            this.loading = false;
            this.close();
          },
          error: error => {
            this.loading = false;
            this.onLoadToast('error', 'No se pudo guardar', '');
          },
        });
    }

    if (checkExistDocImp == 0) {
      this.loading = true;
      this.documentService.createClarDocImp(modelReport).subscribe({
        next: data => {
          const createClarGoodDoc = this.createClarGoodDoc(data);
          setTimeout(async () => {
            if (createClarGoodDoc) {
              const updateObservations = await this.updateObservation(
                this.form.get('observations').value
              );
              if (updateObservations) {
                const updateObservations = await this.updateObservation(
                  this.form.get('observations').value
                );

                if (updateObservations) {
                  this.openReport(data);
                  this.loading = false;
                  this.close();
                }
              }
            }
          }, 250);
        },
        error: error => {
          this.loading = false;
        },
      });
    }
    /*this.documentService.createClarDocImp(modelReport).subscribe({
      next: async response => {
        this.openReport(response);
        this.loading = false;
        this.close();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    }); */
  }

  createClarGoodDoc(docImpro: IClarificationDocumentsImpro) {
    return new Promise((resolve, reject) => {
      const formData = {
        documentId: docImpro.id,
        version: '1',
        clarificationRequestId: docImpro.rejectNoticeId,
      };
      this.documentService.createClarDocGood(formData).subscribe({
        next: () => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  checkDataExist(documentTypeId: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.applicationId'] = this.idSolicitud;
      params.getValue()['filter.documentTypeId'] = documentTypeId;
      this.documentService
        .getAllClarificationDocImpro(params.getValue())
        .subscribe({
          next: response => {
            resolve(response.data[0]);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  updateObservation(observation: string) {
    return new Promise((resolve, reject) => {
      const modalRequest: IRequest = {
        id: this.idSolicitud,
        observations: observation,
      };
      this.requestService.update(this.idSolicitud, modalRequest).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  changeStatusAnswered() {
    this.loading = true;
    this.paramsReload.getValue()['filter.clarifiNewsRejectId'] =
      this.notification.rejectNotificationId;

    this.chatService.getAll(this.paramsReload.getValue()).subscribe({
      next: data => {
        this.dataChatClarifications = data.data;
        this.updateChatClarification(this.dataChatClarifications[0]);
      },
      error: error => {},
    });
  }

  updateChatClarification(chatClarifications: IChatClarifications) {
    const modelChatClarifications: IChatClarifications = {
      id: chatClarifications.id, //ID primaria
      clarifiNewsRejectId: this.notification.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.request.id,
      goodId: this.notification.goodId,
      //clarificationStatus: 'EN_ACLARACION', //Valor a cambiar
    };

    this.chatService
      .update(chatClarifications.id, modelChatClarifications)
      .subscribe({
        next: async data => {
          this.updateAnsweredImpro(
            data.clarifiNewsRejectId,
            chatClarifications.id,
            modelChatClarifications.goodId
          );
        },
        error: error => {
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
        },
      });
  }

  updateAnsweredAcla(
    id?: number,
    chatClarId?: number | string,
    goodId?: number,
    observations?: string
  ) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION', // ??
      observations: observations,
    };
    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {
        const updateInfo: IChatClarifications = {
          requestId: this.request.id,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatService.update(chatClarId, updateInfo).subscribe({
          next: data => {
            this.loading = false;
            this.onLoadToast('success', 'Actualizado', '');
            this.modalRef.content.callback(true, data.goodId);
            this.modalRef.hide();
          },
          error: error => {
            this.loading = false;
          },
        });
      },
    });
  }

  updateAnsweredImpro(
    id?: number,
    chatClarId?: number,
    goodId?: number,
    observations?: string
  ) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION',
      observations: observations,
    };

    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {
        const updateInfo: IChatClarifications = {
          requestId: this.request.id,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatService.update(chatClarId, updateInfo).subscribe({
          next: data => {
            this.modalRef.content.callback(true, data.goodId);
            this.modalRef.hide();
          },
          error: error => {},
        });
      },
    });
  }

  //Método para generar reporte y posteriormente la firma
  openReport(data?: IClarificationDocumentsImpro) {
    this.dictamenSeq();

    setTimeout(() => {
      const notificationValidate = 'Y';
      const idReportAclara = data.id;
      //const idDoc = data.id;
      const idTypeDoc = Number(data.documentTypeId);
      const requestInfo = this.request;
      const idSolicitud = this.idSolicitud;
      const nomenglatura = this.folioReporte;
      const infoReport = data;
      //Modal que genera el reporte
      let config: ModalOptions = {
        initialState: {
          requestInfo,
          idTypeDoc,
          //idDoc,
          idReportAclara,
          idSolicitud,
          notificationValidate,
          nomenglatura,
          infoReport,
          callback: (next: boolean) => {
            if (next) {
              this.changeStatusAnswered();
            } else {
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(PrintReportModalComponent, config);
    }, 2000); // 2000 milisegundos = 2 segundos
  }

  //Método para crear número secuencial según la no delegación del user logeado
  dictamenSeq() {
    let token = this.authService.decodeToken();

    const pNumber = Number(token.department);

    this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
      next: response => {
        // this.noFolio = response.data;
        this.folio = response;
        this.generateClave(this.folio.dictamenDelregSeq);
      },
      error: error => {},
    });
  }

  //Método para construir folio con información del usuario
  generateClave(noDictamen?: string) {
    //Trae información del usuario logeado
    let token = this.authService.decodeToken();
    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;
    }
  }
}
