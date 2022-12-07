import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DATEDOCUMENTS_COLUMNS } from './date-documents-columns';

@Component({
  selector: 'app-date-documents',
  templateUrl: './date-documents.component.html',
  styles: [],
})
export class DateDocumentsComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  dateDocumentsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DATEDOCUMENTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.dateDocumentsForm = this.fb.group({
      proceedings: [null, Validators.required],
    });
  }
}
