import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { inputSelect } from '../interfaces/input-select';
import { COLUMNS_CAPTURE_EVENTS } from './columns-capture-events';

@Component({
  selector: 'app-event-capture',
  templateUrl: './event-capture.component.html',
  styles: [],
})
export class EventCaptureComponent extends BasePage implements OnInit {
  form: FormGroup;
  formSiab: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data = EXAMPLE_DATA;
  eventTypeOptions: inputSelect[] = [
    { id: 0, name: 'Entrega - Destrucción' },
    { id: 1, name: 'Entrega - Devolución' },
    { id: 2, name: 'Entrega - Donación' },
    { id: 3, name: 'Entrega - Comercialización' },
    { id: 4, name: 'Oficialía de Partes' },
  ];
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS_CAPTURE_EVENTS },
    };
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      typeEvent: [null, []],
      captureDate: [null, []],
      responsible: [null, []],
      prog: [null, []],
      transference: [null, [Validators.pattern(STRING_PATTERN)]],
      type: [null, []],
      area: [null, [Validators.pattern(STRING_PATTERN)]],
      user: [null, [Validators.pattern(STRING_PATTERN)]],
      folio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      date: [null, []],
    });

    this.formSiab = this.fb.group({
      dateSiab: [null, []],
      proceedings: [null, [Validators.pattern(STRING_PATTERN)]],
      delegation: [null, [Validators.pattern(STRING_PATTERN)]],
      transferenceSiab: [null, [Validators.pattern(STRING_PATTERN)]],
      transmitter: [null, [Validators.pattern(STRING_PATTERN)]],
      authority: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  onSubmit() {}

  onSubmit2() {}

  search() {}

  settingsChange($event: any): void {
    this.settings = $event;
  }
}

const EXAMPLE_DATA = [
  {
    ref: 1,
    destructionOpinion: 'DCO/DECR',
    good: 12454,
    status: 'AXD',
    process: 'Transferent',
    descriptionGood: 'Ropa Usada',
    typeGood: 'Inmueble',
    proceedings: 353950,
    quantity: 20,
    deliveryActDate: '20/10/2021',
    dateActCompletion: '20/11/2021',
    destinationIndicator: 'Destrucción',
    select: false,
  },
];
