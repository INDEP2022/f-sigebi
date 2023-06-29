import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
@Component({
  selector: 'app-list-no-attended',
  templateUrl: './list-no-attended.component.html',
  styles: [],
})
export class ListNoAttendedComponent extends BasePage implements OnInit {
  title: string = 'Bienes No Atendidos';
  form: FormGroup;
  data: any;
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data1.load(this.data);
    this.data1.refresh();
  }

  close() {
    this.modalRef.hide();
  }
}
