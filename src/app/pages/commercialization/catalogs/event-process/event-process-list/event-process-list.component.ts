import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS, COLUMNS_PROCESS } from './columns';
//Components
import { EventTProcessFormComponent } from '../event-tprocess-form/event-tprocess-form.component';
//Services
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { IComerEventRl } from 'src/app/core/models/ms-event/event.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';

@Component({
  selector: 'app-event-process-list',
  templateUrl: './event-process-list.component.html',
  styles: [],
})
export class EventProcessListComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  comerEvent: IComerEventRl[] = [];
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  totalItems1: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  columnFilters: any = [];
  columnFilters1: any = [];
  rowTypeProcess: boolean = false;

  eventId: string;
  button: boolean = false;

  settings2 = { ...this.settings };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService,
    private comerEventService: ComerEventService,
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
      columns: { ...COLUMNS },
    };
    this.settings.actions = false;

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_PROCESS },
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
              case 'eventTpId':
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
          this.params = this.pageFilter(this.params);
          this.getEventsByType();
        }
      });

    this.data1
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
                field = 'filter.comerDetail.' + filter.field;
                break;
              case 'warrantyDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'processKey':
                searchFilter = SearchFilter.ILIKE;
                field = 'filter.comerDetail.' + filter.field;
                break;
              case 'tpeventoId':
                searchFilter = SearchFilter.EQ;
                field = 'filter.comerDetail.' + filter.field;
                break;
              case 'statusvtaId':
                searchFilter = SearchFilter.ILIKE;
                field = 'filter.comerDetail.' + filter.field;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
              console.log(filter.search);
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getEventsByType();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventsByType());
    /*this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventProcess());*/

    //this.prepareForm();
    //this.getEvents();
  }

  /*private prepareForm(): void {
    this.form = this.fb.group({
      goodType: [null, [Validators.required]],
    });
  }*/

  /*getEvents() {
    let tpeventoId = this.form.controls['goodType'].value;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventsByType(tpeventoId));
  }*/

  getEventsByType() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.comerEventService.getAllEvent(params).subscribe({
      next: response => {
        this.comerEvent = response.data;
        this.data.load(response.data);
        this.totalItems = response.count || 0;
        this.data.refresh();
        //this.params.value.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  changeEvent(event: any) {
    if (event) {
      console.log(event.data);
      this.eventId = event.data.id;
      this.getEventProcess(event.data.id);
      this.rowTypeProcess = true;
    }
  }

  getEventProcess(id?: string) {
    this.loading = true;
    if (id) {
      this.params1.getValue()['filter.comerDetail.id'] = `$eq:${id}`;
    }
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    this.comerTpEventsService.getEventProGetAll(params).subscribe({
      next: response => {
        //this.comerEvent = response.data;
        this.data1.load(response.data);
        this.totalItems1 = response.count || 0;
        this.data1.refresh();
        this.params.value.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
        this.button = true;
      },
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

  openForm(event?: any) {
    if (event) console.log(event.data);
    const comerEvent = event != null ? event.data : null;
    const modalConfig = MODAL_CONFIG;
    const eventId = this.eventId;
    //const comerEvent: any = event.data;
    modalConfig.initialState = {
      comerEvent,
      eventId,
      callback: (next: boolean) => {
        if (next) this.getEventProcess(eventId);
      },
    };
    this.modalService.show(EventTProcessFormComponent, modalConfig);
  }

  showDeleteAlert(transferent?: any) {
    console.log(transferent.data);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(transferent.data.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  /*deleteEvent(id: string) {
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
            //this.getEvents();
          },
          error: error => {
            this.loading = false;
            this.showError();
          },
        });
      }
    });
  }*/

  delete(id?: string | number) {
    this.comerTpEventsService.remove(id).subscribe({
      next: data => {
        //this.loading = false;
        this.alert('success', 'Proceso', 'Borrado Correctamente');
        this.getEventProcess(this.eventId);
        //this.showSuccess();
        //this.getEvents();
      },
      error: error => {
        this.loading = false;
        this.showError();
      },
    });
  }
}
