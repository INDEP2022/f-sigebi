import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { GelectronicFirmService } from 'src/app/core/services/ms-gelectronicfirm/gelectronicfirm.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UploadFielsModalComponent } from '../upload-fiels-modal/upload-fiels-modal.component';
import { LIST_REPORTS_COLUMN } from './list-reports-column';
@Component({
  selector: 'app-print-report-modal',
  templateUrl: './print-report-modal.component.html',
  styles: [],
})
export class PrintReportModalComponent extends BasePage implements OnInit {
  idDoc: any;
  idTypeDoc: any;
  idReportAclara: any; //ID del reporte de Oficio_Aclaracion
  sign: boolean = true;
  date: string = '';
  signatories: ISignatories[] = [];
  valuesSign: ISignatories;
  requestInfo: IRequest;
  dataClarifications: IChatClarifications;

  src = '';
  isPdfLoaded = false;
  private pdf: PDFDocumentProxy;

  @ViewChild('FileInput', { static: false }) inputFile: ElementRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  title: string = 'Imprimir Reporte';
  btnTitle: string = 'Firma Reporte';
  btnSubTitle: string = 'Vista Previa Reporte';
  printReport: boolean = true;
  listSigns: boolean = false;
  isAttachDoc: boolean = false;
  columns = LIST_REPORTS_COLUMN;
  config = {
    keyboard: true,
  };
  typeReport: string = '';
  sizeMessage: boolean = false;
  pdfTemp: File;

  rowSelected: boolean = false;
  selectedRow: any = null;

  msjCheck: boolean = false;
  formLoading: boolean = true;

  constructor(
    public modalService: BsModalService,
    public modalRef: BsModalRef,
    private signatoriesService: SignatoriesService,
    private gelectronicFirmService: GelectronicFirmService,
    private authService: AuthService,
    private wContentService: WContentService,
    private requestService: RequestService,
    private sanitizer: DomSanitizer,
    private chatClarificationsService: ChatClarificationsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Cargar Archivos',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent: '<i class="fa fa-upload text-primary"></i>',
      },
      columns: { ...LIST_REPORTS_COLUMN },
    };
  }

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  userName: any[] = [];

  ngOnInit(): void {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Verifica si ya existe ese usuario en la lista de firmantes
    this.signatoriesService
      .getSignatoriesName(this.idTypeDoc, this.idDoc, token.name)
      .subscribe({
        next: response => {
          this.signatories = response.data;
          console.log(
            'Ya hay firmantes con el mismo nombre del logeado, no se pueden crear más'
          );
          //Ya hay firmantes con el mismo nombre del logeado, no se pueden crear más
        },
        error: error => {
          //Si no hay firmantes, entonces asignar nuevos
          console.log('Si no hay firmantes, entonces asignar nuevos');
          this.registerSign();
        },
      });

    this.signParams();

    if (this.idReportAclara != null) {
      let linkDoc2: string = `http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Oficio_Aclaracion.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
      this.src = linkDoc2;
      console.log('ID del reporte Oficio_Aclaracion', this.idReportAclara);
      console.log('url del reporte', linkDoc2);
      return;
    } else {
      let linkDoc1: string = `http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Dictamen_Procedencia.jasper&ID_SOLICITUD=${this.idDoc}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
      this.src = linkDoc1;
    }
  }

  registerSign() {
    let token = this.authService.decodeToken();
    const formData: Object = {
      name: token.name,
      post: token.cargonivel1,
      learnedType: this.idTypeDoc,
      learnedId: this.idDoc,
    };

    //Asigna un firmante según el usuario logeado
    this.signatoriesService.create(formData).subscribe({
      next: response => {
        this.signParams(), console.log('Firmante creado: ', response);
      },
      error: error => console.log('No se puede crear: ', error),
    });
  }

  signParams() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());
  }

  //Trae listado de los firmantes disponibles para el reporte
  getSignatories() {
    const learnedType = this.idTypeDoc;
    const learnedId = this.idDoc;
    this.loading = true;
    console.log('Traer firmantes');
    this.signatoriesService
      .getSignatoriesFilter(learnedType, learnedId)
      .subscribe({
        next: response => {
          this.signatories = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  close(): void {
    this.modalRef.hide();
  }

  signReport() {
    //mostrar listado de reportes

    if (!this.listSigns && this.printReport && !this.isAttachDoc) {
      this.printReport = false;
      this.listSigns = true;
      this.title = 'Firma electrónica';
    } else if (!this.listSigns && this.printReport && this.isAttachDoc) {
      //adjuntar el reporte
      let message = '¿Está seguro que quiere cargar el documento?';
      this.openMessage2(message);
    }
  }

  print() {
    this.pdf.getData().then(u8 => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      let config = {
        initialState: {
          documento: {
            urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
            type: 'pdf',
          },
          callback: (response: any) => {},
        }, //pasar datos por aca
        class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
        ignoreBackdropClick: true, //ignora el click fuera del modal
      };
      this.modalService.show(PreviewDocumentsComponent, config);
    });
  }

  uploadData(signatories: ISignatories): void {
    let config: ModalOptions = {
      initialState: {
        signatories,
        typeReport: this.typeReport,
        callback: (next: boolean) => {
          if (next) {
            this.getSignatories();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadFielsModalComponent, config);
  }

  rowsSelected(event: any) {
    this.valuesSign = event.data;
    const idDoc = this.idDoc;
    const obj: Object = {
      id: this.requestInfo.id,
      recordId: this.requestInfo.recordId,
      applicationDate: this.requestInfo.applicationDate,
      receptionDate: this.requestInfo.receptionDate,
      nameOfOwner: this.requestInfo.nameOfOwner,
      holderCharge: this.requestInfo.holderCharge,
      phoneOfOwner: this.requestInfo.phoneOfOwner,
      emailOfOwner: this.requestInfo.emailOfOwner,
      transferenceId: this.requestInfo.transferenceId,
      transferent: this.requestInfo.transferent,
      stationId: this.requestInfo.stationId,
      emisora: this.requestInfo.emisora,
      authorityId: this.requestInfo.authorityId,
      regionalDelegationId: this.requestInfo.regionalDelegationId,
      regionalDelegation: this.requestInfo.regionalDelegation,
      sender: this.requestInfo.sender,
      observations: this.requestInfo.observations,
      targetUser: this.requestInfo.targetUser,
      urgentPriority: this.requestInfo.urgentPriority,
      indicatedTaxpayer: this.requestInfo.indicatedTaxpayer,
      transferenceFile: this.requestInfo.transferenceFile,
      transferEntNotes: this.requestInfo.transferEntNotes,
      idAddress: this.requestInfo.idAddress,
      originInfo: this.requestInfo.originInfo,
      circumstantialRecord: this.requestInfo.circumstantialRecord,
      previousInquiry: this.requestInfo.previousInquiry,
      lawsuit: this.requestInfo.lawsuit,
      protectNumber: this.requestInfo.protectNumber,
      tocaPenal: this.requestInfo.tocaPenal,
      paperNumber: this.requestInfo.paperNumber,
      paperDate: this.requestInfo.paperDate,
      indicated: this.requestInfo.indicated,
      publicMinistry: this.requestInfo.publicMinistry,
      court: this.requestInfo.court,
      crime: this.requestInfo.crime,
      receiptRoute: this.requestInfo.receiptRoute,
      destinationManagement: this.requestInfo.destinationManagement,
      affair: this.requestInfo.affair,
      satDeterminant: this.requestInfo.satDeterminant,
      satDirectory: this.requestInfo.satDirectory,
      authority: this.requestInfo.authority,
      satZoneCoordinator: this.requestInfo.satZoneCoordinator,
      userCreated: this.requestInfo.userCreated,
      creationDate: this.requestInfo.creationDate,
      userModification: this.requestInfo.userModification,
      modificationDate: this.requestInfo.modificationDate,
      typeOfTransfer: this.requestInfo.typeOfTransfer,
      domainExtinction: this.requestInfo.domainExtinction,
      version: this.requestInfo.version,
      targetUserType: this.requestInfo.targetUserType,
      trialType: this.requestInfo.trialType,
      typeRecord: this.requestInfo.typeRecord,
      requestStatus: this.requestInfo.requestStatus,
      fileLeagueType: this.requestInfo.fileLeagueType,
      fileLeagueDate: this.requestInfo.fileLeagueDate,
      rejectionComment: this.requestInfo.rejectionComment,
      authorityOrdering: this.requestInfo.authorityOrdering,
      instanceBpm: this.requestInfo.instanceBpm,
      trial: this.requestInfo.trial,
      compensationType: this.requestInfo.compensationType,
      stateRequestId: this.requestInfo.stateRequestId,
      searchSiab: this.requestInfo.searchSiab,
      priorityDate: this.requestInfo.priorityDate,
      ofRejectionsNumber: this.requestInfo.ofRejectionsNumber,
      rulingDocumentId: this.requestInfo.rulingDocumentId,
      reportSheet: this.requestInfo.reportSheet,
      nameRecipientRuling: this.requestInfo.nameRecipientRuling,
      postRecipientRuling: this.requestInfo.postRecipientRuling,
      paragraphOneRuling: this.requestInfo.paragraphOneRuling,
      paragraphTwoRuling: this.requestInfo.paragraphTwoRuling,
      nameSignatoryRuling: this.valuesSign.name, //Info nueva que se inserta
      postSignatoryRuling: this.valuesSign.post,
      ccpRuling: this.requestInfo.ccpRuling,
      rulingCreatorName: this.requestInfo.rulingCreatorName,
      rulingSheetNumber: this.requestInfo.rulingSheetNumber,
      registrationCoordinatorSae: this.requestInfo.registrationCoordinatorSae,
      emailNotification: this.requestInfo.emailNotification,
      keyStateOfRepublic: this.requestInfo.keyStateOfRepublic,
      instanceBpel: this.requestInfo.instanceBpel,
      verificationDateCump: this.requestInfo.verificationDateCump,
      recordTmpId: this.requestInfo.recordTmpId,
      coordregsae_ktl: this.requestInfo.coordregsae_ktl,
    };
    //Enviar nueva información a Request
    this.requestService.update(idDoc, obj).subscribe({
      next: data => {},
      error: error => (this.loading = false),
    });
  }

  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  sendSign() {
    //verificar que el estado de registro este como "datos completo" y enviarlo!
    let message = '¿Está seguro a enviar la información a firmar?';
    this.openMessage(message);
  }

  backStep() {
    this.listSigns = false;
    this.isAttachDoc = false;
    this.printReport = true;
    this.paragraphs = [];
  }

  nextStep() {
    if (this.msjCheck == true) {
      this.listSigns = false;
      this.printReport = true;
      this.isAttachDoc = true;
      this.title = 'Imprimir Reporte';
      this.btnTitle = 'Adjuntar Documento';
      this.btnSubTitle = 'Imprimir Reporte';
    }

    //Agregar información del firmante al reporte
    /*this.requestService.update(idDoc, this.dictumForm.value).subscribe({
      next: data => (this.handleSuccess(), this.signDictum()),
      error: error => (this.loading = false),
    });*/
  }

  pdfTempo: string = 'PDF';
  myItem: any;

  downloadTemp() {
    this.pdf.getData().then(u8 => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });
    });
  }

  reader = new FileReader();

  attachDoc() {
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `DOC_${this.date}${extension}`;
    const contentType: string = '.pdf';
    const file: any = '';

    const formData = {
      dDocTitle: nombreDoc, //Título del documento
      dDocAuthor: token.name, //Autor del documento
      dDocType: contentType, //Tipo de documento
      dDocCreator: token.name, //Creador del documento
      //dDocName: 'Dictamen Procendecia',	//Identificador del documento
      dInDate: new Date(), //Fecha de creación del documento
      xidSolicitud: this.idDoc,
      xtipoDocumento: this.idTypeDoc,
    };

    this.pdf.getData().then(u8 => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });
      this.wContentService
        .addDocumentToContent(
          nombreDoc,
          contentType,
          JSON.stringify(formData),
          blob,
          extension
        )
        .subscribe({
          next: resp => {
            this.onLoadToast(
              'success',
              'Documento Guardado',
              'El documento guardó correctamente'
            );

            this.close();
          },
          error: error => {
            console.log('Error', error);
          },
        });
    });
  }

  openMessage(message: string): void {
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          this.firm();
          console.log('enviar a firmar');
        }
      }
    );
  }

  firm() {
    const id = this.idDoc; //ID solicitud

    //Firmar reporte Dictamen Procedencia
    if (this.idTypeDoc == 50) {
      const nameTypeReport = 'DictamenProcendecia';
      const formData: Object = {
        id: this.idDoc,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);

      this.gelectronicFirmService
        .firmDocument(id, nameTypeReport, formData)
        .subscribe({
          next: data => (console.log('correcto', data), this.handleSuccess()),
          error: error => {
            if (error.status == 200) {
              this.msjCheck = true;
              console.log('correcto');
              this.alert('success', 'Firmado correctamente', '');
            } else {
              this.alert(
                'info',
                'Error al generar firma electrónic',
                error.error + '. Verificar datos del firmante'
              );
              this.updateStatusSigned();
            }
          },
        });
    }
    //Firmar reporte Oficio improcedencia / Oficio_Aclaracion
    if (this.idTypeDoc == 111) {
      const nameTypeReport = 'OficioImprocedencia';
      const formData: Object = {
        id: this.idDoc,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);

      this.gelectronicFirmService
        .firmDocument(id, nameTypeReport, formData)
        .subscribe({
          next: data => (console.log('correcto', data), this.handleSuccess()),
          error: error => {
            if (error.status == 200) {
              this.msjCheck = true;
              console.log('correcto');
              this.alert('success', 'Firmado correctamente', '');
              this.updateStatusclarifications();
            } else {
              this.alert(
                'info',
                'Error al generar firma electrónic',
                error.error + '. Verificar datos del firmante'
              );
              this.updateStatusSigned();
            }
          },
        });
    }
  }

  updateStatusclarifications() {
    console.log('Información de la notificacion: ', this.dataClarifications);
    const formData: Object = {
      id: this.dataClarifications.id,
      clarificationStatus: 'A_ACLARACION',
    };

    this.chatClarificationsService
      .update(this.dataClarifications.id, formData)
      .subscribe({
        next: data => {
          //this.onLoadToast('success', 'Aclaración guardada correctamente', '');
          console.log('Data guardada', data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo guardar', '');
        },
      });
  }

  updateStatusSigned() {
    const formData = new FormData();
    formData.append('learnedType', this.valuesSign.learnedType);
    formData.append('signatoryId', String(this.valuesSign.signatoryId));
    formData.append('learnedId', this.valuesSign.learnedId);
    formData.append('name', this.valuesSign.name);
    formData.append('pass', this.valuesSign.pass);
    formData.append('post', this.valuesSign.post);
    formData.append('rfcUser', this.valuesSign.rfcUser);
    formData.append('validationocsp', 'false');
    formData.append('identifierSystem', '1');
    formData.append('identifierSignatory', '1');
    this.signatoriesService
      .update(this.valuesSign.signatoryId, formData)
      .subscribe({
        next: data => {
          console.log('data', data), this.getSignatories();
        },
        error: error => {
          this.alert('info', 'No se pudo actualizar', error.data);
        },
      });
  }

  openMessage2(message: string): void {
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          this.attachDoc();
          //this. attachDoc();
          console.log('Adjuntar documento:');
        }
      }
    );
  }

  handleSuccess() {
    const message: string = 'Firmado';
    this.onLoadToast('success', 'Reporte formado', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
  }
}
