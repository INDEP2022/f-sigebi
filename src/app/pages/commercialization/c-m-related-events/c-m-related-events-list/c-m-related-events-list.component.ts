import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { TABLE_SETTINGS } from '../../../../common/constants/table-settings';
import { RELATED_EVENTS_COLUMNS } from './related-events-columns';

@Component({
  selector: 'app-c-m-related-events-list',
  templateUrl: './c-m-related-events-list.component.html',
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
export class CMRelatedEventsListComponent extends BasePage implements OnInit {
  eventForm: FormGroup = new FormGroup({});
  eventItems = new DefaultSelect();
  selectedEvent: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  relatedEventsColumns: any[] = [];
  relatedEventsSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  eventTestData = [
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

  relatedEventsTestData = [
    {
      id: 456789,
      process: 'LPBI N° 5/19',
      status: 'EN PREPARACIÓN',
    },
    {
      id: 543210,
      process: 'TEST DATA',
      status: 'EN PREPARACIÓN',
    },
    {
      id: 678912,
      process: 'EVENT TEST DATA',
      status: 'EN PREPARACIÓN',
    },
  ];

  constructor() {
    super();
    this.relatedEventsSettings.columns = RELATED_EVENTS_COLUMNS;
  }

  ngOnInit(): void {
    this.getEvents({ inicio: 1, text: '' });
  }

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.eventTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
    this.relatedEventsColumns = this.relatedEventsTestData;
    this.totalItems = this.relatedEventsColumns.length;
  }
}
