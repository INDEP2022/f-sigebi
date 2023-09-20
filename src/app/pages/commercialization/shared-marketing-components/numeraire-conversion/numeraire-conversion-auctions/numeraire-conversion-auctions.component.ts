import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, of, take } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/conv-numerary.service';
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
  disabledParcial = false;
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
    private eventIService: ComerieventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
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
      this.disabledParcial = false;
      const filterParams = new FilterParams();
      filterParams.addFilter('idStatusVta', 'GARA');
      filterParams.addFilter('idEvent', event.id);
      this.lotService
        .getAll(filterParams.getParams())
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response && response.data && response.data.length === 0) {
              this.disabledParcial = true;
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
            this.alert('success', 'Proceso Cálculo terminado', '');
          },
          error: err => {
            console.log(err);
            this.loader.load = false;
            this.alert('error', 'Proceso Cálculo', err.error.message);
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
        this.alert('error', 'Proceso Cálculo Parcial', resultBorra.message);
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
        this.alert('error', 'Proceso Cálculo Parcial', resultParcial.message);
        this.loader.load = false;
        return;
      }

      this.loader.load = false;
      this.reloadExpenses++;
      this.alert('success', 'Proceso Cálculo Parcial terminado', '');
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
        .convert({ idEvent: this.selectedEvent.id, screen: 'FCOMER087' })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.reloadExpenses++;
            this.loader.load = false;
            this.alert('success', 'Proceso Convierte terminado', '');
          },
          error: err => {
            console.log(err);
            this.loader.load = false;
            this.alert('error', 'Proceso Convierte', err.error.message);
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
          idEvent: this.selectedEvent.id,
          pScreen: 'FCOMER087',
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.reloadExpenses++;
            this.alert('success', 'Proceso Convierte Parcial terminado', '');
          },
          error: err => {
            console.log(err);
            this.loader.load = false;
            this.alert('error', 'Proceso Convierte Parcial', err.error.message);
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
