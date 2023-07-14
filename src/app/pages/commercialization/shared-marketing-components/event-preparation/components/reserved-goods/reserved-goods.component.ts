import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { BasePage } from 'src/app/core/shared';
import { EventFormVisualProperties } from '../../utils/classes/comer-event-properties';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';

@Component({
  selector: 'reserved-goods',
  templateUrl: './reserved-goods.component.html',
  styles: [],
})
export class ReservedGoodsComponent extends BasePage implements OnInit {
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() loggedUser: TokenInfoModel;
  @Input() parameters: IEventPreparationParameters;
  @Input() eventFormVisual = new EventFormVisualProperties();
  get controls() {
    return this.eventForm.controls;
  }
  constructor() {
    super();
  }

  ngOnInit(): void {}

  loadGoodsFromGoodsTracker() {
    const { id } = this.controls;
    if (!id.value) {
      this.alert(
        'error',
        'Error',
        'Necesita capturar el evento antes de incorporar bienes'
      );
      return;
    }
  }
}
