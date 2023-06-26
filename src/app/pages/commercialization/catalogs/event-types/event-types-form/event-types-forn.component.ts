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
      //console.log(this.brand)
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

  create(): void {
    this.loading = true;
    this.tpEventService.createTevents(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.showError(error);
        this.loading = false;
      },
    });
  }

  handleSuccess(): void {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
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

  /* showAlert(error?: any): void {
    let action: string;
    this.edit ? (action = 'agregar') : 'editar';
    this.onLoadToast(
      'warning',
      `¡El id ingresado ya existe!`,
      'Intente nuevamente con otro Id'
    );
    error ? console.log(error) : null;
  }*/
}
