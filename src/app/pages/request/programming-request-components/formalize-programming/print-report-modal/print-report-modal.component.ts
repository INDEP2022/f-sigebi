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
import { environment } from 'src/environments/environment';
import { UploadFielsModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/upload-fiels-modal/upload-fiels-modal.component';
import { LIST_REPORTS_COLUMN } from './list-reports-column';
// import { UploadFielsModalComponent } from '../upload-fiels-modal/upload-fiels-modal.component';

@Component({
  selector: 'app-print-report-modal',
  templateUrl: './print-report-modal.component.html',
  styles: [],
})
export class PrintReportModalComponent extends BasePage implements OnInit {
  id_acta: any;
  id_programacion: any;
  sign: boolean = true;
  date: string = '';
  signatories: ISignatories[] = [];
  valuesSign: ISignatories;
  requestInfo: IRequest;
  dataClarifications2: IChatClarifications;

  src = '';
  isPdfLoaded = false;
  private pdf: PDFDocumentProxy;

  @ViewChild('FileInput', { static: false }) inputFile: ElementRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  title: string = 'Imprimir Reporte';
  btnTitle: string = 'Firmar Reporte';
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
  urlBaseReport = `${environment.API_URL}processgoodreport/report/showReport?nombreReporte=`;
  idSolicitud: any;
  idRegionalDelegation: any;
  notificationValidate: any;

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

  ngOnInit(): void {
    switch (this.id_acta) {
      case 106: {
        let linkDoc: string = `${this.urlBaseReport}ActaAseguradosBook.jasper&ID_ACTA=${this.id_acta}&ID_PROGRAMACION=${this.id_programacion}`;
        this.src = linkDoc;
        break;
      }
      case 107: {
        let linkDoc: string = `${this.urlBaseReport}Acta_VoluntariasBook.jasper&ID_ACTA=${this.id_acta}&ID_PROGRAMACION=${this.id_programacion}`;
        this.src = linkDoc;
        break;
      }
      case 210: {
        let linkDoc: string = `${this.urlBaseReport}Acta_SATBook.jasper&ID_ACTA=${this.id_acta}&ID_PROGRAMACION=${this.id_programacion}`;
        this.src = linkDoc;
        break;
      }
      default: {
        console.log('No hay ID tipo de documento');
        break;
      }
    }
  }
  //Verifica si ya existen usuarios, para eliminarlo (Evitar duplicidad)
  verificateFirm() {
    this.signatoriesService
      .getSignatoriesName(this.id_acta, this.id_programacion)
      .subscribe({
        next: response => {
          console.log('Existe firmante, proceder a eliminarlo');
          this.signatories = response.data;
          //Ciclo para eliminar todos los posibles firmantes existentes para esa solicitud
          const count = response.count;
          for (let i = 0; i < count; i++) {
            this.signatoriesService
              .deleteFirmante(this.signatories[i].signatoryId)
              .subscribe({
                next: response => console.log('Firmante borrado'),
              });
          }
        },
        error: error => {
          //Si no hay firmantes, entonces asignar nuevos
          console.log('Si no hay firmantes, entonces crear nuevo');
          this.registerSign();
        },
      });
  }
  deleteSignatories() {
    this.signatoriesService.deleteFirmante(this.id_programacion).subscribe({
      next: response => console.log('Firmante borrado'),
    });
  }

  registerSign() {
    this.signatoriesService
      .getSignatoriesName(this.id_acta, this.id_programacion)
      .subscribe({
        next: response => {
          console.log('Existe firmante, ya no crear');
        },
        error: error => {
          console.log('Si no hay firmantes, entonces crear nuevo');
          let token = this.authService.decodeToken();
          const formData: Object = {
            name: token.name,
            post: token.cargonivel1,
            learnedType: this.id_acta,
            learnedId: this.id_programacion, // Para los demás reportes
          };

          //Asigna un firmante según el usuario logeado
          this.signatoriesService.create(formData).subscribe({
            next: response => {
              this.signParams(), console.log('Firmante creado: ', response);
            },
            error: error => console.log('No se puede crear: ', error),
          });
        },
      });
  }
  signParams() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());
  }
  //Trae listado de los firmantes disponibles para el reporte
  getSignatories() {
    const learnedType = this.id_acta;
    const learnedId = this.id_programacion;
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
      // if(this.notificationValidate == 'Y'){
      //   console.log('Soy una notificación, no es necesario validar firmante creado');
      // } else {
      //   console.log('Soy un dictamen, es necesario validar firmante para evitar duplicidad');
      //   this.verificateFirm();
      // }
      this.registerSign();
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
    const id_programacion = this.id_programacion;
    let config: ModalOptions = {
      initialState: {
        id_programacion,
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

  // rowsSelected(event: any) {
  //   this.valuesSign = event.data;
  //   const idDoc = this.idSolicitud;
  //   console.log('ID solicitud row seleccionado', idDoc);
  //   const obj: Object = {
  //     id: this.requestInfo.id,
  //     recordId: this.requestInfo.recordId,
  //     applicationDate: this.requestInfo.applicationDate,
  //     receptionDate: this.requestInfo.receptionDate,
  //     nameOfOwner: this.requestInfo.nameOfOwner,
  //     holderCharge: this.requestInfo.holderCharge,
  //     phoneOfOwner: this.requestInfo.phoneOfOwner,
  //     emailOfOwner: this.requestInfo.emailOfOwner,
  //     transferenceId: this.requestInfo.transferenceId,
  //     //transferent: this.requestInfo.transferent, ¿Cambio?
  //     stationId: this.requestInfo.stationId,
  //     //emisora: this.requestInfo.emisora, ¿Cambio?
  //     authorityId: this.requestInfo.authorityId,
  //     regionalDelegationId: this.requestInfo.regionalDelegationId,
  //     //regionalDelegation: this.requestInfo.regionalDelegation,
  //     sender: this.requestInfo.sender,
  //     observations: this.requestInfo.observations,
  //     targetUser: this.requestInfo.targetUser,
  //     urgentPriority: this.requestInfo.urgentPriority,
  //     indicatedTaxpayer: this.requestInfo.indicatedTaxpayer,
  //     transferenceFile: this.requestInfo.transferenceFile,
  //     transferEntNotes: this.requestInfo.transferEntNotes,
  //     idAddress: this.requestInfo.idAddress,
  //     originInfo: this.requestInfo.originInfo,
  //     circumstantialRecord: this.requestInfo.circumstantialRecord,
  //     previousInquiry: this.requestInfo.previousInquiry,
  //     lawsuit: this.requestInfo.lawsuit,
  //     protectNumber: this.requestInfo.protectNumber,
  //     tocaPenal: this.requestInfo.tocaPenal,
  //     paperNumber: this.requestInfo.paperNumber,
  //     paperDate: this.requestInfo.paperDate,
  //     indicated: this.requestInfo.indicated,
  //     publicMinistry: this.requestInfo.publicMinistry,
  //     court: this.requestInfo.court,
  //     crime: this.requestInfo.crime,
  //     receiptRoute: this.requestInfo.receiptRoute,
  //     destinationManagement: this.requestInfo.destinationManagement,
  //     affair: this.requestInfo.affair,
  //     satDeterminant: this.requestInfo.satDeterminant,
  //     satDirectory: this.requestInfo.satDirectory,
  //     //authority: this.requestInfo.authority,
  //     satZoneCoordinator: this.requestInfo.satZoneCoordinator,
  //     userCreated: this.requestInfo.userCreated,
  //     creationDate: this.requestInfo.creationDate,
  //     userModification: this.requestInfo.userModification,
  //     modificationDate: this.requestInfo.modificationDate,
  //     typeOfTransfer: this.requestInfo.typeOfTransfer,
  //     domainExtinction: this.requestInfo.domainExtinction,
  //     version: this.requestInfo.version,
  //     targetUserType: this.requestInfo.targetUserType,
  //     trialType: this.requestInfo.trialType,
  //     typeRecord: this.requestInfo.typeRecord,
  //     requestStatus: this.requestInfo.requestStatus,
  //     fileLeagueType: this.requestInfo.fileLeagueType,
  //     fileLeagueDate: this.requestInfo.fileLeagueDate,
  //     rejectionComment: this.requestInfo.rejectionComment,
  //     authorityOrdering: this.requestInfo.authorityOrdering,
  //     instanceBpm: this.requestInfo.instanceBpm,
  //     trial: this.requestInfo.trial,
  //     compensationType: this.requestInfo.compensationType,
  //     stateRequestId: this.requestInfo.stateRequestId,
  //     searchSiab: this.requestInfo.searchSiab,
  //     priorityDate: this.requestInfo.priorityDate,
  //     ofRejectionsNumber: this.requestInfo.ofRejectionsNumber,
  //     rulingDocumentId: this.requestInfo.rulingDocumentId,
  //     reportSheet: this.requestInfo.reportSheet,
  //     nameRecipientRuling: this.requestInfo.nameRecipientRuling,
  //     postRecipientRuling: this.requestInfo.postRecipientRuling,
  //     paragraphOneRuling: this.requestInfo.paragraphOneRuling,
  //     paragraphTwoRuling: this.requestInfo.paragraphTwoRuling,
  //     nameSignatoryRuling: this.valuesSign.name, //Info nueva que se inserta
  //     postSignatoryRuling: this.valuesSign.post,
  //     ccpRuling: this.requestInfo.ccpRuling,
  //     rulingCreatorName: this.requestInfo.rulingCreatorName,
  //     rulingSheetNumber: this.requestInfo.rulingSheetNumber,
  //     registrationCoordinatorSae: this.requestInfo.registrationCoordinatorSae,
  //     emailNotification: this.requestInfo.emailNotification,
  //     keyStateOfRepublic: this.requestInfo.keyStateOfRepublic,
  //     instanceBpel: this.requestInfo.instanceBpel,
  //     verificationDateCump: this.requestInfo.verificationDateCump,
  //     recordTmpId: this.requestInfo.recordTmpId,
  //     coordregsae_ktl: this.requestInfo.coordregsae_ktl,
  //   };
  //   console.log();
  //   //Enviar nueva información a Request
  //   this.requestService.update(idDoc, obj).subscribe({
  //     next: data => {},
  //     error: error => (this.loading = false),
  //   });
  // }

  rowsSelected(event: any) {
    this.valuesSign = event.data;
    const idDoc = this.idSolicitud;
    console.log('ID solicitud row seleccionado', idDoc);
    const obj: any = {
      actId: 1,
      creationDate: '2023-05-31',
      electronicSignatureOic: 1,
      electronicSignatureWitness1: 1,
      electronicSignatureWitness2: 1,
      electronicSignatureWorker1: 1,
      electronicSignatureWorker2: 0,
      emailOic: 'test1@gmail.com',
      emailUvfv: 'test1@gmail.com',
      emailWitness1: 'test1@gmail.com',
      emailWitness2: 'test1@gmail.com',
      emailWorker1: 'test1@gmail.com',
      emailWorker2: 'test1@gmail.com',
      idCatWitness1: '4',
      idCatWitness2: '4',
      idCatWorker1: '5',
      idCatWorker2: '7',
      idCatWorkerOic: '7',
      idExpWorker1: 'test1',
      idExpWorker2: 'test1',
      idExpWorkerOic: 'test12343',
      idNoWitness1: 'test12',
      idNoWitness2: 'test12',
      idNoWorker1: 'test1',
      idNoWorker2: 'test1',
      idNoWorkerOic: 'test12343',
      idPrograming: 82,
      nameWitness1: 'test12',
      nameWitness2: 'test12',
      nameWorker1: 'test1',
      nameWorker2: 'test1',
      nameWorker3: 'test12343',
      nameWorker4: 'test12343',
      nameWorkerOic: 'test12343',
      nameWorkerUvfv: 'test12343',
      nocargo_funcionario_uvfv: 'test12343',
      positionWorker1: 'test1',
      positionWorker2: 'test1',
      positionWorker4: 'test12343',
      positionWorkerOic: 'test12343',
      positionWorkerUvfv: null,
      residentialWorker1: 'test1',
    };
    console.log(obj);
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
    let message = '¿Está seguro de enviar la información a firmar?';
    this.openMessage(message);
  }

  backStep() {
    if (this.notificationValidate == 'Y') {
      console.log(
        'Soy una notificación, no es necesario validar firmante creado'
      );
    } else {
      console.log(
        'Soy un dictamen, es necesario validar firmante para evitar duplicidad'
      );
      this.verificateFirm();
    }
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

  validAttachDoc() {
    console.log('this.idSolicitud:', this.idSolicitud);
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `DOC_${this.date}${extension}`;
    const contentType: string = '.pdf';
    const file: any = '';
    if (this.idSolicitud === undefined) {
      console.log('soy reporte de dictaminación');
      const formData = {
        dDocTitle: nombreDoc, //Título del documento
        dDocAuthor: token.name, //Autor del documento
        dDocType: contentType, //Tipo de documento
        dDocCreator: token.name, //Creador del documento
        //dDocName: 'Dictamen Procendecia',	//Identificador del documento
        dInDate: new Date(), //Fecha de creación del documento
        xidSolicitud: this.requestInfo.id,
        xtipoDocumento: this.id_acta,
        xdelegacionRegional: this.idRegionalDelegation,
      };
      this.attachDoc(formData);
    } else {
      console.log('soy reporte de notificaciones');
      const formData = {
        dDocTitle: nombreDoc, //Título del documento
        dDocAuthor: token.name, //Autor del documento
        dDocType: contentType, //Tipo de documento
        dDocCreator: token.name, //Creador del documento
        //dDocName: 'Dictamen Procendecia',	//Identificador del documento
        dInDate: new Date(), //Fecha de creación del documento
        xidSolicitud: this.idSolicitud,
        xtipoDocumento: this.id_acta,
      };
      this.attachDoc(formData);
    }
  }

  attachDoc(formData: Object) {
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `DOC_${this.date}${extension}`;
    const contentType: string = '.pdf';
    const file: any = '';
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
            this.alert(
              'success',
              'Documento Guardado',
              'El documento se guardó correctamente'
            );
            this.modalRef.content.callback(true);
            this.close();
          },
          error: error => {
            console.log('Error', error);
          },
        });
    });
  }

  loadingButton: boolean = false;

  openMessage(message: string): void {
    this.alertQuestion('warning', 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          this.loadingButton = true;
          this.firm();
          console.log('enviar a firmar');
        }
      }
    );
  }

  firm() {
    //Firmar reporte Dictamen Procedencia
    if (this.id_acta == 106) {
      const requestInfo = this.requestInfo; //ID solicitud
      console.log('ID de solicitud', this.requestInfo);
      const nameTypeReport = 'ActaAseguradosBook';
      const formData: Object = {
        id: this.id_programacion,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);

      this.firmReport(requestInfo.id, nameTypeReport, formData);
    }
    //Firmar reporte Oficio improcedencia / Oficio_Aclaracion
    if (this.id_acta == 107) {
      const nameTypeReport = 'Acta_VoluntariasBook';
      const formData: Object = {
        id: this.id_programacion,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.id_programacion, nameTypeReport, formData);
    }
    if (this.id_acta == 210) {
      const nameTypeReport = 'Acta_SATBook';
      const formData: Object = {
        id: this.id_programacion,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.id_programacion, nameTypeReport, formData);
    }
  }

  //Método para plasmar firma en reporte generado
  firmReport(requestInfo?: number, nameTypeReport?: string, formData?: Object) {
    this.gelectronicFirmService
      .firmDocument(requestInfo, nameTypeReport, formData)
      .subscribe({
        next: data => (
          (this.loadingButton = false),
          console.log('correcto', data),
          this.handleSuccess()
        ),
        error: error => {
          if (error.status == 200) {
            this.loadingButton = false;
            this.msjCheck = true;
            console.log('correcto');
            this.alert('success', 'Firmado correctamente', '');
            this.updateStatusclarifications();
          } else {
            this.loadingButton = false;
            this.alert(
              'info',
              'Error al generar firma electrónic',
              error.error + 'Verificar datos del firmante'
            );
            this.updateStatusSigned();
          }
        },
      });
  }

  updateStatusclarifications() {
    console.log('Información de la notificacion: ', this.dataClarifications2);
    const formData: Object = {
      id: this.dataClarifications2.id,
      clarificationStatus: 'A_ACLARACION',
    };

    this.chatClarificationsService
      .update(this.dataClarifications2.id, formData)
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
    formData.append('validationocsp', 'true');
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
          this.validAttachDoc();
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
