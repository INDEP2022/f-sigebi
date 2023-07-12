import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'event-data-form',
  templateUrl: './event-data-form.component.html',
  styles: [],
})
export class EventDataFormComponent extends BasePage implements OnInit {
  eventForm = this.fb.group({
    id: [{ value: null, disabled: true }],
    processKey: [null, []],
    eventTpId: [null, []],
    place: [null],
    observations: [null],
    eventDate: [null, []],
    username: [null, []],
    delegationNumber: [null, []],
    thirdId: [null],
    baseCost: [null],
    closeDate: [null],
    failureDate: [null],
    requestType: [null],
    statusvtaId: [null, []],
    tpsolavalId: [null],
  });
  eventTypes = new DefaultSelect();
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {}
}
