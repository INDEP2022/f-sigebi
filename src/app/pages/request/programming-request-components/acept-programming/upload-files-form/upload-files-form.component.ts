import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-upload-files-form',
  templateUrl: './upload-files-form.component.html',
  styles: [
  ]
})
export class UploadFilesFormComponent extends BasePage implements OnInit {

  uploadFileForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef) { 
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.uploadFileForm = this.fb.group({
      name : ['David Baez'],
      charge : ['Delegado'],
      password : [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      certificate: [null, [Validators.required]],
      keyCertificate: [null, [Validators.required]]
    })
  }

  confirm(){

  }

  close(){
    this.modalRef.hide();
  }
}
