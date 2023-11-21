import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IComerTpEvent } from '../../../../../core/models/ms-event/event-type.model';
import { ComerTpEventosService } from '../../../../../core/services/ms-event/comer-tpeventos.service';

@Component({
  selector: 'app-event-types-forn',
  templateUrl: './event-types-forn.component.html',
  styles: [],
})
export class EventTypesFornComponent extends BasePage implements OnInit {
  status: string = 'Nuevo';
  title: string = 'Tipo de evento';
  edit: boolean = false;
  comerTpEvent: IComerTpEvent;
  form: FormGroup = new FormGroup({});
  eventType: IComerTpEvent;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private tpEventService: ComerTpEventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      id: [null, [Validators.required, Validators.maxLength(2)]],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      descReceipt: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      typeDispId: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      typeFailedpId: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      use: [
        null,
        [Validators.maxLength(240), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.comerTpEvent != null) {
      this.edit = true;
      this.form.patchValue(this.comerTpEvent);
      this.form.get('id').disable();
    }
  }

  confirm(): void {
    this.edit ? this.update() : this.create();
  }

  close(): void {
    this.modalRef.hide();
  }

  update(): void {
    this.loading = true;
    const id = this.form.controls['id'].value;
    const typeDispId = this.form.controls['typeDispId'].value;
    const typeFailedpId = this.form.controls['typeFailedpId'].value;
    this.form.controls['id'].setValue(parseInt(id));
    this.form.controls['typeDispId'].setValue(parseInt(typeDispId));
    this.form.controls['typeFailedpId'].setValue(parseInt(typeFailedpId));
    this.tpEventService
      .updateTevents(this.comerTpEvent.id, this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.alert(
            'warning',
            `No es posible actualizar el tipo de evento`,
            ''
          );
          this.loading = false;
        },
      });
  }

  create(): void {
    this.loading = true;
    this.tpEventService.createTevents(this.form.getRawValue()).subscribe({
      next: data => {
        this.handleSuccess();
        this.modalRef.hide();
      },
      error: error => {
        this.alert('warning', `El No. Tipo Evento ya ha sido creado`, '');
        this.loading = false;
      },
    });
  }

  handleSuccess(): void {
    const message: string = this.edit ? 'actualizado' : 'creado';
    this.alert('success', `El evento ha sido ${message}`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
