import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-create-new-event-modal',
  templateUrl: './create-new-event-modal.component.html',
  styles: [],
})
export class CreateNewEventModalComponent implements OnInit {
  title: string = 'Eventos';
  edit: boolean = false;

  eventForm: ModelForm<IComerEvent>;
  event: IComerEvent;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.eventForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      processKey: [null, []],
      tpeventoId: [null, []],
      address: [null, [, Validators.pattern(STRING_PATTERN)]],
      observations: [null, [, Validators.pattern(STRING_PATTERN)]],
      eventDate: [null, []],
      username: [null, []],
      delegationNumber: [null, []],
      statusvtaId: [null, []],
    });
    if (this.event != null) {
      this.edit = true;
      this.eventForm.patchValue(this.event);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
