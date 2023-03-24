import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { EventTProcessFormComponent } from '../event-tprocess-form/event-tprocess-form.component';
//Services
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { IComerTpEventFull } from 'src/app/core/models/ms-event/event-type.model';
import { IComerEventRl } from 'src/app/core/models/ms-event/event.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';

@Component({
  selector: 'app-event-process-list',
  templateUrl: './event-process-list.component.html',
  styles: [],
})
export class EventProcessListComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  comerEvent: IComerEventRl[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  columnFilters: any = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService,
    private comerTpEventsService: ComerTpEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: false,
      },
      columns: COLUMNS,
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
            /*  SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(filter.search);
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getEvents();
        }
      });

    this.prepareForm();
    this.getEvents();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      goodType: [null, [Validators.required]],
    });
  }

  getEvents() {
    let tpeventoId = this.form.controls['goodType'].value;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventsByType(tpeventoId));
  }

  getEventsByType(id: string | number): void {
    this.loading = true;
    this.comerTpEventsService
      .getEventsByType(id, this.params.getValue())
      .subscribe({
        next: response => {
          this.comerEvent = response.data;
          this.data.load(this.comerEvent);
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  deleteEvent(id: string) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.comerEventosService.remove(id).subscribe({
          next: data => {
            this.loading = false;
            this.showSuccess();
            this.getEvents();
          },
          error: error => {
            this.loading = false;
            this.showError();
          },
        });
      }
    });
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

  openForm(comerEvent?: IComerTpEventFull) {
    console.log(comerEvent);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      comerEvent,
      callback: (next: boolean) => {
        if (next) this.getEvents();
      },
    };
    this.modalService.show(EventTProcessFormComponent, modalConfig);
  }
}
