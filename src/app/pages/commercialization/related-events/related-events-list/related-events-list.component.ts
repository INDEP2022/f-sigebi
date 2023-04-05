import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRequestEventRelated } from 'src/app/core/models/requests/request-event-related.model';
import { EventRelatedService } from 'src/app/core/services/ms-event-rel/event-rel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { TABLE_SETTINGS } from '../../../../common/constants/table-settings';
import { SelectRelatedEventComponent } from '../components/select-related-event/select-related-event.component';
import { RELATED_EVENTS_COLUMNS } from './related-events-columns';

@Component({
  selector: 'app-related-events-list',
  templateUrl: './related-events-list.component.html',
  styles: [],
  animations: [
    trigger('OnEventSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class RelatedEventsListComponent extends BasePage implements OnInit {
  eventForm: FormGroup = new FormGroup({});
  eventItems = new DefaultSelect();
  selectedEvent: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  totalItems: number = 0;
  relatedEventsColumns: any[] = [];
  filterRow: any;
  addOption: any;
  adding: boolean = false;
  addRowElement: any;
  cancelBtn: any;
  cancelEvent: any;
  readOnlyInput: any;
  createButton: string =
    '<span class="btn btn-success active font-size-12 me-2 mb-2 py-2 px-2">Agregar</span>';
  saveButton: string =
    '<span class="btn btn-info active font-size-12 me-2 mb-2 py-2 px-2">Actualizar</span>';
  cancelButton: string =
    '<span class="btn btn-warning active font-size-12 text-black me-2 mb-2 py-2 px-2 cancel">Cancelar</span>';

  relatedEventsSettings = {
    ...TABLE_SETTINGS,
    mode: 'internal',
    hideSubHeader: false,
    filter: {
      inputClass: 'd-none',
    },
    attr: {
      class: 'table-bordered normal-hover',
    },
    add: {
      createButtonContent: this.createButton,
      cancelButtonContent: this.cancelButton,
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
      saveButtonContent: this.saveButton,
      cancelButtonContent: this.cancelButton,
      confirmSave: true,
    },
  };

  eventsData = [
    {
      id: 11122,
      process: 'DECBMI0107',
      status: 'CONCILIADO A SIRSAE',
      type: 'LICITACIÓN',
      direction: 'INMUEBLES',
    },
    {
      id: 2321,
      process: 'DECBMI0107',
      status: 'CONCILIADO A SIRSAE',
      type: 'LICITACIÓN',
      direction: 'INMUEBLES',
    },
    {
      id: 3123,
      process: 'DECBMI0107',
      status: 'CONCILIADO A SIRSAE',
      type: 'LICITACIÓN',
      direction: 'INMUEBLES',
    },
  ];

  relatedEventsData: IRequestEventRelated[] = [];

  constructor(
    private fb: FormBuilder,
    private eventRelatedService: EventRelatedService
  ) {
    super();
    this.relatedEventsSettings.columns = RELATED_EVENTS_COLUMNS;
    this.relatedEventsSettings.actions.delete = true;
    this.relatedEventsSettings.columns = {
      ...this.relatedEventsSettings.columns,
      id: {
        title: 'Evento',
        sort: false,
        type: 'html',
        width: '25%',
        editor: {
          type: 'custom',
          component: SelectRelatedEventComponent,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getRelatedEvents({ page: 1, text: '' });
    this.eventForm = this.fb.group({
      event: [null],
      txtSearch: [''],
    });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSearch());
  }

  getRelatedEvents(params: ListParams) {
    // if (params.text == '') {
    //   this.eventItems = new DefaultSelect(this.eventsData, 5);
    // } else {
    //   const id = parseInt(params.text);
    //   const item = [this.eventsData.filter((i: any) => i.id == id)];
    //   this.eventItems = new DefaultSelect(item[0], 1);
    // }
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;

    if (this.eventForm.value.txtSearch) {
      this.filterParams
        .getValue()
        .addFilter('title', this.eventForm.value.txtSearch, SearchFilter.ILIKE);
    }

    this.eventRelatedService
      .getEventRelsByUser(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          console.log('Response: ', response);
          let arrEventRel: IRequestEventRelated[] = [];
          if (response.data) {
            response.data.forEach((item: any) => {
              let eventRel: IRequestEventRelated = {
                eventRelId: item.eventRel.id,
                processKey: item.eventRel.processKey,
                statusvtaId: item.eventRel.statusvtaId,
                tpeventoId: item.eventRel.tpeventoId,
                address: item.eventRel.address,
              };
              console.log('eventRel: ', eventRel);
              arrEventRel.push(eventRel);
            });
          }

          this.loading = false;
          this.relatedEventsData = arrEventRel; //response.data;
          this.totalItems = response.count;
        },
        error: () => (this.loading = false),
      });
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
    this.relatedEventsColumns = this.relatedEventsData;
    this.totalItems = this.relatedEventsColumns.length;
    this.hideFilters();
  }

  getSearch() {
    this.loading = true;
    console.log(this.params.getValue());
    this.loading = false;
  }

  hideFilters() {
    setTimeout(() => {
      let filterArray = document.getElementsByClassName('ng2-smart-filters');
      this.filterRow = filterArray.item(0);
      this.filterRow.classList.add('d-none');
      this.addOption = document
        .getElementsByClassName('ng2-smart-action-add-add')
        .item(0);
    }, 200);
  }

  addRow() {
    this.adding = true;
    this.addOption.click();
    setTimeout(() => {
      this.addRowElement = document
        .querySelectorAll('tr[ng2-st-thead-form-row]')
        .item(0);
      this.addRowElement.classList.add('row-no-pad');
      this.addRowElement.classList.add('add-row-height');
      this.cancelBtn = document.querySelectorAll('.cancel').item(0);
      this.cancelEvent = this.handleCancel.bind(this);
      this.readOnlyInput = document
        .querySelectorAll('input[ng-reflect-name="process"]')
        .item(0);
      this.readOnlyInput.setAttribute('readonly', '');
      this.readOnlyInput = document
        .querySelectorAll('input[ng-reflect-name="status"]')
        .item(0);
      this.readOnlyInput.setAttribute('readonly', '');
      this.cancelBtn.addEventListener('click', this.cancelEvent);
    }, 300);
  }

  handleCancel() {
    this.adding = false;
    this.cancelBtn = document.querySelectorAll('.cancel').item(0);
    this.cancelBtn.removeEventListener('click', this.cancelEvent);
  }

  alertTable() {
    this.onLoadToast(
      'error',
      'Evento faltante',
      'Seleccione un evento para continuar'
    );
  }

  addEntry(event: any) {
    let { newData, confirm } = event;
    console.log(newData);
    if (!newData.id || newData.id == undefined) {
      this.alertTable();
      return;
    }
    newData.process = newData.id.process;
    newData.status = newData.id.status;
    newData.id = newData.id.id;
    // Llamar servicio para agregar registro
    confirm.resolve(newData);
    this.adding = false;
    this.totalItems += 1;
  }

  editEntry(event: any) {
    let { newData, confirm } = event;
    if (!newData.id || newData.id == undefined) {
      this.alertTable();
      return;
    }
    newData.process = newData.id.process;
    newData.status = newData.id.status;
    newData.id = newData.id.id;
    // Llamar servicio para eliminar
    confirm.resolve(newData);
  }

  deleteEntry(event: any) {
    let { confirm } = event;
    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar el registro?',
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        // Llamar servicio para eliminar
        confirm.resolve(event.newData);
        this.totalItems -= 1;
      }
    });
  }
}
