import { Component, OnInit } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styles: [],
})
export class ViewDocumentsComponent implements OnInit {
  src = '';
  isPdfLoaded = false;
  private pdf: PDFDocumentProxy;
  linkDoc1: string;

  constructor(public modalRef: BsModalRef) {}

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  ngOnInit(): void {
    this.src = this.linkDoc1;
  }

  close(): void {
    this.modalRef.hide();
  }
}
