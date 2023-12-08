import { Component, Input } from '@angular/core';
import { catchError, map, of, take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared';
import { ComerieventosService } from '../services/comerieventos.service';
import { ComermeventosService } from '../services/comermeventos.service';

@Component({
  selector: 'app-numeraire-conversion-super',
  template: '',
  styles: [],
})
export class NumeraireConversion extends BasePage {
  @Input() address: string;
  selectNewEvent: IComerEvent;
  ilikeFilters = ['observations', 'processKey', 'statusVtaId', 'place', 'user'];
  dateFilters = ['eventDate', 'failureDate'];
  user: any;
  constructor(
    protected eventMService: ComermeventosService,
    protected eventIService: ComerieventosService,
    protected authService: AuthService,
    protected eventDataService: ComerEventosService
  ) {
    super();
    this.user = this.authService.decodeToken();
  }

  get eventService() {
    return this.address
      ? this.address === 'M'
        ? this.eventMService
        : this.eventIService
      : null;
  }

  protected showErrorEstatus(fail: boolean) {
    this.loader.load = false;
    this.alert('warning', 'No se pudo cambiar el estatus del evento', '');
    if (fail) {
      this.alert('error', 'No se pudo realizar la conversión', '');
    }
  }

  protected updateEventoConv(hizoConversiones: boolean, event: IComerEvent) {
    let params = new FilterParams();
    params.addFilter('id', event.id);
    this.eventDataService
      .getAllEvents(params.getParams())
      .pipe(
        take(1),
        catchError(x => of({ data: [] as IComerEvent[] })),
        map(x => x.data)
      )
      .subscribe({
        next: response => {
          this.loader.load = false;
          if (response && response.length > 0) {
            // this.selectEvent(response[0]);
            this.selectNewEvent = response[0];
            if (hizoConversiones) {
              this.alert('success', 'Conversión realizada correctamente', '');
            } else {
              this.alert('info', 'Conversión realizada', '');
            }
          } else {
            this.alert(
              'error',
              'Ocurrio un error al actualizar el evento',
              'Favor de verificar'
            );
          }
        },
        error: err => {
          this.loader.load = false;
          this.alert('error', 'Evento no encontrado', 'Favor de verificar');
        },
      });
  }
}
