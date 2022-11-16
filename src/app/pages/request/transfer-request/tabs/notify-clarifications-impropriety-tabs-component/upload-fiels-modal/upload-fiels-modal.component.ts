import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-upload-fiels-modal',
  templateUrl: './upload-fiels-modal.component.html',
  styles: [],
})
export class UploadFielsModalComponent extends BasePage implements OnInit {
  data: any = {};
  fileForm: ModelForm<any>;
  certiToUpload: File | null = null;
  keyCertiToUpload: File | null = null;
  typeReport: string = '';

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.typeReport);
    this.initForm();
  }

  initForm() {
    this.fileForm = this.fb.group({
      name: [{ value: null, disabled: true }],
      position: [{ value: null, disabled: true }],
      password: [null],
      rfc: [null],
      certificationFile: [null],
      keyCertificationFile: [null],
    });
  }

  chargeCertifications(event: any) {
    this.certiToUpload = event.target.files[0];
    console.log(this.certiToUpload);
  }

  chargeKeyCertifications(event: any) {
    this.keyCertiToUpload = event.target.files[0];
    console.log(this.keyCertiToUpload);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    //upload the form and the files for upload
    console.log(this.fileForm.value);
    this.close();
  }
}
