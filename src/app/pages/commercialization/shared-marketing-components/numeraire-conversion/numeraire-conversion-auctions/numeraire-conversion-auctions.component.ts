import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, take } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/conv-numerary.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { secondFormatDateTofirstFormatDate } from 'src/app/shared/utils/date';
import { ComerieventosService } from '../services/comerieventos.service';
import { ComermeventosService } from '../services/comermeventos.service';
import { NumerarieService } from '../services/numerarie.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-numeraire-conversion-auctions',
  templateUrl: './numeraire-conversion-auctions.component.html',
  styleUrls: ['./numeraire-conversion-auctions.component.scss'],
})
export class NumeraireConversionAuctionsComponent
  extends BasePage
  implements OnInit
{
  @Input() address: string;

  ilikeFilters = ['observations', 'processKey', 'statusVtaId', 'place', 'user'];
  dateFilters = ['eventDate', 'failureDate'];
  eventColumns = { ...COLUMNS };
  user: any;
  selectNewEvent: IComerEvent;
  constructor(
    private convNumeraryService: ConvNumeraryService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private numerarieService: NumerarieService,
    private eventMService: ComermeventosService,
    private eventIService: ComerieventosService,
    private eventDataService: ComerEventosService,
    private authService: AuthService
  ) {
    super();
    this.user = this.authService.decodeToken().preferred_username;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      if (changes['address'].currentValue === 'M') {
        this.showParcial = false;
      } else {
        this.showParcial = true;
      }
    }
  }

  get showParcial() {
    return this.numerarieService.showParcial;
  }

  set showParcial(value) {
    this.numerarieService.showParcial = value;
  }

  get eventService() {
    return this.address
      ? this.address === 'M'
        ? this.eventMService
        : this.eventIService
      : null;
  }

  get updateAllowed() {
    return this.numerarieService.updateAllowed;
  }

  get pathEvent() {
    return (
      'event/api/v1/comer-event?filter.eventTpId=$in:0,1,2,3,4,5&sortBy=id:ASC' +
      (this.address ? '&filter.address=$eq:' + this.address : '')
    );
  }

  get selectedEvent() {
    return this.numerarieService.selectedEvent;
  }

  set selectedEvent(value) {
    this.numerarieService.selectedEvent = value;
  }

  get selectedExpenseData() {
    return this.numerarieService.selectedExpenseData;
  }

  set selectedExpenseData(value) {
    this.numerarieService.selectedExpenseData = value;
  }

  get reloadExpenses() {
    return this.numerarieService.reloadExpenses;
  }

  set reloadExpenses(value) {
    this.numerarieService.reloadExpenses = value;
  }

  private calculaBody() {
    this.loader.load = true;
    this.convNumeraryService
      .getCentralNumera(this.selectedEvent.id)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.reloadExpenses++;
          this.loader.load = false;
          this.alert('success', 'Se ha calculado correctamente', '');
        },
        error: err => {
          console.log(err);
          this.loader.load = false;
          this.alert(
            'error',
            'No se ha podido realizar el cálculo',
            err.error.message
          );
        },
      });
  }

  calcula() {
    if (this.validNormal) {
      this.alertQuestion('question', '¿Desea calcular este evento?', '').then(
        x => {
          if (x.isConfirmed) {
            this.calculaBody();
          }
        }
      );
    } else {
      this.alert(
        'warning',
        'Este evento ya fue convertido a numerario, no se puede volver a procesar',
        ''
      );
    }
  }

  get validParcial() {
    return this.selectedEvent
      ? this.selectedEvent.statusVtaId === 'VEN' &&
          this.numerarieService.validParcial
      : false;
  }

  private async calculaParcBody() {
    this.loader.load = true;
    let resultBorra = await firstValueFrom(
      this.convNumeraryService
        .SPBorraNumera(this.selectedEvent.id)
        .pipe(catchError(x => of(x.error)))
    );
    if (resultBorra.statusCode !== 200) {
      this.alert(
        'error',
        'No se ha podido calcular parcialmente',
        resultBorra.message
      );
      this.loader.load = false;
      return;
    }
    console.log(resultBorra);
    let resultParcial = await firstValueFrom(
      this.convNumeraryService
        .getSPGastosEventoParcial(this.selectedEvent.id)
        .pipe(catchError(x => of(x.error)))
    );
    if (resultParcial.statusCode !== 200) {
      this.alert(
        'error',
        'No se ha podido calcular parcialmente',
        resultParcial.message
      );
      this.loader.load = false;
      return;
    }

    this.loader.load = false;
    this.reloadExpenses++;
    this.alert('success', 'Se ha calculado parcialmente', '');
  }

  async calculaParc() {
    if (this.validParcial) {
      this.alertQuestion(
        'question',
        '¿Desea calcular parcialmente este evento?',
        ''
      ).then(x => {
        if (x.isConfirmed) {
          this.calculaParcBody();
        }
      });
    } else {
      this.alert(
        'warning',
        'Solo el estatus del evento VEN es válido para procesar',
        ''
      );
    }
  }

  resetForm() {
    this.selectedEvent = null;
    this.numerarieService.selectedExpenseData = null;
    this.reloadExpenses++;
  }

  selectEvent(event: IComerEvent) {
    this.selectedExpenseData = null;
    this.reloadExpenses++;
    this.selectedEvent = {
      ...event,
      failureDate: secondFormatDateTofirstFormatDate(event.failureDate),
      eventDate: secondFormatDateTofirstFormatDate(event.eventDate as string),
    };
    this.numerarieService.selectedEventSubject.next(this.selectedEvent);
    this.numerarieService.validateParcialButtons(this.address, event);
  }

  private convierteBody() {
    this.loader.load = true;
    this.convNumeraryService
      .convert({
        pevent: this.selectedEvent.id,
        pscreen: 'FCOMER087',
        user: this.user,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          // this.reloadExpenses++;
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
                  // this.selectEvent(response[0]);
                  this.selectNewEvent = response[0];
                  this.alert('success', 'Se ha convertido correctamente', '');
                } else {
                  this.alert(
                    'error',
                    'Ocurrio un error al actualizar el evento',
                    'Favor de verificar'
                  );
                }
              },
            });
        },
        error: err => {
          console.log(err);
          this.loader.load = false;
          this.alert(
            'error',
            'No se pudo realizar la conversión',
            err.error.message
          );
        },
      });
  }

  get validNormal() {
    return this.selectedEvent
      ? this.selectedEvent.statusVtaId !== 'CNE'
      : false;
  }

  convierte() {
    if (this.validNormal) {
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
        'Este evento ya fue convertido a numerario, no se puede volver a procesar',
        ''
      );
    }
  }

  convierteParcBody() {
    this.loader.load = true;
    this.convNumeraryService
      .SP_CONVERSION_ASEG_PARCIAL({
        pevent: this.selectedEvent.id,
        pscreen: 'FCOMER087',
        user: this.user,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.reloadExpenses++;
          this.loader.load = false;
          this.alert('success', 'Se ha convertido parcialmente', '');
        },
        error: err => {
          console.log(err.error.message);
          this.loader.load = false;
          this.alert(
            'error',
            'No se pudo hacer la conversión parcial',
            err.error.message
          );
        },
      });
  }

  convierteParcial() {
    if (this.validParcial) {
      this.alertQuestion(
        'question',
        '¿Desea convertir parcialmente este evento?',
        ''
      ).then(x => {
        if (x.isConfirmed) {
          this.convierteParcBody();
        }
      });
    } else {
      this.alert(
        'warning',
        'Solo el estatus del evento VEN es válido para procesar',
        ''
      );
    }
  }

  reporte() {
    this.loader.load = true;
    let params = {
      DESTYPE: 'SCREEN',
      PARAMFORM: 'NO',
      PEVENTO: this.selectedEvent.id,
      PCVEPROCESO: this.selectedEvent.processKey,
    };
    this.siabService.fetchReport('RCOMER_NUMERARIO', params).subscribe({
      next: response => {
        console.log(response);
        this.loader.load = false;
        if (response) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          this.alert('error', 'El reporte no se encuentra disponible', '');
        }
      },
      error: err => {
        this.loader.load = false;
        console.log(err);
        this.alert('error', 'El reporte no se encuentra disponible', '');
      },
    });
  }
}
