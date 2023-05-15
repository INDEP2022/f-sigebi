import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-print-report-restitution-modal',
  templateUrl: './print-report-restitution-modal.component.html',
  styles: [],
})
export class PrintReportRestitutionModalComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  title: string = 'Imprimir Reporte';
  btnTitle: string = 'Firma Reporte';
  printReport: boolean = true;
  isUploadingDoc: boolean = false;
  fileToUpload: File | null = null;

  typeReport: string = '';
  sizeMessage: boolean = false;

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeReport);
    /* this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());*/
  }

  close(): void {
    this.modalRef.hide();
  }

  signReport() {
    if (!this.isUploadingDoc && this.printReport) {
      this.printReport = false;
      this.isUploadingDoc = true;
      this.title = 'Cargar Documento';
    }
  }

  backStep(): void {
    this.printReport = true;
    this.isUploadingDoc = false;
    this.inputFile.nativeElement.value = '';
    this.title = 'Firma Reporte';
  }

  attachDoc(): void {
    let message = '¿Está seguro que quiere cargar el documento?';
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          console.log('enviar mensaje');
          console.log(this.fileToUpload);
          this.close();
        }
      }
    );
  }

  selectFile(event: any) {
    let file = event.target.files[0];
    let size = file.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
    } else {
      this.fileToUpload = file;
    }
  }
}
