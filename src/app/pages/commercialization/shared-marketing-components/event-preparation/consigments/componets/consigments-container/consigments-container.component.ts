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
import { catchError, tap, throwError } from 'rxjs';
import { IComerGoodXLot } from 'src/app/common/constants/endpoints/ms-comersale/comer-good-x-lot.model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';
import { BasePage } from 'src/app/core/shared';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
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
  @Output() exit = new EventEmitter<{
    refresh: boolean;
    preparation: boolean;
  }>();
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @Input() parentLot: IComerLot = null;
  eventSelected: IComerEvent = null;
  lotSelected: IComerLot = null;

  get controls() {
    return this.eventForm.controls;
  }
  constructor(
    private utilComerV1Service: UtilComerV1Service,
    private lotService: LotService,
    private eventAppService: EventAppService
  ) {
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
    this.exit.emit({ refresh: false, preparation: this.preparation });
  }

  confirm(goods: IComerGoodXLot[]) {
    if (!this.preparation) {
      this.onAcceptConsigment(goods).subscribe();
    } else {
      this.onAcceptPreparation(goods).subscribe();
    }
  }

  onAcceptPreparation(goods: IComerGoodXLot[]) {
    const { id, eventTpId } = this.controls;
    const blkPrepGood = goods.map(good => this.consigmentItem(good));
    return this.utilComerV1Service
      .acceptPreparation({
        eventId: Number(id.value),
        lotId: Number(this.parentLot.id),
        tpeventId: Number(eventTpId.value),
        blkPrepGood,
      })
      .pipe(
        catchError(error => {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(() => {
          this.exit.emit({ refresh: true, preparation: this.preparation });
        })
      );
  }

  preparationItem(good: IComerGoodXLot) {
    return {
      goodNumber: good.goodNumber,
      statusAnt: good.previousStatus,
      statusComer: good.commercialStatus,
      transferenceNumber: good.transferNumber,
      storeNumber: good.warehouseNumber,
      eventId: good.commercialEventId,
      lotId: good.idLot,
      goodxlotId: good.idGoodInLot,
      obsevations: good.observations,
      camp08: good.field8,
      amount: good.quantity,
      pAddress: this.parameters.pDirection,
      lotPublic: this.lotSelected.publicLot,
    };
  }

  onAcceptConsigment(goods: IComerGoodXLot[]) {
    const { id } = this.controls;
    const blkRemittancesGood = goods.map(good => this.consigmentItem(good));
    return this.utilComerV1Service
      .acceptConsigment({
        eventId: Number(id.value),
        lotId: Number(this.parentLot.id),
        blkRemittancesGood,
      })
      .pipe(
        catchError(error => {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(() => {
          this.exit.emit({ refresh: true, preparation: this.preparation });
        })
      );
  }

  consigmentItem(good: IComerGoodXLot) {
    return {
      goodNumber: good.goodNumber ? Number(good.goodNumber) : null,
      statusAnt: good.previousStatus,
      statusComer: good.commercialStatus,
      transferenceNumber: good.transferNumber ? `${good.transferNumber}` : null,
      storeNumber: good.warehouseNumber ? Number(good.warehouseNumber) : null,
      eventId: good.commercialEventId ? Number(good.commercialEventId) : null,
      lotId: good.idLot ? Number(good.idLot) : null,
      goodxlotId: good.idGoodInLot ? Number(good.idGoodInLot) : null,
      amount: good.quantity,
      // r5: null,
    };
  }
}
