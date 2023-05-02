import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-annex-j-form',
  templateUrl: './annex-j-form.component.html',
  styles: [],
})
export class AnnexJFormComponent implements OnInit {
  signForm: ModelForm<any>;
  typeAnnex: string = '';

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    console.log(this.typeAnnex);
    this.initForm();
  }

  initForm() {
    this.signForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
      thirdSpecial: [null, [Validators.pattern(STRING_PATTERN)]],
      relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
      date1: [null],
      date2: [null],
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }

  save(): void {
    console.log(this.signForm.value);

    //usando el generador de reportes de notify-clarifications/print-report
    this.openModal(PrintReportModalComponent, '', this.typeAnnex);
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
