import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//models
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//Services
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/maintenance-delegations/delegation.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-event-process-form',
  templateUrl: './event-process-form.component.html',
  styles: [],
})
export class EventProcessFormComponent extends BasePage implements OnInit {
  title: string = 'Evento';
  edit: boolean = false;

  comerEventForm: ModelForm<IComerEvent>;
  comerEvent: IComerEvent;

  delegations = new DefaultSelect();
  typeEvent = new DefaultSelect();

  today: Date;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerEventosService: ComerEventosService,
    private delegationService: DelegationService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.comerEventForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      tpeventoId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      StatusvtaId: [null, [Validators.pattern(STRING_PATTERN)]],
      processKey: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
      failedDate: [null, []],
      place: [null, [Validators.pattern(STRING_PATTERN)]],
      eventDate: [null, [Validators.pattern(STRING_PATTERN)]],
      text1: [null, [Validators.pattern(STRING_PATTERN)]],
      text2: [null, [Validators.pattern(STRING_PATTERN)]],
      signatory: [null, [Validators.pattern(STRING_PATTERN)]],
      signatoryPost: [null, [Validators.pattern(STRING_PATTERN)]],
      notes: [null, [Validators.pattern(STRING_PATTERN)]],
      textEnd3: [null, [Validators.pattern(STRING_PATTERN)]],
      textEnd4: [null, [Validators.pattern(STRING_PATTERN)]],
      basisCost: [null, [Validators.pattern(STRING_PATTERN)]],
      basisVendNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      username: [null, [Validators.pattern(STRING_PATTERN)]],
      month: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      year: [null, []],
      delegationNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      phaseInmu: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      thirdEatId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      notificationDate: [null, [Validators.pattern(STRING_PATTERN)]],
      closingEventDate: [null, [Validators.pattern(STRING_PATTERN)]],
      tpsolavalId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      applyIva: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.comerEvent != null) {
      this.edit = true;
      console.log(this.comerEvent);
      this.comerEventForm.patchValue(this.comerEvent);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.comerEventosService.create(this.comerEventForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.comerEventosService
      .update(this.comerEvent.id, this.comerEventForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Métodos para obtener información en los select dinámicos
  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: data =>
        (this.delegations = new DefaultSelect(data.data, data.count)),
    });
  }

  getTypeEvent(params: ListParams) {
    this.comerEventosService.getAllTypeEvent(params).subscribe({
      next: data => (this.typeEvent = new DefaultSelect(data.data, data.count)),
    });
  }
}
