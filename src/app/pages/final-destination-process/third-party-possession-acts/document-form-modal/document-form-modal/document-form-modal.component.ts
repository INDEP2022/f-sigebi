import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';

@Component({
  selector: 'app-document-form-modal',
  templateUrl: './document-form-modal.component.html',
  styles: [],
})
export class DocumentFormModalComponent implements OnInit {
  documentForm: FormGroup;
  loading: boolean = false;
  document: any;
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm(): void {
    this.documentForm = this.fb.group({
      goodNumber: [3430113, [Validators.required]],
      natureDocument: ['original', [Validators.required]],
      descriptionDocument: [2012],
      significantDate: ['SOLICITADO'],
      scanStatus: [null],
      fileStatus: [null],
      userRequestsScan: ['dbsigebiadmon'],
      scanRequestDate: [null],
      userRegistersScan: [null],
      dateRegistrationScan: [null],
      userReceivesFile: ['Descrip'],
      dateReceivesFile: [null],
      keyTypeDocument: ['DEVOL', [Validators.required]],
      keySeparator: ['60'],
      numberProceedings: [null],
      sheets: [null],
      numberDelegationRequested: [1],
      numberSubdelegationRequests: [2],
      numberDepartmentRequest: [3],
      registrationNumber: [null],
      flyerNumber: [1],
      userSend: [null],
      areaSends: [null],
      sendDate: [null],
      sendFilekey: [null],
      userResponsibleFile: [null],
      mediumId: [null],
      associateUniversalFolio: [null],
      dateRegistrationScanningHc: [null],
      dateRequestScanningHc: [null],
    });
  }
  saveDocument() {
    // this.documentForm.value.significantDate =
    // this.documentForm.value.significantDate.getFullYear().toString();
    this.document = this.documentForm.value;
    this.document = JSON.stringify(this.documentForm.value);
    console.log(this.document);
    this.documentsService.create(this.document).subscribe({
      next: data => {
        console.log(data);
      },
      error: erro => {
        console.log(erro);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
