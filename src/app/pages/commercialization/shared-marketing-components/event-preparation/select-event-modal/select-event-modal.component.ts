import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ILot } from 'src/app/core/models/ms-lot/lot.model';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AddEditLoteModalComponent } from '../add-edit-lote-modal/add-edit-lote-modal.component';
import { CreateNewEventModalComponent } from '../create-new-event-modal/create-new-event-modal.component';
import { EVENT_COLUMNS, LOTE_COLUMNS } from './columns';

@Component({
  selector: 'app-select-event-modal',
  templateUrl: './select-event-modal.component.html',
  styles: [],
})
export class SelectEventModalComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  eventList: IComerEvent[] = [];
  event: IComerEvent;

  loteList: ILot[] = [];
  lote: ILot;

  settings2;

  constructor(
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService,
    private lotService: LotService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...EVENT_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...LOTE_COLUMNS },
    };
  }

  data: any;

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllEvent());
  }

  getAllEvent(): void {
    this.loading = true;

    this.comerEventosService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.eventList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openForm(event?: IComerEvent) {
    let config: ModalOptions = {
      initialState: {
        event,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CreateNewEventModalComponent, config);
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.loteList = [];
    this.event = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLotesByEvent(this.event));
  }

  getLotesByEvent(event: IComerEvent): void {
    this.loading = true;
    this.lotService.getLotbyEvent(event.id, this.params2.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.loteList = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm2(lote?: ILot) {
    let config: ModalOptions = {
      initialState: {
        lote,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AddEditLoteModalComponent, config);
  }
}
