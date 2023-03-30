import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFCCURP_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-upload-fiels-modal',
  templateUrl: './upload-fiels-modal.component.html',
  styles: [],
})
export class UploadFielsModalComponent extends BasePage implements OnInit {
  signatories: ISignatories;
  data: any = {};
  fileForm: ModelForm<any>;
  certiToUpload: File | null = null;
  keyCertiToUpload: File | null = null;
  typeReport: string = '';
  isRFCHided: boolean = true;
  edit: boolean = false;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.typeReport);
    this.initForm();
    this.setRFCInput();
  }

  initForm() {
    this.fileForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      post: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      pass: [null, [Validators.required]],
      rfcUser: [
        null,
        [
          Validators.required,
          Validators.pattern(RFCCURP_PATTERN),
          Validators.maxLength(13),
        ],
      ],
      certificate: [null],
      keycertificate: [null],
    });
    if (this.signatories != null) {
      this.edit = true;
      this.fileForm.patchValue(this.signatories);
    }
  }

  setRFCInput(): void {
    //typeReport === 'annexK' || typeReport === 'annexJ'
    if (
      this.typeReport === 'annexJ-assets-classification' ||
      this.typeReport === 'annexK-assets-classification'
    ) {
      this.isRFCHided = false;
    } else if (
      this.typeReport === 'annexJ-verify-noncompliance' ||
      this.typeReport === 'annexJ-verify-noncompliance'
    ) {
      this.isRFCHided = false;
    }
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
