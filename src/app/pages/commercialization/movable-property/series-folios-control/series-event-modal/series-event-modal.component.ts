import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { InvoiceFolio } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { ComerEventosXSerieService } from 'src/app/core/services/ms-event/comer-eventosxserie.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-series-event-modal',
  templateUrl: './series-event-modal.component.html',
  styles: [],
})
export class SeriesEventModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  folio: InvoiceFolio;
  title: string = 'Tipo de Evento por Serie';
  edit: boolean = false;
  events: DefaultSelect = new DefaultSelect();

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerEventService: ComerTpEventosService,
    private comerEventXService: ComerEventosXSerieService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idTpevent: [null, Validators.required],
      commentary: [null, Validators.pattern(STRING_PATTERN)],
      idInvoiceFolio: [this.folio.folioinvoiceId, Validators.required],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
      this.form.get('idTpevent').patchValue(this.allotment.idTpevent.id);
    }
  }

  close() {
    this.modalRef.hide();
  }

  async saveData() {
    this.loading = true;
    if (this.edit) {
      this.comerEventXService.update(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true);
          this.alert(
            'success',
            'Tipo de Evento por Serie',
            'Actualizado Correctamente'
          );
        },
        error: () => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ha ocurrido un error al guardar el Tipo de Evento'
          );
        },
      });
    } else {
      this.comerEventXService.create(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true);
          this.alert(
            'success',
            'Tipo de Evento por Serie',
            'Creado Correctamente'
          );
        },
        error: () => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ha ocurrido un error al guardar el Tipo de Evento'
          );
        },
      });
    }
  }

  getEvents(params?: Params) {
    params['filter.id'] = `${SearchFilter.LT}:6`;
    params['sortBy'] = 'id:ASC';
    this.comerEventService.getAllComerTpEvent(params).subscribe({
      next: resp => {
        this.events = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.events = new DefaultSelect();
      },
    });
  }
}
