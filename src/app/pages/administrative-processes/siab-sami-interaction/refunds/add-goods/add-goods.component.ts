import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
import { goodsData } from './data';
//Models

@Component({
  selector: 'app-goods',
  templateUrl: './add-goods.component.html',
  styles: [],
})
export class AddGoodsComponent extends BasePage implements OnInit {
  data: any[] = goodsData; //IGood[];
  title: string = 'Bienes';

  selectedRows: any[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  @Output() refresh = new EventEmitter<any[]>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    //if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRows);
    this.modalRef.hide();
  }

  selectRow(event: any) {
    this.selectedRows = event.selected;
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
