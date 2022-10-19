import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styles: [
  ]
})
export class DocumentFormComponent extends BasePage implements OnInit {

  documentForm: FormGroup = new FormGroup({});
  typesDocuments = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef) { 
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.documentForm = this.fb.group({
      typeDocument: [null, [Validators.required]],
      document: [null, [Validators.required]],
      titleDocument: [null, [Validators.required]],
      numberGestion: [5296016],
      noSIAB: [null],
      responsible: [null],
      delegation: ['Metropolitana'],
      taxpayer: [null],
      state: [null],
      numberOffice: [null],
      transferent: [null],
      numberProgramming: [5397],
      sender: [null],
      programmingFolio: ['R-METROPOLITANA-SAT-5397-OS'],
      senderCharge: [null],
      comments: [null],
    })
  }

  getDocumentSelect(typeDocument: ListParams){

  }

  confirm(){}

  close(){
    this.modalRef.hide();
  }
}
