import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-refuse-clarification-modal',
  templateUrl: './refuse-clarification-modal.component.html',
  styles: [],
})
export class RefuseClarificationModalComponent
  extends BasePage
  implements OnInit
{
  clarification: any;
  observationForm: ModelForm<any>;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.observationForm = this.fb.group({
      observation: [null],
    });
  }

  refuse() {
    console.log(this.observationForm.value);
    this.close();
  }

  close(): void {
    this.modalRef.hide();
  }
}
