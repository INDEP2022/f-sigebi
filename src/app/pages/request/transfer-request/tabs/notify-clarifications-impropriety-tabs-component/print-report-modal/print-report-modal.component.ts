import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { GelectronicFirmService } from 'src/app/core/services/ms-gelectronicfirm/gelectronicfirm.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
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
  nameTypeDoc: string = 'DictamenProcendecia';
  sign: boolean = true;
  date: string = '';
  signatories: ISignatories[] = [];

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

  constructor(
    public modalService: BsModalService,
    public modalRef: BsModalRef,
    private signatoriesService: SignatoriesService,
    private gelectronicFirmService: GelectronicFirmService,
    private authService: AuthService,
    private wContentService: WContentService
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
    let linkDoc1: string = `http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Dictamen_Procedencia.jasper&ID_SOLICITUD=${this.idDoc}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
    this.src = linkDoc1;
    console.log('URL de reporte', this.src);

    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();
    console.log('Información de usuario', token);

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
  }

  registerSign() {
    let token = this.authService.decodeToken();
    const formData: Object = {
      name: token.name,
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
      const blobUrl = window.URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
      console.log('Descargar PDF', blob);
    });
  }

  uploadData(signatories: ISignatories): void {
    let config: ModalOptions = {
      initialState: {
        signatories,
        typeReport: this.typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadFielsModalComponent, config);
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
    //verificar que el estado de registro este como "Correcto" y siguiente paso
    this.listSigns = false;
    this.printReport = true;
    this.isAttachDoc = true;
    this.title = 'Imprimir Reporte';
    this.btnTitle = 'Adjuntar Documento';
    this.btnSubTitle = 'Imprimir Reporte';
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
    const id = this.idDoc;
    const nameTypeReport = this.nameTypeDoc;

    const formData: Object = {
      id: this.idDoc,
      firma: true,
      tipoDocumento: this.nameTypeDoc,
    };
    console.log(formData);
    this.gelectronicFirmService
      .firmDocument(id, nameTypeReport, formData)
      .subscribe({
        next: data => (console.log('correcto', data), this.handleSuccess()),
        error: error => (console.log('Error', error), this.close()),
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
    this.modalRef.hide();
  }
}
