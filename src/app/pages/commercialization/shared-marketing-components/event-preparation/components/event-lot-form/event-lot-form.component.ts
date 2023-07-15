import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { ComerLotService } from 'src/app/core/services/ms-prepareevent/comer-lot.service';
import { BasePage } from 'src/app/core/shared';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { ComerEventLotForm } from '../../utils/forms/comer-event-lot-form';

@Component({
  selector: 'app-event-lot-form',
  templateUrl: './event-lot-form.component.html',
  styles: [],
})
export class EventLotFormComponent extends BasePage implements OnInit {
  title: string = 'Lote';
  edit: boolean = false;
  lotForm = this.fb.group(new ComerEventLotForm());
  eventForm: FormGroup<ComerEventForm>;
  lot: IComerLot = null;
  callback: (refresh: boolean) => void;
  get controls() {
    return this.lotForm.controls;
  }
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerLotService: ComerLotService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.lot) {
      this.edit = true;
      this.lotForm.patchValue(this.lot as any);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  /**
   * COMER_LOTES.PRE_INSERT
   */
  preInsert() {
    const { eventId, statusVtaId, baseValue } = this.controls;
    eventId.setValue(this.eventForm.controls.id.value);
    statusVtaId.setValue('PREP');
    if (!baseValue.value) {
      baseValue.setValue(0);
    }
  }

  saveLot() {
    this.preInsert();
    this.loading = true;
    return this.comerLotService.create(this.lotForm.value).pipe(
      catchError(error => {
        this.loading = false;
        this.handleError();
        return throwError(() => error);
      }),
      tap(lot => {
        this.loading = false;
        console.log(lot);
        this.handleSuccess();
      })
    );
  }

  updateLot() {
    this.loading = true;
    return this.comerLotService
      .update(this.lotForm.controls.id.value, this.lotForm.value)
      .pipe(
        catchError(error => {
          this.loading = false;
          this.handleError();
          return throwError(() => error);
        }),
        tap(lot => {
          this.loading = false;
          console.log(lot);
          this.handleSuccess();
        })
      );
  }

  create() {
    this.saveLot().subscribe();
  }

  update() {
    this.updateLot().subscribe();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', 'El Evento se ha ' + message);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    this.onLoadToast('error', 'Error', 'Ocurrió un  Error al Guardar el Lote');
    this.loading = false;
  }
}
