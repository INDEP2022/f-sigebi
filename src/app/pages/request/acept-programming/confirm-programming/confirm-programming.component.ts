import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { ElectronicSignatureListComponent } from '../electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../show-programming/show-programming.component';

@Component({
  selector: 'app-confirm-programming',
  templateUrl: './confirm-programming.component.html',
  styles: [
  ]
})
export class 
ConfirmProgrammingComponent extends BasePage implements OnInit {

  confirmForm: FormGroup = new FormGroup({});
  constructor(
    private fb:FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef
    ) { 
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.confirmForm = this.fb.group({
      name: [null,[Validators.required]],
      charge: [null,[Validators.required]],
    })
  }

  confirm(){
    this.modalRef.content.callback(true);
    this.modalRef.hide();  
  }

  electronicSig(){
    const electronicSig = this.modalService.show(ElectronicSignatureListComponent,{
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    })
  }

  close(){
    this.modalService.hide();
  }
}
