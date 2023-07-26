import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { BasePage } from 'src/app/core/shared';
import { ComerEventForm } from '../../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../../utils/interfaces/event-preparation-parameters';

@Component({
  selector: 'consigments-container',
  templateUrl: './consigments-container.component.html',
  styles: [],
})
export class ConsigmentsContainerComponent
  extends BasePage
  implements OnInit, OnChanges
{
  title: string = '';
  @Input() preparation: boolean;
  @Output() exit = new EventEmitter<void>();
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  eventSelected: IComerEvent = null;
  lotSelected: IComerLot = null;
  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['preparation']) {
      this.title = this.preparation
        ? 'Evento de Preparación'
        : 'Evento de Remesas';
    }
  }

  ngOnInit(): void {}

  goBack() {
    this.exit.emit();
  }
}
