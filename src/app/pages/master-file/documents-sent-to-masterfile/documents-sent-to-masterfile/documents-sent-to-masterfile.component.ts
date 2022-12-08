import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCUMENTS_SENT_COLUMNS } from './documents-sent-columns';

@Component({
  selector: 'app-documents-sent-to-masterfile',
  templateUrl: './documents-sent-to-masterfile.component.html',
  styles: [],
})
export class DocumentsSentToMasterfileComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DOCUMENTS_SENT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      area: [null, Validators.required],
      sentBy: [null, Validators.required],

      record: [null, Validators.required],
      responsible: [null, Validators.required],
    });
  }
}
