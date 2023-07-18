import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { BasePage } from 'src/app/core/shared';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';

@Component({
  selector: 'event-goods-lots-list-actions',
  templateUrl: './event-goods-lots-list-actions.component.html',
  styles: [],
})
export class EventGoodsLotsListActionsComponent
  extends BasePage
  implements OnInit
{
  @Input() lotSelected: IComerLot;
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  get controls() {
    return this.eventForm.controls;
  }
  constructor() {
    super();
  }

  ngOnInit(): void {}

  validItemSelected() {
    if (!this.lotSelected) {
      this.alert('error', 'Error', 'Primero Selecciona un Registro');
      throw 'No item Selected';
    }
  }

  onLoadFromTracker() {
    this.validItemSelected();
    const { eventTpId, statusVtaId } = this.controls;
    if (eventTpId.value == 9) {
      this.alert(
        'error',
        'Error',
        'Opción no disponible para este tipo de evento,lotifique desde archivo'
      );
      return;
    }

    if (this.lotSelected.publicLot == 0) {
      this.alert(
        'error',
        'Error',
        'El lote cero es exclusivo para el costo de bases del evento'
      );
      return;
    }
    console.log(statusVtaId.value);

    if (
      this.parameters.pValids == 1 &&
      ['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)
    ) {
      this.loadFromGoodsTracker();
      return;
    }
    this.alert(
      'error',
      'Error',
      'Funcion no valida, no tiene permisos, o el evento ya esta vendido o conciliado'
    );
  }

  /**
   * PUP_INC_BIE_RASTREADOR
   */
  loadFromGoodsTracker() {}
}
