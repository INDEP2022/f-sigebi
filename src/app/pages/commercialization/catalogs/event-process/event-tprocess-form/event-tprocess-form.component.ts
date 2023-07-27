import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//models
//Services
import { addDays, format } from 'date-fns';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerTpEventFull,
  IComerTpEventId,
} from 'src/app/core/models/ms-event/event-type.model';
import { DelegationService } from 'src/app/core/services/maintenance-delegations/delegation.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-event-tprocess-form',
  templateUrl: './event-tprocess-form.component.html',
  styles: [],
})
export class EventTProcessFormComponent extends BasePage implements OnInit {
  title: string = 'Evento';
  edit: boolean = false;

  comerEventRlForm: ModelForm<IComerTpEventFull>;
  comerEventForm: ModelForm<IComerTpEventId>;
  comerEvent: IComerTpEventFull;

  delegations = new DefaultSelect();
  typeEvent = new DefaultSelect();

  today: Date;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerTpEventosService: ComerTpEventosService,
    private delegationService: DelegationService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
    // console.log(this.comerEventForm);
  }

  private prepareForm() {
    this.comerEventRlForm = this.fb.group({
      id: [null],
      year: [null, [Validators.required]],
      phase: [null, [Validators.required]],
      topost: [null],
      warrantyDate: [null, [Validators.required]],
    });

    if (this.comerEvent != null) {
      this.edit = true;
      console.log(this.comerEvent);
      this.comerEventRlForm.patchValue(this.comerEvent);
      this.comerEventRlForm.get('id').setValue(this.comerEvent.id.id);
      this.comerEventRlForm
        .get('warrantyDate')
        .setValue(addDays(new Date(this.comerEvent.warrantyDate), 1));
      /*       this.comerEventForm.patchValue(this.comerEventRlForm.get('id').value); */
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    // this.loading = true;
    // this.comerTpEventosService.create(this.comerEventForm.value).subscribe({
    //   next: data => this.handleSuccess(),
    //   error: error => (this.loading = false),
    // });
  }

  update() {
    if (this.comerEventRlForm.get('topost').value == false) {
      this.comerEventRlForm.get('topost').setValue(null);
    } else {
      this.comerEventRlForm.get('topost').setValue(1);
    }

    const editTpEvent = {
      id: this.comerEventRlForm.get('id').value,
      year: this.comerEventRlForm.get('year').value,
      phase: this.comerEventRlForm.get('phase').value,
      topost: this.comerEventRlForm.get('topost').value,
      warrantyDate: format(
        this.comerEventRlForm.get('warrantyDate').value,
        'yyyy-MM-dd'
      ),
    };
    this.loading = true;
    this.comerTpEventosService
      .newUpdate(this.comerEvent.id.id, editTpEvent)
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

  /* getTypeEvent(params: ListParams) {
    this.comerEventosService.getAllTypeEvent(params).subscribe({
      next: data => (this.typeEvent = new DefaultSelect(data.data, data.count)),
    });
  } */
}
