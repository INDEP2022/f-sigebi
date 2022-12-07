import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-generate-report-form',
  templateUrl: './generate-report-form.component.html',
  styles: [],
})
export class GenerateReportFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      responsible: [null],
      charge: [null],
      electronicSignature: [null],
    });
  }

  confirm() {
    this.modalRef.content.callback(true);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
