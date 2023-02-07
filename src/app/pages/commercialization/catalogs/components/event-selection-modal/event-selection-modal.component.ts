import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerEventosService } from '../../../../../core/services/ms-event/comer-eventos.service';
import { IComerEvent } from './../../../../../core/models/ms-event/event.model';
import { EVENT_COLUMNS } from './event-selection-columns';

@Component({
  selector: 'app-event-selection-modal',
  templateUrl: './event-selection-modal.component.html',
  styles: [],
})
export class EventSelectionModalComponent extends BasePage implements OnInit {
  rowSelected: boolean = false;
  selectedRow: IComerEvent = null;
  columns: IComerEvent[] = [];
  totalItems: number = 0;
  title: string = 'Seleccionar Evento';
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<any>();
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

  constructor(
    private modalRef: BsModalRef,
    private eventsService: ComerEventosService
  ) {
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

  getData(): void {
    this.loading = true;
    // this.columns = this.testData;
    // this.totalItems = this.testData.length;
    // this.loading = false;
    this.eventsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  selectRow(row: IComerEvent) {
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
