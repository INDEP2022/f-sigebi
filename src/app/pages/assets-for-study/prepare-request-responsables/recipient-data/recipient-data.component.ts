import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { BasePage } from '../../../../core/shared/base-page';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';

@Component({
  selector: 'app-recipient-data',
  templateUrl: './recipient-data.component.html',
  styles: [],
})
export class RecipientDataComponent extends BasePage implements OnInit {
  childModal: BsModalRef;
  recipientForm: ModelForm<any>;
  imformation: any | null = null;
  typeReport: string = '';

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.recipientForm = this.fb.group({
      recipient: [null],
      emailRecipient: [null],
      recipientPosition: [null],
    });
  }

  send(): void {
    this.loading = true;
    this.openModal(ReportPreviewComponent, this.typeReport);
    this.close();
  }

  close(): void {
    this.bsModalRef.content.callback({ editado: true });
    this.bsModalRef.hide();
  }

  openModal(component: any, typeReport?: string) {
    let config: ModalOptions = {
      initialState: {
        information: '',
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(component, config);

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
}
