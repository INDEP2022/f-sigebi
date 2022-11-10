import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MENAJE_COLUMN } from './menaje-columns';

@Component({
  selector: 'app-menaje',
  templateUrl: './menaje.component.html',
  styles: [],
})
export class MenajeComponent extends BasePage implements OnInit {
  title: any = 'Inmuebles de la solicitud';
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  public event: EventEmitter<any> = new EventEmitter();
  immovablesSelected: any;

  data: any;

  constructor(private modelRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: MENAJE_COLUMN,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {}

  selectRow(event: any) {
    console.log(event);

    this.immovablesSelected = event.data;
  }

  selectImmovable() {
    this.event.emit(this.immovablesSelected);
    this.close();
  }

  close() {
    this.modelRef.hide();
  }
}
