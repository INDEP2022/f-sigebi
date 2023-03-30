import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-generate-dictum',
  templateUrl: './generate-dictum.component.html',
  styles: [],
})
export class GenerateDictumComponent implements OnInit {
  idDoc: any; //ID de solicitud, viene desde el componente principal
  idTypeDoc: any;

  pdfurl: string = '';
  public event: EventEmitter<any> = new EventEmitter();
  dictumForm: ModelForm<any>;

  constructor(
    private bsModelRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log('Id de documento: ', this.idDoc);
    this.initForm();
  }

  initForm(): void {
    this.dictumForm = this.fb.group({
      paragraph1Dictum: [null],
      paragraph2Dictum: [null],
      ccpDictum: [null],
      nameRecipientDictum: [null],
      chargeRecipientDictum: [null],
    });
  }

  signDictum(): void {
    const idDoc = this.idDoc;
    const typeAnnex = 'approval-request';
    const idTypeDoc = this.idTypeDoc;
    let config: ModalOptions = {
      initialState: {
        idDoc,
        idTypeDoc,
        typeAnnex,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintReportModalComponent, config);
    //this.modalService.show(PrintReportModalComponent,  config);
  }

  close(): void {
    this.bsModelRef.hide();
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
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

    /*this.bsModelRef.content.event.subscribe((res: any) => {
      // cargarlos en el formulario
      console.log(res);
    });*/
  }
}
