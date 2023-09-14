import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-see-expedient',
  templateUrl: './see-expedient.component.html',
  styles: [],
})
export class SeeExpedientComponent implements OnInit {
  title: string = 'Expediente';
  validateEyeVisitResult: boolean = true;
  typeDoc: string = '';
  updateInfo: boolean = true;
  idRequest: number = null;

  private bsModalRef = inject(BsModalRef);

  constructor() {}

  ngOnInit(): void {
    this.requestSelected(1);
  }

  requestSelected(type: number) {
    this.typeDocumentMethod(type);
    this.updateInfo = true;
  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request';
        this.updateInfo = true;
        break;
      case 2:
        this.typeDoc = 'doc-expedient';
        this.updateInfo = true;
        break;
      case 3:
        this.typeDoc = 'request-expedient';
        this.updateInfo = true;
        break;
      default:
        break;
    }
  }

  selectTabData() {}

  close() {
    this.bsModalRef.hide();
  }
}
