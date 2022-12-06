import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RecipientDataComponent } from '../recipient-data/recipient-data.component';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styles: [],
})
export class ReportPreviewComponent implements OnInit {
  title: string = 'Vista del reporte';
  childModal: BsModalRef;

  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  close() {
    this.bsModalRef.hide();
    this.openModal(RecipientDataComponent);
  }

  openModal(component: any) {
    let config: ModalOptions = {
      initialState: {
        information: '',
        typeReport: 'prepare-request',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(component, config);

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
}
