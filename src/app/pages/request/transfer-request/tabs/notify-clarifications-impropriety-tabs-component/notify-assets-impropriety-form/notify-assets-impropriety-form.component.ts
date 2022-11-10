import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-notify-assets-impropriety-form',
  templateUrl: './notify-assets-impropriety-form.component.html',
  styles: [],
})
export class NotifyAssetsImproprietyFormComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Aclaración';
  clarificationForm: ModelForm<any>;
  clarification: any;

  //en el caso de que una aclaracion llege sin documentacion
  withDocumentation: boolean = false;

  //parametro si es inteconexion por el tipo de transferente pasado desde el padre
  isInterconnection: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.withDocumentation =
      this.clarification[0].typeClarification === '1' ? true : false;

    this.initForm1();
  }

  initForm2(): void {
    this.clarificationForm = this.fb.group({
      receiver: [null],
      senderCharge: [null],
      receiverCharge: [null],
      //keyClarification: [null],
      //idTransmitter: [null],
      clarification: [null],
      consistent: [null],
      //finalParagraph: [null],
      //initialParagraph: [null],
      observations: [null],
      captureUserArea: [null],
      emailNotifiSat: [null],
      nameSender: [null],
    });
  }

  initForm1(): void {
    this.clarificationForm = this.fb.group({
      receiver: [null],
      senderCharge: [null],
      receiverCharge: [null],
      keyClarification: [null],
      idTransmitter: [null],
      clarification: [null],
      consistent: [null],
      finalParagraph: [null],
      initialParagraph: [null],
      observations: [null],
      captureUserArea: [null],
      emailNotifiSat: [null],
      nameSender: [null],
    });
  }

  confirm() {
    console.log(this.clarificationForm.value);
    if (this.clarification[0].typeClarification === '1') {
      // cambiar el estado de la aclaracion en "EN_ACLARACION"
    } else {
      let config: ModalOptions = {
        initialState: {
          sign: '',
          callback: (next: boolean) => {
            //if (next){ this.getData();}
          },
        },
        class: 'modalSizeXL modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(PrintReportModalComponent, config);
    }
    this.close();
  }

  close() {
    console.log('cerrar');

    this.modalRef.hide();
  }
}
