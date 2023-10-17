import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { IDictamenSeq } from 'src/app/core/models/ms-goods-query/opinionDelRegSeq-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-inappropriateness-form',
  templateUrl: './inappropriateness-form.component.html',
  styles: [],
})
export class InappropriatenessFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  notification: ClarificationGoodRejectNotification;
  request: IRequest;
  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;
  folioReporte: string;
  //
  paramsReload = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  dataChatClarifications: IChatClarifications[];
  idSolicitud: any;
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
    private regionalDelegationService: RegionalDelegationService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.getInfoDoc();
    this.dictamenSeq();
    this.prepareForm();

    /*this.regionalDelegationService.getById(this.delegationUser).subscribe({
      next: resp => {
        console.log('Respuesta de la delegación', resp.regionalDelegate, 'Cargo', resp.officeAddress);
      },
      error: error => {
        console.log('Respuesta de la delegación', error.regionalDelegate);
      },
    })*/
  }

  getInfoDoc() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.applicationId'] = this.idSolicitud;
      this.documentService
        .getAllClarificationDocImpro(params.getValue())
        .subscribe({
          next: response => {
            resolve(response.data[0].id);

            const clarificationImpro: IClarificationDocumentsImpro =
              response.data[0];
            if (clarificationImpro?.managedTo) {
              this.form
                .get('addresseeName')
                .setValue(clarificationImpro?.managedTo);
            }

            if (clarificationImpro?.positionAddressee) {
              this.form
                .get('positionAddressee')
                .setValue(clarificationImpro?.positionAddressee);
            }

            if (clarificationImpro?.sender) {
              this.form.get('senderName').setValue(clarificationImpro?.sender);
            }

            if (clarificationImpro?.positionSender) {
              this.form
                .get('senderCharge')
                .setValue(clarificationImpro?.positionSender);
            }

            if (clarificationImpro?.consistentIn) {
              this.form
                .get('consistentIn')
                .setValue(clarificationImpro?.consistentIn);
            }

            if (clarificationImpro?.clarification) {
              this.form
                .get('clarification')
                .setValue(clarificationImpro?.clarification);
            }

            if (clarificationImpro?.paragraphInitial) {
              this.form
                .get('paragraphInitial')
                .setValue(clarificationImpro?.paragraphInitial);
            }

            if (clarificationImpro?.paragraphFinal) {
              this.form
                .get('paragraphFinal')
                .setValue(clarificationImpro?.paragraphFinal);
            }
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      addresseeName: [null],
      positionAddressee: [null],
      senderName: [this.request?.nameOfOwner || null],
      senderCharge: [this.request?.holderCharge || null],
      clarification: [null, [Validators.pattern(STRING_PATTERN)]],
      paragraphInitial: [null, [Validators.pattern(STRING_PATTERN)]],
      paragraphFinal: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      //transmitterId: [null, [Validators.maxLength(15)]],
      //foundation: [null, [Validators.maxLength(4000)]],
      //invoiceLearned: [null, [Validators.maxLength(60)]],
      /*worthAppraisal: [
        null,
        [Validators.maxLength(60), Validators.pattern(NUMBERS_PATTERN)],
      ], */
      consistentIn: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  async confirm() {
    let token = this.authService.decodeToken();
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.form.controls['clarification'].value,
      sender: this.form.controls['senderName'].value,
      version: 1,
      paragraphInitial: this.form.controls['paragraphInitial'].value,
      applicationId: this.request.id,
      positionSender: this.form.controls['senderCharge'].value,
      paragraphFinal: this.form.controls['paragraphFinal'].value,
      consistentIn: this.form.controls['consistentIn'].value,
      managedTo: this.form.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      positionAddressee: this.form.controls['positionAddressee'].value,
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '216',
      modificationUser: token.name,
      creationDate: new Date(),
      assignmentInvoiceDate: new Date(),
      rejectNoticeId: this.notification.rejectNotificationId,
    };
    const checkExistDocImp: any = await this.checkDataExist();
    if (checkExistDocImp?.id != 0) {
      this.documentService
        .updateClarDocImp(Number(checkExistDocImp.id), modelReport)
        .subscribe({
          next: data => {
            this.openReport(checkExistDocImp);
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
          setTimeout(() => {
            if (createClarGoodDoc) {
              this.openReport(data);
              this.loading = false;
              this.close();
            }
          }, 250);
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }

  checkDataExist() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.applicationId'] = this.idSolicitud;
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
    const notificationValidate = 'Y';
    const idReportAclara = data.id;
    //const idDoc = data.id;
    const idTypeDoc = 216;
    const requestInfo = this.request;
    const idSolicitud = this.idSolicitud;

    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        requestInfo,
        idTypeDoc,
        //idDoc,
        idReportAclara,
        idSolicitud,
        notificationValidate,
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

  close() {
    this.modalRef.hide();
  }
}
