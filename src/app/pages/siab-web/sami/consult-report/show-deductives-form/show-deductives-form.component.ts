import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { PENDING_DEDUCTIVES_COLUMNS } from './show-deductives.columns';

@Component({
  selector: 'app-show-deductives-form',
  templateUrl: './show-deductives-form.component.html',
  styles: [],
})
export class ShowDeductivesFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  deductivesP = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      selectMode: 'multi',
      actions: false,
      columns: PENDING_DEDUCTIVES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      total: [null],
      folios: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }
}
