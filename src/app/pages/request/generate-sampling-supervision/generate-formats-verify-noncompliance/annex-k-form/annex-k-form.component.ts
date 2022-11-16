import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-annex-k-form',
  templateUrl: './annex-k-form.component.html',
  styleUrls: ['./annex-k-form.component.scss'],
})
export class AnnexKFormComponent implements OnInit {
  detailForm: ModelForm<any>;
  participantDataForm: ModelForm<any>;
  detailAnnexForm: ModelForm<any>;

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.initDetailForm();
    this.initParicipantForm();
    this.initAnnexDetailForm();
  }

  initDetailForm(): void {
    this.detailForm = this.fb.group({
      name: [null],
      position: [null],
      typeSign: [null],
    });
  }

  initParicipantForm(): void {
    this.participantDataForm = this.fb.group({
      name1: [null],
      position1: [null],
      name2: [null],
      position2: [null],
    });
  }

  initAnnexDetailForm(): void {
    this.detailAnnexForm = this.fb.group({
      warehouseManager: [null],
      relevantFacts: [null],
      agreements: [null],
    });
  }

  signAnnex(): void {
    this.openModal(PrintReportModalComponent, '', 'annexK');
    this.close();
  }

  close(): void {
    this.bsModalRef.hide();
  }

  openModal(component: any, data?: any, typeReport?: String): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }
}
