import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { catchError, map, of, take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/conv-numerary.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { BasePage } from 'src/app/core/shared';

import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { COLUMNS } from '../numeraire-conversion-auctions/columns';
import { ComerieventosService } from '../services/comerieventos.service';
import { ComermeventosService } from '../services/comermeventos.service';

@Component({
  selector: 'app-numeraire-conversion-allotments',
  templateUrl: './numeraire-conversion-allotments.component.html',
  styles: [],
})
export class NumeraireConversionAllotmentsComponent
  extends BasePage
  implements OnInit
{
  @Input() address: string;
  selectedEvent: IComerEvent = null;
  nameEvent = '';
  ilikeFilters = ['observations', 'processKey', 'statusVtaId', 'place', 'user'];
  dateFilters = ['eventDate', 'failureDate'];
  eventColumns = { ...COLUMNS };
  user: any;
  selectNewEvent: IComerEvent;
  constructor(
    private fb: FormBuilder,
    private convNumeraryService: ConvNumeraryService,
    private comertpEventService: ComerTpEventosService,
    private eventMService: ComermeventosService,
    private eventIService: ComerieventosService,
    private eventDataService: ComerEventosService,
    private authService: AuthService
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

  private convierteBody() {
    this.loader.load = true;
    this.convNumeraryService
      .PA_CONVNUMERARIO_ADJUDIR({
        pevent: this.selectedEvent.id,
        pscreen: 'FCOMER087',
        pdirectionScreen: this.address,
        user: this.user.preferred_username,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          let params = new FilterParams();
          params.addFilter('id', this.selectedEvent.id);
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
                  this.selectNewEvent = response[0];
                  this.alert(
                    'success',
                    'Proceso convierte adjudicación directa terminado',
                    ''
                  );
                } else {
                  this.alert(
                    'error',
                    'Ocurrio un error al actualizar el evento',
                    'Favor de verificar'
                  );
                }
              },
              error: err => {
                this.alert(
                  'error',
                  'Ocurrio un error al actualizar el evento',
                  'Favor de verificar'
                );
              },
            });

          this.loader.load = false;
        },
        error: err => {
          console.log(err);
          this.loader.load = false;
          this.alert(
            'error',
            'Ocurrio un error al convertir numerario',
            'Favor de verificar'
          );
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
