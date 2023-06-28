import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { COLUMNS } from './columns';
//Components
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { EventTypesFornComponent } from '../event-types-form/event-types-forn.component';
//Provisional Data
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { ITevents } from 'src/app/core/models/catalogs/tevents.model';
import { BasePage } from 'src/app/core/shared';
import { IComerTpEvent } from '../../../../../core/models/ms-event/event-type.model';
import { ComerTpEventosService } from '../../../../../core/services/ms-event/comer-tpeventos.service';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styles: [],
})
export class EventTypesComponent extends BasePage implements OnInit {
  eventTypesD: IComerTpEvent[] = [];
  searchFilter: SearchBarFilter;
  columnFilters: any = [];
  //rowSelected: boolean = false;
  selectedRow: IComerTpEvent | null = null;
  newId: number = 0;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  //Columns
  columns = COLUMNS;

  constructor(
    private modalService: BsModalService,
    private tpEventService: ComerTpEventosService,
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
          this.totalItems = response.count || 0;
          this.data.load(response.data);
          console.log(response.data);
          this.data.refresh();
          this.loading = false;
        }
      },
      error: err => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  openForm(comerTpEvent?: IComerTpEvent): void {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      comerTpEvent,
      callback: (next: boolean) => {
        if (next) this.getAllEventTypes();
      },
    };
    this.modalService.show(EventTypesFornComponent, modalConfig);
  }

  delete(id: number) {
    this.comerTpEventosService.removeTevents(id).subscribe({
      next: () => {
        this.alert('success', 'Delegación Regional', 'Borrado');
        this.getAllEventTypes();
      },
      error: error => {
        this.alert(
          'warning',
          'Delegación Regional',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  showDeleteAlert(reginalDelegation: ITevents) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(reginalDelegation.id);
      }
    });
  }
}
