import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-export-data-modal',
  templateUrl: './export-data-modal.component.html',
  styleUrls: [],
})
export class ExportDataModal extends BasePage implements OnInit {
  form: FormGroup;
  data = new DefaultSelect();

  constructor(private bsModalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {}

  initForms() {
    this.form = this.fb.group({
      proceddingsList: [null],
    });
  }

  getData(e: ListParams) {
    console.log(e);
  }

  close() {
    this.bsModalRef.hide();
  }
}
