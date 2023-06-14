import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import {
  IReceipt,
  IReceiptwitness,
} from 'src/app/core/models/receipt/receipt.model';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared';
import { environment } from 'src/environments/environment';
import { LIST_REPORTS_COLUMN } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/list-reports-column';

@Component({
  selector: 'app-show-report-component',
  templateUrl: './show-report-component.component.html',
  styles: [],
})
export class ShowReportComponentComponent extends BasePage implements OnInit {
  private pdf: PDFDocumentProxy;
  idTypeDoc: number = 0;
  idProg: number = 0;
  receiptId: number = 0;
  isPdfLoaded = false;
  title: string = 'Imprimir Reporte';
  btnTitle: string = 'Firmar Reporte';
  printReport: boolean = true;
  listSigns: boolean = false;
  msjCheck: boolean = false;
  infoFirmantes: any[] = [];
  btnSubTitle: string = 'Vista Previa Reporte';
  signatories: ISignatories[] = [];
  selectedRow: any = null;
  urlBaseReport = `${environment.API_URL}processgoodreport/report/showReport?nombreReporte=`;
  src: string = '';
  isAttachDoc: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private receptionGoodService: ReceptionGoodService,
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

  ngOnInit(): void {
    this.showReportByTypeDoc();
    this.getReceipt();
    this.getWitness();
    this.signParams();
  }

  showReportByTypeDoc() {
    console.log('idTypeDoc', this.idTypeDoc);
    if (this.idTypeDoc == 103) {
      let linkDoc: string = `${this.urlBaseReport}Recibo_Entrega.jasper&ID_PROG=${this.idProg}&ID_RECIBO=${this.receiptId}`;
      this.src = linkDoc;
      console.log('URL reporte ', linkDoc);
    }
  }

  getReceipt() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProg;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        this.createPersonsSing(response.data[0]);
      },
      error: error => {},
    });
  }

  getWitness() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProg;
    this.receptionGoodService.getReceiptsWitness(params.getValue()).subscribe({
      next: response => {
        const infoWitness = response.data.map((item: IReceiptwitness) => {
          const info = {
            name: item.nameWitness,
            post: item.chargeWitness,
            learnedType: this.idTypeDoc,
            learnedId: this.idProg,
          };
          this.infoFirmantes.push(info);
        });
      },
      error: error => {},
    });
  }

  createPersonsSing(receipt: IReceipt) {
    const nameReceipt = receipt.nameReceipt;
    const chargeReceip = receipt.chargeReceipt;

    const infoReceipt = {
      name: nameReceipt,
      post: chargeReceip,
      learnedType: this.idTypeDoc,
      learnedId: this.idProg,
    };
    this.infoFirmantes.push(infoReceipt);

    const nameDelivery = receipt.nameDelivery;
    const chargeDelivery = receipt.chargeDelivery;

    const infoDelivery = {
      name: nameDelivery,
      post: chargeDelivery,
      learnedType: this.idTypeDoc,
      learnedId: this.idProg,
    };
    this.infoFirmantes.push(infoDelivery);

    console.log('name witness', this.infoFirmantes);

    this.infoFirmantes.map(formData => {
      this.signatoriesService.create(formData).subscribe({
        next: async response => {
          console.log('firmantes', response);
          //this.signParams(), console.log('Firmante creado: ', response);
        },
        error: error => console.log('No se puede crear: ', error),
      });
    });
  }

  signParams() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());
  }

  getSignatories() {
    const learnedType = this.idTypeDoc;
    const learnedId = this.idProg;
    this.loading = true;
    this.signatoriesService
      .getSignatoriesFilter(learnedType, learnedId)
      .subscribe({
        next: response => {
          console.log('Traer firmantes', response);
          this.signatories = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
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

  signDocument() {
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

  registerSign() {}

  sendSign() {
    //verificar que el estado de registro este como "datos completo" y enviarlo!
    let message = '¿Está seguro de enviar la información a firmar?';
    this.openMessage(message);
  }

  openMessage(message: string): void {
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          //this.firm();
          console.log('enviar a firmar');
        }
      }
    );
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

  backStep() {
    /*if (this.notificationValidate == 'Y') {
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
    this.paragraphs = []; */
  }

  close() {
    this.modalRef.hide();
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

  validAttachDoc() {}
}
