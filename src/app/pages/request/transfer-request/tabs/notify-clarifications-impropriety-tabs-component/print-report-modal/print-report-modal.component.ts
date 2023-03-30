import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UploadFielsModalComponent } from '../upload-fiels-modal/upload-fiels-modal.component';
import { LIST_REPORTS_COLUMN } from './list-reports-column';

var data = [
  {
    id: 1,
    name: 'ENRIQUE GUZMAN',
    position: 'SUPERVISOR',
    statusRegistration: 'DATOS INCOMPLETOS',
  },
];

@Component({
  selector: 'app-print-report-modal',
  templateUrl: './print-report-modal.component.html',
  styles: [],
})
export class PrintReportModalComponent extends BasePage implements OnInit {
  idDoc: any;
  idTypeDoc: any;

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

  constructor(
    public modalService: BsModalService,
    public modalRef: BsModalRef,
    private signatoriesService: SignatoriesService
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
    let linkDoc1: string = `http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Dictamen_Procedencia.jasper&ID_SOLICITUD=${this.idDoc}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
    this.src = linkDoc1;
    /*this.settings = { ...TABLE_SETTINGS, actions: false };
    this.settings.columns = LIST_REPORTS_COLUMN;

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          console.log(data);
          this.uploadData(data);
        });
      },
    };*/

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());
  }

  //Trae todo el listado de los firmantes
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

      this.ListReports();
    } else if (!this.listSigns && this.printReport && this.isAttachDoc) {
      //adjuntar el reporte
      let message = '¿Está seguro que quiere cargar el documento?';
      this.openMessage(message);
      this.close();
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
    });
  }

  ListReports() {
    //llamar a la lista de reportes
    this.paragraphs = data;
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

  openMessage(message: string): void {
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          console.log('enviar mensaje');
        }
      }
    );
  }
}
