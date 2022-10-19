import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-rescheduling-form',
  templateUrl: './rescheduling-form.component.html',
  styles: [],
})
export class ReschedulingFormComponent extends BasePage implements OnInit {
  reschedulingForm: FormGroup = new FormGroup({});
  reasonData = new DefaultSelect();
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.reschedulingForm = this.fb.group({
      reason: [null],
    });
  }
  close() {
    this.modalRef.hide();
  }

  getReasonSelect(reason: ListParams) {}
  confirm() {}
}
