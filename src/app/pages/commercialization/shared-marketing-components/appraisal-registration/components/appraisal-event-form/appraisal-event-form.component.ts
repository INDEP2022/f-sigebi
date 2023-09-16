import { Component, OnInit } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerEventApp } from 'src/app/core/models/ms-parametercomer/comer-event-pq.model';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppraisalRegistrationChild } from '../../classes/appraisal-registration-child';

@Component({
  selector: 'appraisal-event-form',
  templateUrl: './appraisal-event-form.component.html',
  styles: [],
})
export class AppraisalEventFormComponent
  extends AppraisalRegistrationChild
  implements OnInit
{
  documentTypes = new DefaultSelect();
  get controls() {
    return this.comerEventForm.controls;
  }
  constructor(private parameterComerService: ParameterModService) {
    super();
  }

  ngOnInit(): void {}

  onFindComerEvent() {
    const { id_evento } = this.controls;
    if (!id_evento.value) {
      this.comerEventForm.reset();
      this.alert('warning', 'Debe ingresar el No. Evento', '');
      return;
    }
    this.findComerEvent(id_evento.value).subscribe();
  }

  findComerEvent(eventId: string | number) {
    const direction = this.global.direction;
    const cveDisplay = this.screen;
    return this.parameterComerService
      .getComerEvent({
        eventId,
        direction,
        cveDisplay,
      })
      .pipe(
        catchError(error => {
          this.alert('error', 'Ocurrió un error inesperado', '');
          this.searchGoods.next(null);
          return throwError(() => error);
        }),
        tap(comerEvent => this.handleComerEvent(comerEvent))
      );
  }

  handleComerEvent(comerEvent: IComerEventApp) {
    if (!comerEvent?.id_evento) {
      this.searchGoods.next(null);
      this.alert('warning', 'No Existe el Evento', '');
      return;
    }

    const { fec_evento, item_fec_solicitud, id_evento } = comerEvent;
    this.searchGoods.next(id_evento);
    this.comerEventForm.patchValue({
      ...comerEvent,
      fec_evento: fec_evento ? new Date(fec_evento) : null,
      item_fec_solicitud: item_fec_solicitud
        ? new Date(item_fec_solicitud)
        : null,
    });
  }

  cleanForm() {
    this.comerEventForm.reset();
  }

  getDocumentTypes() {
    const params = new FilterParams();
    params.addFilter('parameter', 'TIPO_OFICIO_COMER');
    params.addFilter('value', '1', SearchFilter.NOT);
    params.sortBy = 'value:ASC';
    this.parameterComerService
      .getParamterMod(params.getParams())
      .pipe(
        catchError(error => {
          new DefaultSelect([], 0);
          return throwError(() => error);
        }),
        tap(res => {
          this.documentTypes = new DefaultSelect(res.data, res.count);
        })
      )
      .subscribe();
  }
}
