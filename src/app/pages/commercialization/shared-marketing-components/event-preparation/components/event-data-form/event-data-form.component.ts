import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { addDays, addYears, format, startOfYear } from 'date-fns';
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
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { UserTpeeventsService } from 'src/app/core/services/ms-user-events/user-tpeevents.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
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
  @Input() isOpenEvent = false;
  ivaMod = new DefaultSelect();
  readonly minEventDate = new Date('2000-01-01');
  readonly maxEventDate = new Date(addYears(startOfYear(new Date()), 5));
  @Output() onSuccessApply = new EventEmitter<void>();
  viewApplyButton = true;
  get controls() {
    return this.eventForm.controls;
  }
  constructor(
    private comerTpEventosService: ComerTpEventosService,
    private thirdPartyService: ThirdPartyService,
    private parametersModService: ParametersModService,
    private segAccessXAreas: SegAcessXAreasService,
    private comerEventsService: ComerEventService,
    private lotService: LotService,
    private eventAppService: EventAppService,
    private userTpeeventsService: UserTpeeventsService
  ) {
    super();
  }

  setInmovableValidators() {
    const { eventDate } = this.controls;
    eventDate.addValidators(Validators.required);
  }

  ngOnInit(): void {
    this.parameters.pDirection == 'M'
      ? this.getMovableSelect()
      : this.getInmovableSelect();
    this.getThirds().subscribe();

    this.eventTypeChange().subscribe();
  }

  getMovableSelect() {
    this.getEventTypes().subscribe();
    this.getParametersMod().subscribe();
  }

  getInmovableSelect() {
    this.setInmovableValidators();
    this.getEventTypesI().subscribe();
    this.getParametersMod().subscribe();
    this.getParametersModIva().subscribe();
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
          this.eventTypes = new DefaultSelect([], 0);
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
    params.limit = 100;
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

  getParametersModIva() {
    const params = new FilterParams();
    params.addFilter('parameter', 'APLICA_IVA_EVENTO');
    params.addFilter('address', this.parameters.pDirection);
    return this.parametersModService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.ivaMod = new DefaultSelect();
        return throwError(() => error);
      }),
      tap(response => {
        this.ivaMod = new DefaultSelect(response.data, response.count);
      })
    );
  }

  eventTypeChange() {
    const { eventTpId } = this.controls;
    return eventTpId.valueChanges.pipe(
      takeUntil(this.$unSubscribe),
      tap(async eventType => {
        if (!eventType) {
          return;
        }
        if (this.parameters.pDirection == 'M') {
          this.onEventTypeMChange(eventType);
        }

        if (this.parameters.pDirection == 'I') {
          await this.onEventTypeIChange(eventType);
        }
      })
    );
  }

  onEventTypeMChange(eventType: string | number) {
    this.eventFormVisual.eventDate = !(eventType == 7 || eventType == 6);
    this.eventFormVisual.failureDate = !(eventType == 7 || eventType == 6);
    this.eventFormVisual.thirdId = !(eventType == 7 || eventType == 6);
  }

  async onEventTypeIChange(eventType: string | number) {
    const { eventTpId } = this.controls;
    const permission = await this.eventTypePermission(eventType);
    if (!permission) {
      this.alert(
        'error',
        'Error',
        'No tienes permisos para este tipo de evento'
      );
      eventTpId.reset();
      return;
    }
    this.eventFormVisual.eventClosingDate = !(eventType == 7 || eventType == 6);
    this.eventFormVisual.failureDate = !(eventType == 7 || eventType == 6);
  }

  async eventTypePermission(idTpevent: string | number) {
    const username = this.loggedUser.preferred_username;
    return await firstValueFrom(
      this.userTpeeventsService
        .getByEventTypeAndUser({ username, idTpevent })
        .pipe(
          catchError(() => of(false)),
          map(() => true)
        )
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
      this.eventForm.markAllAsTouched();
      this.alert('error', 'Error', 'Formulario inválido');
      return;
    }
    const { tpsolavalId, eventTpId, statusVtaId, address } = this.controls;
    const { month, year, user, delegationNumber } = this.controls;
    if (this.parameters.pDirection == 'M') {
      this.preInsertMEvent();
    }
    if (
      this.parameters.pDirection == 'I' &&
      !(await this.validatePreInsertIEvent())
    ) {
      return;
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

  preInsertMEvent() {
    const { tpsolavalId, eventTpId } = this.controls;
    if (!tpsolavalId.value && eventTpId.value == 10) {
      tpsolavalId.setValue(2);
    }
  }

  async validatePreInsertIEvent() {
    const { eventTpId, eventDate, tpsolavalId } = this.controls;
    const eventTypeDisp = await this.getEventTypeDispById(eventTpId.value);
    const use = await this.getEventTypeUseCount(eventTpId.value);
    const eventYear = eventDate.value.getFullYear();
    const currentYear = new Date().getFullYear();
    if (eventYear < currentYear - 1) {
      this.alert(
        'error',
        'Error',
        `La Fecha del Evento no puede ser anterior al año ${currentYear - 1}`
      );
      return false;
    }
    if (eventYear > currentYear + 5) {
      this.alert(
        'error',
        'Error',
        'La Fecha del Evento no puede ser mayor a 5 años'
      );

      return false;
    }

    if (eventTypeDisp) {
      if (!this.isValidEventDisp(use)) {
        return false;
      }
    }

    if (!tpsolavalId.value && eventTpId.value == 10) {
      this.alert('error', 'Error', 'Deberá seleccionar la solicitud de Avaluo');
      return false;
    }

    return true;
  }

  isValidEventDisp(use: number) {
    const { eventDate, eventClosingDate, failureDate, vatApplies } =
      this.controls;
    if (!eventClosingDate.value) {
      this.alert('error', 'Error', 'Debe especificar la Fecha de Cierre');
      return false;
    }
    if (eventClosingDate.value < eventDate.value) {
      this.alert(
        'error',
        'Error',
        'La Fecha de Cierre no puede menor o igual a la Fecha del Evento'
      );
      return false;
    }
    if (!failureDate.value) {
      this.alert('error', 'Error', 'Debe especificar la Fecha de Fallo');
      return false;
    }

    if (failureDate.value < eventClosingDate.value) {
      this.alert(
        'error',
        'Error',
        'La Fecha de Fallo no pueder menor a la Fecha de Cierre'
      );
      return false;
    }
    const IVA_ERROR = 'La aplicación de IVA debe ser definida';
    if ((vatApplies.value == 2 || !vatApplies.value) && use != 0) {
      this.alert('error', 'Error', IVA_ERROR);
      return false;
    }
    return true;
  }

  async getEventTypeUseCount(eventTypeId: string | number) {
    const params = new FilterParams();
    params.addFilter('id', eventTypeId);
    params.addFilter('use', 3);
    return await firstValueFrom(
      this.comerTpEventosService.getAllComerTpEvent(params.getParams()).pipe(
        catchError(() => of({ count: 0 })),
        map(res => res.count)
      )
    );
  }

  async getEventTypeDispById(eventTypeId: string | number) {
    const params = new FilterParams();
    params.addFilter('id', eventTypeId);
    return await firstValueFrom(
      this.comerTpEventosService.getAllComerTpEvent(params.getParams()).pipe(
        catchError(() => of(null)),
        map(res => res.data[0]?.typeDispId ?? null)
      )
    );
  }

  /**
   * BLK_EVENTO.PRE-UPDATE
   */
  async preUpdateEvent() {
    // TIPO DE EVENTO COMER NO VALIDA NAD
    if (this.parameters.pDirection == 'I') {
      if (!(await this.validatePreInsertIEvent())) {
        return;
      }
    }
    this.updateEvent().subscribe();
  }

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
        this.alert('error', 'Error', 'Ocurrió un Error al Guardar el Evento');
        return throwError(() => error);
      })
    );
  }

  updateEvent() {
    this.loading = true;
    const { id } = this.controls;
    return this.comerEventsService
      .updateComerEvent(id.value, this.eventForm.value)
      .pipe(
        catchError(error => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ocurrió un Error al Actualizar el Evento'
          );
          return throwError(() => error);
        }),
        tap(event => {
          this.alert('success', 'El Evento ha sido Guardado', '');
          this.loading = false;
        })
      );
  }

  eventDateChange(_eventDate: Date) {
    if (this.parameters.pDirection == 'I') {
      return;
    }
    const { eventDate, failureDate } = this.controls;
    if (!_eventDate) {
      failureDate.reset();
      return;
    }
    const eventYear = _eventDate.getFullYear();
    const currentYear = new Date().getFullYear();
    if (eventYear < 2000) {
      this.alert(
        'error',
        'Error',
        'La fecha no puede ser anterior al año 2000'
      );
      eventDate.reset();
      return;
    }
    if (eventYear > currentYear + 5) {
      this.alert('error', 'Error', 'La fecha no puede ser mayor a 5 años');
      eventDate.reset();
      return;
    }
    failureDate.setValue(addDays(_eventDate, 3));
  }

  failureDateChange(failDate: Date) {
    const { eventTpId } = this.controls;
    if (this.parameters.pDirection == 'I') {
      return;
    }
    if (!failDate) {
      return;
    }
    const { eventDate, failureDate } = this.controls;
    if (
      failDate <= eventDate.value &&
      ![6, 7].includes(parseInt(eventTpId.value.toString()))
    ) {
      failureDate.reset();
      this.alert(
        'warning',
        'Verificar fecha',
        'La fecha de fallo no puede menor o igual a la fecha del evento XD'
      );
      return;
    }
  }

  closingDateChange() {
    const { eventTpId } = this.controls;

    if (this.parameters.pDirection == 'I') {
      return;
    }
    const { eventDate, failureDate, eventClosingDate } = this.controls;
    if (!eventClosingDate.value) {
      return;
    }

    if (
      failureDate.value <= eventDate.value &&
      ![6, 7].includes(parseInt(eventTpId.value.toString()))
    ) {
      this.alert(
        'warning',
        'Verificar fecha',
        'La fecha de fallo no puede menor o igual a la fecha del evento'
      );
      failureDate.reset();
      return;
    }
  }

  onApply() {
    let valid = this.consignment();
    const { baseCost } = this.controls;
    if (!valid) {
      this.alert('error', 'Error', 'Este evento no tiene esta funcionalidad');
      return;
    }

    if (baseCost.value <= 0) {
      this.alert('error', 'Error', 'Debe especificar el costo de las bases');
      return;
    }

    if (!this.isOpenEvent) {
      this.alert(
        'error',
        'Error',
        'Necesita abrir un evento para generar las referencia para las bases'
      );
      return;
    }
    this.applyCost().subscribe();
  }

  applyCost() {
    const { baseCost, id } = this.controls;
    const body = {
      cotobase: baseCost.value,
      lotId: 1, // ! Ni se deberia de enviar xd
      eventId: id.value,
    };
    return this.lotService.applyBaseCost(body).pipe(
      catchError(error => {
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(() => {
        this.alert('success', 'Proceso Completado', '');
        this.onSuccessApply.emit();
      })
    );
  }

  consignment() {
    const { eventTpId } = this.controls;
    return !(eventTpId.value == 6);
  }

  // * ---------------- FCOMEREVENTOS_I
  getEventTypesI() {
    const params = new FilterParams();
    params.limit = 100;
    return this.eventAppService
      .rgEventsI(this.loggedUser.preferred_username)
      .pipe(
        catchError(error => {
          this.eventTypes = new DefaultSelect([], 0);
          return throwError(() => error);
        }),
        map(response => {
          const data = response.data.map(eventTp => {
            return {
              id: eventTp.id_tpevento,
              description: eventTp.descripcion,
            };
          });
          return { ...response, data };
        }),
        tap(response => {
          this.eventTypes = new DefaultSelect(response.data, response.count);
        })
      );
  }
}
