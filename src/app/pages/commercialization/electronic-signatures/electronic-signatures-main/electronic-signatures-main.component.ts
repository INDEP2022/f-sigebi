import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  HISTORY_COLUMNS,
  PENDING_COLUMNS,
} from './electronic-signature-columns';

@Component({
  selector: 'app-electronic-signatures-main',
  templateUrl: './electronic-signatures-main.component.html',
  styles: [],
  animations: [
    trigger('OnInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ElectronicSignaturesMainComponent
  extends BasePage
  implements OnInit
{
  alertMsg: boolean = true;
  pdfUrl: string =
    'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  pendingRows: any[] = [];
  historyRows: any[] = [];
  pendingParams = new BehaviorSubject<ListParams>(new ListParams());
  historyParams = new BehaviorSubject<ListParams>(new ListParams());
  pendingTotalItems: number = 0;
  historyTotalItems: number = 0;
  pendingColumns: any[] = [];
  historyColumns: any[] = [];
  pendingSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  historySettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  pendingTestData = [
    {
      reference: 'Evento 22335',
      report: 'Reporte 02',
      date: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
    {
      reference: 'Evento 22336',
      report: 'Reporte 02',
      date: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
    {
      reference: 'Evento 22337',
      report: 'Reporte 02',
      date: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
    {
      reference: 'Evento 22338',
      report: 'Reporte 02',
      date: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
    {
      reference: 'Evento 22339',
      report: 'Reporte 02',
      date: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
  ];

  historyTestData = [
    {
      user: 'VCORTES',
      reference: 'Evento 22333',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'ELABORA',
    },
    {
      user: 'VCORTES',
      reference: 'Evento 22333',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'REVISA',
    },
    {
      user: 'MGARCIA',
      reference: 'Evento 22333',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
    {
      user: 'AMORALES',
      reference: 'Evento 22334',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'ELABORA',
    },
    {
      user: 'AMORALES',
      reference: 'Evento 22334',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'REVISA',
    },
    {
      user: 'MGARCIA',
      reference: 'Evento 22334',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
    this.pendingSettings.columns = PENDING_COLUMNS;
    this.historySettings.columns = HISTORY_COLUMNS;
  }

  ngOnInit(): void {
    this.getPending();
    this.getHistory();
  }

  getPending() {
    this.pendingColumns = this.pendingTestData;
    this.pendingTotalItems = this.pendingColumns.length;
  }

  getHistory() {
    this.historyColumns = this.historyTestData;
    this.historyTotalItems = this.historyColumns.length;
  }

  selectPending(row: any) {
    this.pendingRows.push(row);
  }

  selectHistory(row: any) {
    this.historyRows.push(row);
  }

  refresh() {
    this.getPending();
    this.getHistory();
  }

  viewFile() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  openSignWindow() {
    let url =
      'http://firma.sae.gob.mx/firmar.aspx?DICTAMEN=_&NATURALEZA_DOC=&NO_DOCUMENTO=&TIPO_DOCUMENTO=&RFC_USR=XAXX010101000';
    window.open(url, 'Firmar Documento | INDEP');
  }

  downloadFile() {
    this.downloadPdf(this.pdfUrl, 'example_document');
  }

  downloadPdf(url: string, name: string) {
    // Ejemplo con un get normal, cambiar por el servicio para recibir el pdf
    const PDF_EXTENSION = '.pdf';
    let req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function () {
      var file = new Blob([req.response], {
        type: 'application/pdf',
      });
      FileSaver.saveAs(file, name + PDF_EXTENSION);
    };
    req.send();
  }
}
