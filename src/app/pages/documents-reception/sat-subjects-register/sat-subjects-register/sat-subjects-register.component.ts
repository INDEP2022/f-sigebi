import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SAT_PAPERWORK_MAILBOX_COLUMNS,
  SAT_TRANSFER_COLUMNS,
} from './sat-subjects-register-columns';

@Component({
  selector: 'app-sat-subjects-register',
  templateUrl: './sat-subjects-register.component.html',
  styles: [],
})
export class SatSubjectsRegisterComponent extends BasePage implements OnInit {
  satForm: FormGroup;
  mailboxSettings = {
    ...this.settings,
    columns: SAT_PAPERWORK_MAILBOX_COLUMNS,
  };
  transfersSettings = { ...this.settings, columns: SAT_TRANSFER_COLUMNS };
  cordinators = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.satForm = this.fb.group({
      from: [null],
      to: [null],
      asunto: [null],
      cordinador: [null],
      document: [null],
      status: [null],
      cve: [null],
      master: [null],
      house: [null],
      expediente: [null],
    });
  }
}
