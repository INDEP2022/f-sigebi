import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-comer-event-trasp',
  templateUrl: './comer-event-trasp.component.html',
  styles: [],
})
export class ComerEventTraspComponent extends BasePage implements OnInit {
  form = this.fb.group({
    eventId: [null, Validators.required],
    processKey: [{ value: null, disabled: true }],
  });

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerEventsService: ComerEventService
  ) {
    super();
  }

  ngOnInit(): void {}

  onEventChange() {
    const { eventId } = this.form.controls;
    if (!eventId.value) {
      this.form.reset();
      return;
    }
    this.findEvent().subscribe();
  }

  findEvent() {
    const { eventId } = this.form.controls;
    const params = new FilterParams();
    params.addFilter('id', eventId.value);
    params.addFilter('eventTpId', 6, SearchFilter.LT);
    return this.comerEventsService.getAllFilter(eventId.value).pipe(
      catchError(error => {
        this.handleError();
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count == 0) {
          this.handleError();
          return;
        }
        const event = response.data[0];
        this.form.controls.processKey.setValue(event.processKey);
      })
    );
  }

  handleError() {
    this.alert('error', 'Error', 'Evento Inválido');
    this.form.reset();
  }

  confirm() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.alert('error', 'Error', 'Formulario Inválido');
      return;
    }
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
