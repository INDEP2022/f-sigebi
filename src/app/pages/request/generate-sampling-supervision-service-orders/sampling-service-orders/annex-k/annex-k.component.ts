import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-annex-k',
  templateUrl: './annex-k.component.html',
  styles: [],
})
export class AnnexKComponent implements OnInit {
  signDataForm: ModelForm<any>;
  participantsDataForm: ModelForm<any>;
  typeAnnex: string = '';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.initSignDataForm();
    this.initParticipantsData();
  }

  initSignDataForm() {
    this.signDataForm = this.fb.group({
      name: [null],
      charge: [null],
    });
  }

  initParticipantsData() {
    this.participantsDataForm = this.fb.group({
      name1: [null],
      charge1: [null],
      name2: [null],
      charge2: [null],
    });
  }

  signAnnex() {
    this.openModal(PrintReportModalComponent, '', this.typeAnnex);
  }

  close() {
    this.bsModalRef.hide();
  }

  openModal(component: any, data?: any, typeAnnex?: string) {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }
}
