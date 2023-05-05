import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { IDictamenSeq } from 'src/app/core/models/ms-goods-query/opinionDelRegSeq-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
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
  //dataClarifications2: ClarificationGoodRejectNotification
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private documentService: DocumentsService,
    private requestService: RequestService,
    private chatClarificationsService: ChatClarificationsService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    console.log('tipoTransferente', this.type);
    this.generateClave();
    console.log('notification', this.notification);
    //console.log('dateclar', this.dataClarifications2);
    console.log('request', this.request);
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      senderName: [null, [Validators.required, Validators.maxLength(50)]],
      positionSender: [null, [Validators.required, Validators.maxLength(50)]],
      paragraphInitial: [null, [Validators.maxLength(4000)]],
      foundation: [null, [Validators.maxLength(4000)]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.notification.clarificationType,
      sender: this.form.controls['senderName'].value,
      foundation: this.form.controls['foundation'].value,
      id: null,
      version: 1,
      paragraphInitial: this.form.controls['paragraphInitial'].value,
      applicationId: this.request.id,
      positionSender: this.form.controls['positionSender'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '111',
      modificationUser: token.name,
      creationDate: new Date(),
      assignmentInvoiceDate: new Date(),
      rejectNoticeId: this.notification.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: response => {
        console.log('Información del documento creado: ', response);
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(response); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);
        this.loading = false;
        this.close();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  //Método para generar reporte y posteriormente la firma
  openReport(data?: IClarificationDocumentsImpro) {
    const idReportAclara = data.id;
    const idDoc = data.id;
    const idTypeDoc = 111;
    const requestInfo = data;

    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        requestInfo,
        idTypeDoc,
        idDoc,
        idReportAclara,
        callback: (next: boolean) => {},
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
        console.log('No. Folio generado ', this.folio.dictamenDelregSeq);
      },
      error: error => {
        console.log('Error al generar secuencia de dictamen', error.error);
      },
    });
  }

  //Método para construir folio con información del usuario
  generateClave(noDictamen?: string) {
    //Trae información del usuario logeado
    let token = this.authService.decodeToken();
    console.log(token);

    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;
      console.log('Folio Armado final', this.folioReporte);
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;
      console.log('Folio Armado final', this.folioReporte);
    }
  }
}
