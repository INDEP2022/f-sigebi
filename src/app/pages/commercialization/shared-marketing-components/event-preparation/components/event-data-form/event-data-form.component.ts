import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { format } from 'date-fns';
import {
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EventFormVisualProperties } from '../../utils/classes/comer-event-properties';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';
@Component({
  selector: 'event-data-form',
  templateUrl: './event-data-form.component.html',
  styles: [],
})
export class EventDataFormComponent extends BasePage implements OnInit {
  @Input() eventForm: FormGroup<ComerEventForm>;
  eventTypes = new DefaultSelect();
  thirds = new DefaultSelect();
  modParameters = new DefaultSelect();
  isConsignment = false;
  @Input() loggedUser: TokenInfoModel;
  @Input() parameters: IEventPreparationParameters;
  @Input() loadFromGoodsTracker = false;
  @Output() onLoadFromGoodsTracker = new EventEmitter<void>();
  @Input() eventFormVisual = new EventFormVisualProperties();
  get controls() {
    return this.eventForm.controls;
  }
  constructor(
    private comerTpEventosService: ComerTpEventosService,
    private thirdPartyService: ThirdPartyService,
    private parametersModService: ParametersModService,
    private segAccessXAreas: SegAcessXAreasService,
    private comerEventsService: ComerEventService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getEventTypes().subscribe();
    this.getThirds().subscribe();
    this.getParametersMod().subscribe();
    this.eventTypeChange().subscribe();
  }

  getEventTypes() {
    const params = new FilterParams();
    params.limit = 100;
    // ? Si se filtra con el null no aparecen los mismos registros
    // params.addFilter('use', SearchFilter.NULL, SearchFilter.NULL);
    return this.comerTpEventosService
      .getAllComerTpEvent(params.getParams())
      .pipe(
        catchError(error => {
          this.eventTypes = new DefaultSelect();
          return throwError(() => error);
        }),
        tap(response => {
          this.eventTypes = new DefaultSelect(response.data, response.count);
        })
      );
  }

  getThirds() {
    const params = new FilterParams();
    params.limit = 100;
    return this.thirdPartyService.getAll(params.getParams()).pipe(
      catchError(error => {
        this.thirds = new DefaultSelect();
        return throwError(() => error);
      }),
      tap(response => {
        this.thirds = new DefaultSelect(response.data, response.count);
      })
    );
  }

  getParametersMod() {
    const params = new FilterParams();
    params.addFilter('parameter', 'TP_SOL_AVAL');
    params.addFilter('address', this.parameters.pDirection);
    params.addFilter('value', 2);
    return this.parametersModService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.modParameters = new DefaultSelect();
        return throwError(() => error);
      }),
      tap(response => {
        this.modParameters = new DefaultSelect(response.data, response.count);
      })
    );
  }

  eventTypeChange() {
    const { eventTpId } = this.controls;
    return eventTpId.valueChanges.pipe(
      takeUntil(this.$unSubscribe),
      tap(eventType => {
        this.eventFormVisual.eventDate = !(eventType == 7 || eventType == 6);
        this.eventFormVisual.failureDate = !(eventType == 7 || eventType == 6);
        this.eventFormVisual.thirdId = !(eventType == 7 || eventType == 6);
        // }
      })
    );
  }

  getUserDelegation() {
    return firstValueFrom(
      this.segAccessXAreas
        .getDelegationUser(this.loggedUser.preferred_username)
        .pipe(
          catchError(() => of('0')),
          map(res => res.no_delegacion)
        )
    );
  }

  async onSaveEvent() {
    const { id } = this.controls;
    if (!id.value) {
      await this.preInsertEvent();

      return;
    }
    await this.preUpdateEvent();
  }

  /**
   * BLK_EVENTO.PRE-INSERT
   */
  async preInsertEvent() {
    if (!this.eventForm.valid) {
      this.alert('error', 'Error', 'Formulario inválido');
      return;
    }
    const { tpsolavalId, eventTpId, statusVtaId, address } = this.controls;
    const { month, year, user, delegationNumber } = this.controls;
    if (!tpsolavalId.value && eventTpId.value == 10) {
      tpsolavalId.setValue(2);
    }
    statusVtaId.setValue('PREP');
    address.setValue(this.parameters.pDirection);
    const today = new Date();
    month.setValue(format(today, 'MM'));
    year.setValue(format(today, 'yyyy'));
    user.setValue(this.loggedUser.preferred_username);
    const delegation = await this.getUserDelegation();
    delegationNumber.setValue(delegation);
    this.createEvent().subscribe();
  }

  /**
   * BLK_EVENTO.PRE-UPDATE
   */
  async preUpdateEvent() {}

  createEvent() {
    this.loading = true;
    return this.comerEventsService.createEvent(this.eventForm.value).pipe(
      tap(event => {
        this.loading = false;
        this.alert('success', 'El Evento ha sido Guardado', '');
        this.eventForm.patchValue({
          ...event,
          thirdId: event.thirdId ? `${event.thirdId}` : null,
          eventTpId: event.eventTpId ? `${event.eventTpId}` : null,
          tpsolavalId: event.tpsolavalId ? `${event.tpsolavalId}` : null,
          eventDate: event?.eventDate ? new Date(event?.eventDate) : null,
          eventClosingDate: event?.eventClosingDate
            ? new Date(event?.eventClosingDate)
            : null,
          failureDate: event?.failureDate ? new Date(event?.failureDate) : null,
        });
        console.log(this.eventForm.value);
      }),
      catchError(error => {
        this.loading = false;
        this.alert('error', 'Error', 'Ocurrio un Error al Guardar el Evento');
        return throwError(() => error);
      })
    );
  }
}
