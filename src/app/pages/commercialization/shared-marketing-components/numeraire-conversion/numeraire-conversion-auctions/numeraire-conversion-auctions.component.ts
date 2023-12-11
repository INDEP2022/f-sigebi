import { Component, OnInit, SimpleChanges } from '@angular/core';
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
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { secondFormatDateTofirstFormatDate } from 'src/app/shared/utils/date';
import { NumeraireConversion } from '../models/numeraire-conversion';
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
  extends NumeraireConversion
  implements OnInit
{
  eventColumns = { ...COLUMNS };
  validParcial = true;
  constructor(
    private convNumeraryService: ConvNumeraryService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private lotService: LotService,
    private numerarieService: NumerarieService,
    protected override eventMService: ComermeventosService,
    protected override eventIService: ComerieventosService,
    protected override eventDataService: ComerEventosService,
    protected override authService: AuthService
  ) {
    super(eventMService, eventIService, authService, eventDataService);
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

  get expenses() {
    return this.numerarieService.expenses;
  }

  get showParcial() {
    return this.numerarieService.showParcial;
  }

  set showParcial(value) {
    this.numerarieService.showParcial = value;
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

  get validParcialButton() {
    return this.selectedEvent
      ? this.selectedEvent.statusVtaId === 'VEN' && this.validParcial
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
    if (this.validParcialButton) {
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
    this.validateParcialButtons(this.address, event);
  }

  validateParcialButtons(address: string, event: IComerEvent) {
    if (address === 'I') {
      this.validParcial = true;
      const filterParams = new FilterParams();
      filterParams.addFilter('idStatusVta', 'GARA');
      filterParams.addFilter('idEvent', event.id);
      this.lotService
        .getAll(filterParams.getParams())
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response && response.data && response.data.length === 0) {
              this.validParcial = false;
              this.alert(
                'warning',
                'Botones parciales inhabilitados',
                'Porque no cuenta con lote en estatus GARA'
              );
            }
          },
          error: err => {
            this.validParcial = false;
            this.alert(
              'warning',
              'Botones parciales inhabilitados',
              'Porque no cuenta con lote en estatus GARA'
            );
          },
        });
    }
  }

  private async convierteBody() {
    this.loader.load = true;
    // this.selectedEvent.statusVtaId = 'CNE';
    console.log(this.selectedEvent);
    // this.eventDataService
    //   .update2(this.selectedEvent.id, {
    //     statusVtaId: 'CNE',
    //     eventTpId: +(this.selectedEvent.eventTpId + ''),
    //   })
    //   .pipe(take(1))
    //   .subscribe({
    //     next: response => {
    //       this.updateEventoConv(true, this.selectedEvent);
    //     },
    //     error: err => {
    //       this.showErrorEstatus(true);
    //     },
    //   });
    // return;
    if (this.selectedEvent.address === 'M') {
      this.convNumeraryService
        .convert({
          pevent: this.selectedEvent.id,
          pscreen: 'FCOMER087',
          user: this.user.preferred_username,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            // this.reloadExpenses++;
            this.updateEventoConv(true, this.selectedEvent);
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
    } else if (this.selectedEvent.address === 'I') {
      const count = await firstValueFrom(
        this.convNumeraryService
          .SP_CONVERSION_ASEG_TOTAL(this.selectedEvent.id, 'FCOMER07')
          .pipe(
            catchError(x => of({ processedData: 0 })),
            map(x => x.processedData)
          )
      );
      if (count === 0) {
        this.alert('warning', 'No tiene gastos válidos a convertir', '');
      }
      const v_count_gara = await firstValueFrom(
        this.lotService.getStatusCountGaraByEvent(this.selectedEvent.id).pipe(
          catchError(x => of({ data: [{ count: 0 }] })),
          map(x => x.data[0].count)
        )
      );
      const v_count_numera = await firstValueFrom(
        this.lotService.getStatusCountComerxlots(this.selectedEvent.id).pipe(
          catchError(x => of({ data: [{ count: 0 }] })),
          map(x => x.data[0].count)
        )
      );
      if (v_count_gara === 0 && v_count_numera === 0) {
        // this.selectedEvent.statusVtaId = 'CNE';
        this.eventDataService
          .update2(this.selectedEvent.id, {
            statusVtaId: 'CNE',
            eventTpId: +(this.selectedEvent.eventTpId + ''),
          })
          .pipe(take(1))
          .subscribe({
            next: response => {
              this.updateEventoConv(count > 0, this.selectedEvent);
            },
            error: err => {
              this.showErrorEstatus(count === 0);
            },
          });
      } else {
        this.showErrorEstatus(count === 0);
      }
    }
  }

  get validNormal() {
    return this.selectedEvent
      ? this.selectedEvent.statusVtaId !== 'CNE'
      : false;
  }

  get validNormalConvierte() {
    return this.selectedEvent
      ? this.selectedEvent.statusVtaId !== 'CNE' &&
          (this.selectedEvent.address === 'M' ||
            this.selectedEvent.address === 'I')
      : false;
  }

  convierte() {
    if (this.validNormal) {
      if (
        this.selectedEvent.address === 'M' ||
        this.selectedEvent.address === 'I'
      ) {
        this.alertQuestion(
          'question',
          '¿Desea convertir este evento?',
          ''
        ).then(x => {
          if (x.isConfirmed) {
            this.convierteBody();
          }
        });
      } else {
        this.alert('warning', 'Evento debe ser inmueble o mueble', '');
      }
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
        user: this.user.preferred_username,
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
    if (this.validParcialButton) {
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
