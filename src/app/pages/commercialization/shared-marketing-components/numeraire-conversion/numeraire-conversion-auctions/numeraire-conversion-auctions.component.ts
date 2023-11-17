import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, take } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/conv-numerary.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
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
  reloadExpenses = 0;
  form: FormGroup = new FormGroup({});
  selectedExpenseData: IFillExpenseDataCombined;
  nameEvent = '';
  showParcial = true;
  ilikeFilters = ['observations', 'processKey', 'statusVtaId', 'place', 'user'];
  dateFilters = ['eventDate', 'failureDate'];
  eventColumns = { ...COLUMNS };
  constructor(
    private fb: FormBuilder,
    private convNumeraryService: ConvNumeraryService,
    private comertpEventService: ComerTpEventosService,
    private lotService: LotService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private numerarieService: NumerarieService,
    private eventMService: ComermeventosService,
    private eventIService: ComerieventosService,
    private eventDataService: ComerEventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      if (changes['address'].currentValue === 'M') {
        this.showParcial = false;
      } else {
        this.showParcial = true;
      }
    }
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

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      // cveEvent: ['', [Validators.required]],
      // nameEvent: ['', [Validators.required]],
      // obsEvent: ['', [Validators.required]],
      // place: ['', [Validators.required]],
      // eventDate: ['', [Validators.required]],
      // failureDate: ['', [Validators.required]],
    });
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

  selectEvent(event: IComerEvent) {
    console.log(event);
    this.selectedExpenseData = null;
    this.nameEvent = '';
    this.reloadExpenses++;
    this.selectedEvent = {
      ...event,
      failureDate: secondFormatDateTofirstFormatDate(event.failureDate),
      eventDate: secondFormatDateTofirstFormatDate(event.eventDate as string),
    };
    this.numerarieService.selectedEventSubject.next(this.selectedEvent);
    const filterParams = new FilterParams();
    filterParams.addFilter('id', event.eventTpId);
    this.comertpEventService
      .getAllComerTpEvent(filterParams.getParams())
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response && response.data) {
            this.nameEvent = response.data[0].description;
          }
        },
      });
    this.validateParcialButtons(event);
  }

  validateParcialButtons(event: IComerEvent) {
    if (this.address === 'I') {
      this.showParcial = true;
      const filterParams = new FilterParams();
      filterParams.addFilter('idStatusVta', 'GARA');
      filterParams.addFilter('idEvent', event.id);
      this.lotService
        .getAll(filterParams.getParams())
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response && response.data && response.data.length === 0) {
              this.showParcial = false;
            }
          },
        });
    }
  }

  calcula() {
    if (this.selectedEvent.statusVtaId !== 'CNE') {
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
              'Favor de verificar'
            );
          },
        });
    } else {
      this.alert(
        'warning',
        'Este evento ya fue convertido a numerario, no se puede volver a procesar',
        ''
      );
    }
  }

  async calculaParc() {
    if (this.selectedEvent.statusVtaId === 'VEN') {
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
    } else {
      this.alert(
        'warning',
        'Solo el estatus del evento VEN es válido para procesar',
        ''
      );
    }
  }

  convierte() {
    if (this.selectedEvent.statusVtaId !== 'CNE') {
      this.loader.load = true;
      this.convNumeraryService
        .convert({ pevent: this.selectedEvent.id, pscreen: 'FCOMER087' })
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
                    this.selectEvent(response[0]);
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
              'Favor de verificar'
            );
          },
        });
    } else {
      this.alert(
        'warning',
        'Este evento ya fue convertido a numerario, no se puede volver a procesar',
        ''
      );
    }
  }

  convierteParcial() {
    if (this.selectedEvent.statusVtaId === 'VEN') {
      this.loader.load = true;
      this.convNumeraryService
        .SP_CONVERSION_ASEG_PARCIAL({
          pevent: this.selectedEvent.id,
          pscreen: 'FCOMER087',
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
              'Favor de verificar'
            );
          },
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
    let params = {
      DESTYPE: 'SCREEN',
      PARAMFORM: 'NO',
      PEVENTO: this.selectedEvent.id,
      PCVEPROCESO: this.selectedEvent.processKey,
    };
    this.siabService.fetchReport('RCOMER_NUMERARIO', params).subscribe({
      next: response => {
        this.loading = false;
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
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
