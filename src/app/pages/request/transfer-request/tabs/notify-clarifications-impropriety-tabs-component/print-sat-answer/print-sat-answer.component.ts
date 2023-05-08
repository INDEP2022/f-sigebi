import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@Component({
  selector: 'app-print-sat-answer',
  templateUrl: './print-sat-answer.component.html',
  styles: [],
})
export class PrintSatAnswerComponent implements OnInit {
  title: string = 'Reporte';
  src = '';
  idAclaracion: any;

  isPdfLoaded = false;
  idSolicitud: any;
  private pdf: PDFDocumentProxy;

  constructor(
    public modalRef: BsModalRef,
    private sanitizer: DomSanitizer,
    public modalService: BsModalService
  ) {}

  ngOnInit(): void {
    let linkDoc1: string = `http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Oficio_Aclaracion_Respuesta.jasper&ID_ACLARACION=${this.idAclaracion}`;
    this.src = linkDoc1;
    this.updateStatus();
  }

  updateStatus() {
    //Actualizar status bien
    //Actualizar status de notificaciones
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

  close(): void {
    this.modalRef.hide();
  }
}
