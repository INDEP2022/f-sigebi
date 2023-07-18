import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { EventPreparationService } from '../../event-preparation.service';
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
  constructor(
    private router: Router,
    private eventPreparationService: EventPreparationService,
    private globalVarsService: GlobalVarsService
  ) {
    super();
  }

  ngOnInit(): void {}

  isSomeItemSelected() {
    if (!this.lotSelected) {
      this.alert('error', 'Error', 'Primero Selecciona un Registro');
      return false;
    }
    return true;
  }

  async onLoadFromTracker() {
    // if (!this.isSomeItemSelected()) {
    //   return;
    // }
    const { eventTpId, statusVtaId } = this.controls;
    if (eventTpId.value == 9) {
      this.alert(
        'error',
        'Error',
        'Opción no disponible para este tipo de evento, lotifique desde archivo'
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
    if (
      this.parameters.pValids == 1 &&
      ['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)
    ) {
      await this.loadFromGoodsTracker();
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
  async loadFromGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    const selfState = await this.eventPreparationService.getState();
    this.eventPreparationService.updateState({
      ...selfState,
      lastLot: Number(this.lotSelected.id) ?? -1,
      lastPublicLot: this.lotSelected.publicLot ?? 1,
    });

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FCOMEREVENTOS',
      },
    });
  }
}
