import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { ITevents } from 'src/app/core/models/catalogs/tevents.model';
import { BasePage } from 'src/app/core/shared';
import { IComerTpEvent } from '../../../../../core/models/ms-event/event-type.model';
import { ComerTpEventosService } from '../../../../../core/services/ms-event/comer-tpeventos.service';
import { EventTypesFornComponent } from '../event-types-form/event-types-forn.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styles: [],
})
export class EventTypesComponent extends BasePage implements OnInit {
  eventTypesD: IComerTpEvent[] = [];
  searchFilter: SearchBarFilter;
  columnFilters: any = [];
  selectedRow: IComerTpEvent | null = null;
  newId: number = 0;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columns = COLUMNS;

  constructor(
    private modalService: BsModalService,
    private comerTpEventosService: ComerTpEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              case 'zoneGeographic':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getAllEventTypes();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllEventTypes());
  }

  getAllEventTypes() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.comerTpEventosService.getAllComerTpEvent(params).subscribe({
      next: (response: any) => {
        if (response) {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count || 0;
          this.loading = false;
        }
      },
      error: err => {
        this.loading = false;
        this.alert(
          'error',
          'Se Presenta un Error en el Servidor para Mostrar los Tipos de Evenos',
          ''
        );
      },
    });
  }

  openForm(comerTpEvent?: IComerTpEvent) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      comerTpEvent,
      callback: (next: boolean) => {
        if (next) this.getAllEventTypes();
      },
    };
    this.modalService.show(EventTypesFornComponent, modalConfig);
  }

  showDeleteAlert(reginalDelegation: ITevents) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(reginalDelegation.id);
      }
    });
  }

  delete(id: number) {
    this.comerTpEventosService.removeTevents(id).subscribe({
      next: () => {
        this.alert('success', 'Tipo de Eveno ha sido Eliminado', '');
        this.getAllEventTypes();
      },
      error: error => {
        this.alert(
          'warning',
          'No se puede eliminar el Tipo de Evento debido a una relación con otra tabla',
          ''
        );
      },
    });
  }
}
