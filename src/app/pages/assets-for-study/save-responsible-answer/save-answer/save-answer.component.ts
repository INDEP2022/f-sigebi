import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TextareaModalComponent } from '../textarea-modal/textarea-modal.component';

@Component({
  selector: 'app-save-answer',
  templateUrl: './save-answer.component.html',
  styles: [],
})
export class SaveAnswerComponent implements OnInit {
  showRequestDetail: boolean = true;
  save: boolean = false;

  //request datail data
  data: any = [];
  // datas de la lista de bienes
  dataAssets: any = [];

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {}

  finish(): void {}

  suspend(): void {
    this.openModal(TextareaModalComponent);
  }

  getAssetDta(event: any): void {}

  getListAssetsData(event: any) {}

  openModal(component: any, typeReport?: string) {
    let config: ModalOptions = {
      initialState: {
        information: '',
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
}
