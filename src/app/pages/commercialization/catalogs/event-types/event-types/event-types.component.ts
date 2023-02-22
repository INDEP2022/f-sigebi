import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { EventTypesFornComponent } from '../event-types-form/event-types-forn.component';
//Provisional Data
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IComerTpEvent } from '../../../../../core/models/ms-event/event-type.model';
import { ComerTpEventosService } from '../../../../../core/services/ms-event/comer-tpeventos.service';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styles: [],
})
export class EventTypesComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  eventTypesD: IComerTpEvent[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  rowSelected: boolean = false;
  selectedRow: IComerTpEvent | null = null;
  newId: number = 0;

  //Columns
  columns = COLUMNS;

  constructor(
    private modalService: BsModalService,
    private tpEventService: ComerTpEventosService
  ) {
    super();
    this.searchFilter = { field: 'description' };
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData(): void {
    this.loading = true;
    this.tpEventService
      .getAllWithFilters(this.params.getValue().getParams())
      .subscribe({
        next: response => {
          this.eventTypesD = response.data;
          this.data.load(this.eventTypesD);
          this.totalItems = response.count;
          this.newId = this.tpEventService.getNewId(response.data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
  }

  openModal(context?: Partial<EventTypesFornComponent>): void {
    const modalRef = this.modalService.show(EventTypesFornComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  add(): void {
    this.openModal({ newId: this.newId });
  }

  openForm(eventType: IComerTpEvent): void {
    this.openModal({ edit: true, eventType });
  }

  delete(eventType: IComerTpEvent): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.tpEventService.remove(eventType.id).subscribe({
          next: data => {
            this.loading = false;
            this.showSuccess();
            this.getData();
          },
          error: error => {
            this.loading = false;
            this.showError();
          },
        });
      }
    });
  }

  selectRow(row: IComerTpEvent): void {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  showSuccess(): void {
    this.onLoadToast(
      'success',
      'Tipo Evento',
      `Registro Eliminado Correctamente`
    );
  }

  showError(error?: any): void {
    this.onLoadToast(
      'error',
      `Error al eliminar datos`,
      'Hubo un problema al conectarse con el servior'
    );
    error ? console.log(error) : null;
  }
}
