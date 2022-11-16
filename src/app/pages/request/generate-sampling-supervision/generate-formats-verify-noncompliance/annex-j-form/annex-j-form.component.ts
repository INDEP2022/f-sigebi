import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-annex-j-form',
  templateUrl: './annex-j-form.component.html',
  styles: [],
})
export class AnnexJFormComponent implements OnInit {
  signForm: ModelForm<any>;

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signForm = this.fb.group({
      name: [null],
      position: [null],
      thirdSpecial: [null],
      relevantFacts: [null],
      date1: [null],
      date2: [null],
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }

  save(): void {
    console.log(this.signForm.value);
    this.openModal(PrintReportModalComponent, '', 'annexj');
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
