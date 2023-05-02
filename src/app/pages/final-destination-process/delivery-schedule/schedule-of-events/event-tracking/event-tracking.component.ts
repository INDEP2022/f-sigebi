import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { inputSelect } from '../interfaces/input-select';
import { MAIN_COLUMNS } from '../main-columns';

@Component({
  selector: 'app-event-tracking',
  templateUrl: './event-tracking.component.html',
  styles: [],
})
export class EventTrackingComponent extends BasePage implements OnInit {
  form: FormGroup;
  response: boolean = false;
  data = EXAMPLE_DATA;
  eventTypeOptions: inputSelect[] = [
    { id: 0, name: 'Entrega-Devolución' },
    { id: 1, name: 'Entrega-Donación' },
    { id: 2, name: 'Entrega-Comercialización' },
    { id: 3, name: 'Entrega-Destrucción' },
  ];

  statusEvent: inputSelect[] = [
    { id: 0, name: 'Abierto' },
    { id: 1, name: 'Cerrado' },
    { id: 2, name: 'Todos' },
  ];

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...MAIN_COLUMNS },
    };
  }
  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {}

  initForm() {
    this.form = this.fb.group({
      typeEvent: [null, []],
      date: [null, []],
      status: [null, []],
      regionalCoord: [null, [Validators.pattern(STRING_PATTERN)]],
      typeUser: [null, []],
      sheduling: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  search() {
    this.response = !this.response;
  }
}

const EXAMPLE_DATA = [
  {
    schedule: 'A/E/PGR/DRP',
    dateCapture: '25/03/2021',
    entry: 'JRUIZG',
    status: 'CERRADA',
  },
  {
    schedule: 'A/E/PGR/DRP',
    dateCapture: '25/03/2021',
    entry: 'JRUIZG',
    status: 'CERRADA',
  },
  {
    schedule: 'A/E/PGR/DRP',
    dateCapture: '25/03/2021',
    entry: 'JRUIZG',
    status: 'ABIERTA',
  },
  {
    schedule: 'A/E/PGR/DRP',
    dateCapture: '25/03/2021',
    entry: 'JRUIZG',
    status: 'ABIERTA',
  },
];
