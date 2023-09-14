import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/conv-numerary.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { BasePage } from 'src/app/core/shared';
import { secondFormatDateTofirstFormatDate } from 'src/app/shared/utils/date';

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
  form: FormGroup = new FormGroup({});
  selectedEvent: IComerEvent = null;
  nameEvent = '';
  constructor(
    private fb: FormBuilder,
    private convNumeraryService: ConvNumeraryService,
    private comertpEventService: ComerTpEventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      // cveEvent: ['', [Validators.required]],
      // nameEvent: [
      //   '',
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // obsEvent: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // place: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // eventDate: ['', [Validators.required]],
      // failureDate: ['', [Validators.required]],
    });
  }

  get pathEvent() {
    return (
      'event/api/v1/comer-event?filter.eventTpId=$eq:3&sortBy=id:ASC' +
      (this.address ? '&filter.address=$eq:' + this.address : '')
    );
  }

  selectEvent(event: IComerEvent) {
    console.log(event);
    this.nameEvent = '';
    this.selectedEvent = this.selectedEvent = {
      ...event,
      failureDate: secondFormatDateTofirstFormatDate(event.failureDate),
      eventDate: secondFormatDateTofirstFormatDate(event.eventDate as string),
    };
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
  }

  convierte() {
    if (['VEN', 'CONC'].includes(this.selectedEvent.statusVtaId)) {
      this.convNumeraryService
        .PA_CONVNUMERARIO_ADJUDIR({
          pevent: this.selectedEvent.id,
          pscreen: 'FCOMER087',
          pdirectionScreen: this.address,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Proceso Convierte Adjudicación Directa terminado',
              ''
            );
          },
          error: err => {
            console.log(err);
          },
        });
    } else {
      this.alert(
        'warning',
        'Solo el estatus del evento VEN y CONC son válidos para procesar',
        ''
      );
    }
  }
}
