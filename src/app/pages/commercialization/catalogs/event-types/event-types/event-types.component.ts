import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { COLUMNS } from './columns';
//Components
import { EventTypesFornComponent } from '../event-types-form/event-types-forn.component';
//Provisional Data
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { IComerTpEvent } from '../../../../../core/models/ms-event/event-type.model';
import { ComerTpEventosService } from '../../../../../core/services/ms-event/comer-tpeventos.service';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styles: [],
})
export class EventTypesComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  eventTypesD: IComerTpEvent[] = [];
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
    this.service = this.tpEventService;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
  }

  override getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.service.getAll(params).subscribe({
      next: (response: any) => {
        if (response) {
          this.totalItems = response.count || 0;
          this.data.load(response.data);
          this.data.refresh();
          this.newId = this.tpEventService.getNewId(response.data);
          this.loading = false;
        }
      },
      error: err => {
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
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
