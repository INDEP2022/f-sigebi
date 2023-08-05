import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { EventPreparationService } from '../../event-preparation.service';
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
  constructor(
    private globalVarsService: GlobalVarsService,
    private eventPreparationService: EventPreparationService,
    private router: Router
  ) {
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

    this.loadFromGoodsTracker();
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
      eventForm: this.eventForm,
      lastLot: -1,
      lastPublicLot: 1,
      executionType: 'normal',
    });

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FCOMEREVENTOS',
      },
    });
  }
}
