import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { EVENT_COLUMNS } from './event-selection-columns';

@Component({
  selector: 'app-event-selection-modal',
  templateUrl: './event-selection-modal.component.html',
  styles: [],
})
export class EventSelectionModalComponent extends BasePage implements OnInit {
  // tipo any hasta que existan modelos o interfaces de la respuesta del backend
  rowSelected: boolean = false;
  selectedRow: any = null;
  columns: any[] = [];
  totalItems: number = 0;
  title: string = 'Tipo Penalización';
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();
  table: HTMLElement;

  testData = [
    {
      id: 1,
      event: 'DECBM 01/07',
      description: 'EJEMPLO DESCRIPCION PARA EVENTO',
    },
    {
      id: 2,
      event: 'DECBM 01/08',
      description: 'EJEMPLO DESCRIPCION PARA EVENTO',
    },
    {
      id: 3,
      event: 'DECBM 01/09',
      description: 'EJEMPLO DESCRIPCION PARA EVENTO',
    },
    {
      id: 4,
      event: 'DECBM 01/10',
      description: 'EJEMPLO DESCRIPCION PARA EVENTO',
    },
    {
      id: 5,
      event: 'DECBM 01/11',
      description: 'EJEMPLO DESCRIPCION PARA EVENTO',
    },
  ];

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      selectedRowIndex: -1,
      actions: false,
      columns: { ...EVENT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    this.columns = this.testData;
    this.totalItems = this.testData.length;
    this.loading = false;
  }

  close() {
    this.modalRef.hide();
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
