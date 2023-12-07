import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { catchError, firstValueFrom, map, of, take } from 'rxjs';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/conv-numerary.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { secondFormatDateTofirstFormatDate } from 'src/app/shared/utils/date';
import { NumeraireConversion } from '../models/numeraire-conversion';
import { COLUMNS } from '../numeraire-conversion-auctions/columns';
import { ComerieventosService } from '../services/comerieventos.service';
import { ComermeventosService } from '../services/comermeventos.service';

@Component({
  selector: 'app-numeraire-conversion-allotments',
  templateUrl: './numeraire-conversion-allotments.component.html',
  styles: [],
})
export class NumeraireConversionAllotmentsComponent
  extends NumeraireConversion
  implements OnInit
{
  eventColumns = { ...COLUMNS };
  selectedEvent: IComerEvent = null;
  constructor(
    protected override eventMService: ComermeventosService,
    protected override eventIService: ComerieventosService,
    protected override eventDataService: ComerEventosService,
    protected override authService: AuthService,
    private fb: FormBuilder,
    private convNumeraryService: ConvNumeraryService
  ) {
    super(eventMService, eventIService, authService, eventDataService);
  }

  ngOnInit(): void {}

  get pathEvent() {
    return (
      'event/api/v1/comer-event?filter.eventTpId=$eq:3&sortBy=id:ASC' +
      (this.address ? '&filter.address=$eq:' + this.address : '')
    );
  }

  validConvert() {
    return ['VEN', 'CONC'].includes(
      this.selectedEvent ? this.selectedEvent.statusVtaId : null
    );
  }

  selectEvent(event: IComerEvent) {
    this.selectedEvent = {
      ...event,
      failureDate: secondFormatDateTofirstFormatDate(event.failureDate),
      eventDate: secondFormatDateTofirstFormatDate(event.eventDate as string),
    };
  }

  private async convierteBody() {
    this.loader.load = true;
    const hizoConversiones = await firstValueFrom(
      this.convNumeraryService
        .PA_CONVNUMERARIO_ADJUDIR2({
          pevent: this.selectedEvent.id,
          pscreen: 'FCOMER087',
          pdirectionScreen: this.address,
          user: this.user.preferred_username,
        })
        .pipe(
          catchError(x => of({ bandera: false })),
          map(x => x.bandera)
        )
    );
    if (!hizoConversiones) {
      this.alert('warning', 'No tiene gastos válidos a convertir', '');
    }
    this.selectedEvent.statusVtaId = 'CNE';
    this.eventDataService
      .update(this.selectedEvent.id, this.selectedEvent)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.updateEventoConv(hizoConversiones, this.selectedEvent);
        },
        error: err => {
          this.showErrorEstatus(!hizoConversiones);
        },
      });
  }

  convierte() {
    if (this.validConvert()) {
      this.alertQuestion('question', '¿Desea convertir este evento?', '').then(
        x => {
          if (x.isConfirmed) {
            this.convierteBody();
          }
        }
      );
    } else {
      this.alert(
        'warning',
        'Solo el estatus del evento VEN y CONC son válidos para procesar',
        ''
      );
    }
  }
}
