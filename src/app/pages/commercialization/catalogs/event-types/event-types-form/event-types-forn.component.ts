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
  title: string = 'TIPO DE EVENTO';
  edit: boolean = false;
  newId: number = 1;

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
    console.log(this.newId);
  }

  prepareForm(): void {
    this.form = this.fb.group({
      id: [this.newId, [Validators.required, Validators.max(99)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descReceipt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeDispId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      typeFailedpId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });

    if (this.edit) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.form.patchValue(this.eventType);
    }
  }

  confirm(): void {
    this.edit ? this.update() : this.create();
  }

  close(): void {
    this.modalRef.hide();
  }

  create(): void {
    this.loading = true;
    this.tpEventService.create(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.showError(error);
        this.loading = false;
      },
    });
  }

  handleSuccess(): void {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update(): void {
    this.loading = true;
    this.tpEventService.update(this.eventType.id, this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.showError(error);
        this.loading = false;
      },
    });
  }

  showError(error?: any): void {
    let action: string;
    this.edit ? (action = 'agregar') : 'editar';
    this.onLoadToast(
      'error',
      `Error al ${action} datos`,
      'Hubo un problema al conectarse con el servior'
    );
    error ? console.log(error) : null;
  }
}
